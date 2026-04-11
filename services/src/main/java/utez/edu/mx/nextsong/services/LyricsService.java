package utez.edu.mx.nextsong.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class LyricsService {

    private final WebClient lyricsClient;
    private final WebClient happiClient;
    private final WebClient lrclibClient;
    private final ObjectMapper objectMapper;

    @Value("${happi.api.key}")
    private String happiApiKey;

    public LyricsService(
            @Qualifier("lyricsClient") WebClient lyricsClient,
            @Qualifier("happiClient") WebClient happiClient,
            @Qualifier("lrclibClient") WebClient lrclibClient
    ) {
        this.lyricsClient = lyricsClient;
        this.happiClient = happiClient;
        this.lrclibClient = lrclibClient;
        this.objectMapper = new ObjectMapper();
    }

    @Cacheable(value = "lyricsCache", key = "#artist + '_' + #title")
    public String getLyrics(String artist, String title) {

        System.out.println("[Lyrics DEBUG] " + artist + " - " + title);

        String lyrics = getLyricsFromOvh(artist, title);
        if (lyrics != null) return lyrics;

        lyrics = getLyricsFromLrcLib(artist, title);
        if (lyrics != null) return lyrics;

        lyrics = getLyricsFromHappi(artist, title);
        if (lyrics != null) return lyrics;

        System.err.println("[LyricsService] No encontrada letra: " + artist + " - " + title);
        return null;
    }

    private String getLyricsFromOvh(String artist, String title) {
        try {
            String cleanArtist = URLEncoder.encode(artist, StandardCharsets.UTF_8);
            String cleanTitle  = URLEncoder.encode(title, StandardCharsets.UTF_8);

            String response = lyricsClient.get()
                    .uri("/{artist}/{title}", cleanArtist, cleanTitle)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return null;

            JsonNode root = objectMapper.readTree(response);

            if (root.has("error")) {
                System.out.println("[Lyrics.ovh] Error: " + root.get("error").asText());
                return null;
            }

            String lyrics = root.path("lyrics").asText("");
            return lyrics.isBlank() ? null : lyrics;

        } catch (Exception e) {
            System.err.println("[Lyrics.ovh] Falló: " + e.getMessage());
            return null;
        }
    }

    private String getLyricsFromHappi(String artist, String title) {
        try {
            String query = artist + " " + title;

            String searchResponse = happiClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/music")
                            .queryParam("q", query)
                            .queryParam("limit", "1")
                            .queryParam("type", "track")
                            .queryParam("apikey", happiApiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (searchResponse == null) return null;

            JsonNode searchRoot = objectMapper.readTree(searchResponse);

            if (!searchRoot.path("success").asBoolean(false)) return null;

            JsonNode results = searchRoot.path("result");
            if (!results.isArray() || results.isEmpty()) return null;

            JsonNode track = results.get(0);

            if (!track.path("haslyrics").asBoolean(false)) return null;

            String apiLyrics = track.path("api_lyrics").asText("");
            if (apiLyrics.isBlank()) return null;

            String lyricsResponse = happiClient.get()
                    .uri(apiLyrics + "?apikey=" + happiApiKey)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (lyricsResponse == null) return null;

            JsonNode lyricsRoot = objectMapper.readTree(lyricsResponse);

            if (!lyricsRoot.path("success").asBoolean(false)) return null;

            String lyrics = lyricsRoot.path("result").path("lyrics").asText("");
            return lyrics.isBlank() ? null : lyrics;

        } catch (Exception e) {
            System.err.println("[Happi.dev] Falló: " + e.getMessage());
            return null;
        }
    }

    private String getLyricsFromLrcLib(String artist, String title) {
        try {
            String response = lrclibClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/get")
                            .queryParam("artist_name", artist)
                            .queryParam("track_name", title)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return null;

            JsonNode root = objectMapper.readTree(response);

            String plainLyrics = root.path("plainLyrics").asText("");
            if (!plainLyrics.isBlank()) {
                return plainLyrics;
            }

            String syncedLyrics = root.path("syncedLyrics").asText("");
            return syncedLyrics.isBlank() ? null : syncedLyrics;

        } catch (Exception e) {
            System.err.println("[LRCLIB] Fallo: " + e.getMessage());
            return null;
        }
    }
}
