package utez.edu.mx.nextsong.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import utez.edu.mx.nextsong.dto.ExternalSongDTO;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio que consulta MusicBrainz para obtener metadatos de canciones.
 * Cubre tanto música popular como clásica.
 *
 * API gratuita, sin key. Límite: 1 req/segundo.
 * Se usa @Cacheable para no spamear con la misma búsqueda.
 */
@Service
public class MusicBrainzService {

    private final WebClient musicBrainzClient;
    private final ObjectMapper objectMapper;

    public MusicBrainzService(@Qualifier("musicBrainzClient") WebClient musicBrainzClient) {
        this.musicBrainzClient = musicBrainzClient;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Busca canciones por título/artista en MusicBrainz.
     * @param query  texto libre, ej: "bohemian rhapsody queen"
     * @param limit  máximo de resultados (recomendado: 10)
     */
    @Cacheable(value = "musicbrainzSearch", key = "#query + '_' + #limit")
    public List<ExternalSongDTO> searchSongs(String query, int limit) {
        List<ExternalSongDTO> results = new ArrayList<>();

        try {
            String response = musicBrainzClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/recording")
                            .queryParam("query", query)
                            .queryParam("limit", limit)
                            .queryParam("fmt", "json")
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return results;

            JsonNode root = objectMapper.readTree(response);
            JsonNode recordings = root.path("recordings");

            for (JsonNode rec : recordings) {
                ExternalSongDTO dto = new ExternalSongDTO();
                dto.setExternalId(rec.path("id").asText(""));
                dto.setSource("musicbrainz");
                dto.setTitle(rec.path("title").asText("Sin título"));

                // Duración viene en milisegundos
                int lengthMs = rec.path("length").asInt(0);
                if (lengthMs > 0) {
                    int totalSec = lengthMs / 1000;
                    dto.setDuration(String.format("%d:%02d", totalSec / 60, totalSec % 60));
                }

                // Artista principal
                JsonNode artistCredit = rec.path("artist-credit");
                if (artistCredit.isArray() && artistCredit.size() > 0) {
                    dto.setAuthor(artistCredit.get(0).path("artist").path("name").asText("Desconocido"));
                }

                // Género (viene en tags si los tiene)
                JsonNode tags = rec.path("tags");
                if (tags.isArray() && tags.size() > 0) {
                    dto.setGenre(tags.get(0).path("name").asText(""));
                }

                dto.setNotes("Fuente: MusicBrainz — ID: " + dto.getExternalId());
                results.add(dto);
            }

        } catch (Exception e) {
            // Si la API falla, regresamos lista vacía sin romper el flujo principal
            System.err.println("[MusicBrainzService] Error al consultar API: " + e.getMessage());
        }

        return results;
    }

    /**
     * Obtiene detalle de una canción específica por su MusicBrainz ID.
     * Útil cuando el usuario ya seleccionó una canción y quiere importarla.
     */
    @Cacheable(value = "musicbrainzDetail", key = "#mbid")
    public ExternalSongDTO getSongDetail(String mbid) {
        try {
            String response = musicBrainzClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/recording/{mbid}")
                            .queryParam("fmt", "json")
                            .queryParam("inc", "artist-credits+tags")
                            .build(mbid))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return null;

            JsonNode rec = objectMapper.readTree(response);
            ExternalSongDTO dto = new ExternalSongDTO();
            dto.setExternalId(mbid);
            dto.setSource("musicbrainz");
            dto.setTitle(rec.path("title").asText("Sin título"));

            int lengthMs = rec.path("length").asInt(0);
            if (lengthMs > 0) {
                int totalSec = lengthMs / 1000;
                dto.setDuration(String.format("%d:%02d", totalSec / 60, totalSec % 60));
            }

            JsonNode artistCredit = rec.path("artist-credit");
            if (artistCredit.isArray() && artistCredit.size() > 0) {
                dto.setAuthor(artistCredit.get(0).path("artist").path("name").asText("Desconocido"));
            }

            return dto;

        } catch (Exception e) {
            System.err.println("[MusicBrainzService] Error al obtener detalle: " + e.getMessage());
            return null;
        }
    }
}
