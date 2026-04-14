package utez.edu.mx.nextsong.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Servicio que jala BPM y tonalidad desde AcousticBrainz.
 * <p>
 * API 100% gratuita y sin autenticación.
 * <p>
 * Endpoint: GET https://acousticbrainz.org/{mbid}/low-level
 * Devuelve análisis de audio: BPM, tonalidad, modo (mayor/menor), etc.
 * <p>
 * Nota: AcousticBrainz tiene datos para ~7 millones de canciones.
 * Si no existe el MBID, regresa null sin romper el flujo.
 */
@Service
public class AcousticBrainzService {

    private final WebClient acousticBrainzClient;
    private final ObjectMapper objectMapper;

    public AcousticBrainzService(@Qualifier("acousticBrainzClient") WebClient acousticBrainzClient) {
        this.acousticBrainzClient = acousticBrainzClient;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Datos de audio de una canción por su MusicBrainz ID.
     *
     * @param mbid ID de MusicBrainz, ej: "5b11f4ce-a62d-471e-81fc-a69a8278c7da"
     * @return AudioData con bpm y keyTone, o null si no existe
     */
    @Cacheable(value = "acousticBrainzCache", key = "#mbid")
    public AudioData getAudioData(String mbid) {
        if (mbid == null || mbid.isBlank()) return null;

        try {
            String response = acousticBrainzClient.get()
                    .uri("/{mbid}/low-level", mbid)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return null;

            JsonNode root = objectMapper.readTree(response);

            // BPM está en rhythm.bpm
            double bpmDouble = root.path("rhythm").path("bpm").asDouble(0);
            Integer bpm = bpmDouble > 0 ? (int) Math.round(bpmDouble) : null;

            // Tonalidad: tonal.key_key + tonal.key_scale (ej: "C" + "major" → "C mayor")
            String keyKey = root.path("tonal").path("key_key").asText("");
            String keyScale = root.path("tonal").path("key_scale").asText("");

            String keyTone = null;
            if (!keyKey.isBlank()) {
                // Traducir major/minor al español
                String scaleEs = keyScale.equalsIgnoreCase("major") ? "mayor"
                        : keyScale.equalsIgnoreCase("minor") ? "menor"
                        : keyScale;
                keyTone = keyKey + (scaleEs.isBlank() ? "" : " " + scaleEs);
            }

            if (bpm == null && keyTone == null) return null;

            return new AudioData(bpm, keyTone);

        } catch (Exception e) {
            System.err.println("[AcousticBrainzService] No se encontraron datos para MBID: " + mbid);
            return null;
        }
    }

    /**
     * Clase simple para retornar BPM y tonalidad juntos.
     */
    public static class AudioData {
        public final Integer bpm;
        public final String keyTone;

        public AudioData(Integer bpm, String keyTone) {
            this.bpm = bpm;
            this.keyTone = keyTone;
        }
    }
}
