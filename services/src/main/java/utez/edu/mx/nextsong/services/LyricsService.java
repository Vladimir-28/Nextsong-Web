package utez.edu.mx.nextsong.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Servicio que jala letras de canciones desde Lyrics.ovh
 *
 * API 100% gratuita y sin autenticación.
 * Endpoint: GET https://api.lyrics.ovh/v1/{artista}/{cancion}
 *
 * Limitación: funciona mejor con música popular en inglés/español.
 * Para música clásica instrumental no aplica (no tiene letra).
 */
@Service
public class LyricsService {

    private final WebClient lyricsClient;
    private final ObjectMapper objectMapper;

    public LyricsService(@Qualifier("lyricsClient") WebClient lyricsClient) {
        this.lyricsClient = lyricsClient;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Obtiene la letra de una canción dado artista y título.
     * @param artist  nombre del artista, ej: "Queen"
     * @param title   título de la canción, ej: "Bohemian Rhapsody"
     * @return        letra completa como String, o null si no se encontró
     */
    @Cacheable(value = "lyricsCache", key = "#artist + '_' + #title")
    public String getLyrics(String artist, String title) {
        try {
            // Limpiamos caracteres especiales que rompen la URL
            String cleanArtist = encodeForUrl(artist);
            String cleanTitle  = encodeForUrl(title);

            String response = lyricsClient.get()
                    .uri("/{artist}/{title}", cleanArtist, cleanTitle)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return null;

            JsonNode root = objectMapper.readTree(response);

            // La API responde con {"lyrics": "..."} o {"error": "No lyrics found"}
            if (root.has("error")) {
                return null;
            }

            String lyrics = root.path("lyrics").asText("");
            return lyrics.isBlank() ? null : lyrics;

        } catch (Exception e) {
            System.err.println("[LyricsService] No se encontró letra para: " + artist + " - " + title);
            return null;
        }
    }

    /**
     * Limpia el texto para usarlo en URL (quita caracteres problemáticos).
     */
    private String encodeForUrl(String text) {
        if (text == null) return "";
        return text
                .replace("&", "and")
                .replace("/", " ")
                .replace("?", "")
                .replace("#", "")
                .trim();
    }
}
