package utez.edu.mx.nextsong.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.time.Duration;
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
        if (artist == null || title == null) return null;

        System.out.println("[Lyrics DEBUG] " + artist + " - " + title);

        String lyrics = getLyricsFromOvh(artist, title);
        if (lyrics != null) return lyrics;

        lyrics = getLyricsFromLrcLib(artist, title);
        if (lyrics != null) return lyrics;

        return getLyricsFromHappi(artist, title);
    }

    private String getLyricsFromOvh(String artist, String title) {
        try {
            String response = lyricsClient.get()
                    .uri("/{artist}/{title}", URLEncoder.encode(artist, StandardCharsets.UTF_8), URLEncoder.encode(title, StandardCharsets.UTF_8))
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(4)) // Protección contra lentitud
                    .block();

            if (response == null) return null;
            JsonNode root = objectMapper.readTree(response);
            String lyrics = root.path("lyrics").asText("");
            return lyrics.isBlank() ? null : lyrics;
        } catch (Exception e) {
            return null;
        }
    }

    private String getLyricsFromLrcLib(String artist, String title) {
        try {
            String response = lrclibClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/get")  // ✅ antes era /get, el correcto es /api/get
                            .queryParam("artist_name", artist)
                            .queryParam("track_name", title)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(4))
                    .block();

            if (response == null) return null;
            JsonNode root = objectMapper.readTree(response);

            // Preferimos plainLyrics (texto limpio)
            String plainLyrics = root.path("plainLyrics").asText("");
            if (!plainLyrics.isBlank()) return plainLyrics;

            // Fallback: syncedLyrics limpiando timestamps
            String synced = root.path("syncedLyrics").asText("");
            if (!synced.isBlank()) {
                return synced.replaceAll("\\[\\d{2}:\\d{2}\\.\\d{2,3}\\]\\s*", "").trim();
            }

            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private String getLyricsFromHappi(String artist, String title) {
        try {
            String searchResponse = happiClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/v1/music")
                            .queryParam("q", artist + " " + title)
                            .queryParam("limit", "1")
                            .queryParam("type", "track")
                            .queryParam("apikey", happiApiKey).build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            if (searchResponse == null) return null;
            JsonNode searchRoot = objectMapper.readTree(searchResponse);
            if (!searchRoot.path("success").asBoolean()) return null;

            JsonNode track = searchRoot.path("result").get(0);
            if (track == null || !track.path("haslyrics").asBoolean()) return null;

            String apiLyrics = track.path("api_lyrics").asText("");
            String lyricsResponse = happiClient.get()
                    .uri(apiLyrics + "?apikey=" + happiApiKey)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            if (lyricsResponse == null) return null;
            JsonNode lyricsRoot = objectMapper.readTree(lyricsResponse);
            return lyricsRoot.path("result").path("lyrics").asText(null);
        } catch (Exception e) {
            return null;
        }
    }
}