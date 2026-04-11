package utez.edu.mx.nextsong.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import utez.edu.mx.nextsong.utils.TextCleaner;

@Service
public class ItunesMetadataService {

    private final WebClient itunesClient;
    private final ObjectMapper objectMapper;

    public ItunesMetadataService(@Qualifier("itunesClient") WebClient itunesClient) {
        this.itunesClient = itunesClient;
        this.objectMapper = new ObjectMapper();
    }

    @Cacheable(value = "itunesMetadataCache", key = "#title + '_' + #artist")
    public TrackData searchTrack(String title, String artist) {
        if (isBlank(title) && isBlank(artist)) return null;

        try {
            String query = buildQuery(title, artist);

            String response = itunesClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("term", query)
                            .queryParam("media", "music")
                            .queryParam("entity", "song")
                            .queryParam("limit", "5")
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return null;

            JsonNode root = objectMapper.readTree(response);
            JsonNode results = root.path("results");
            if (!results.isArray() || results.isEmpty()) return null;

            JsonNode bestMatch = results.get(0);

            Integer duration = null;
            long trackTimeMillis = bestMatch.path("trackTimeMillis").asLong(0);
            if (trackTimeMillis > 0) {
                long totalSeconds = trackTimeMillis / 1000;
                duration = (int) totalSeconds;
            }

            return new TrackData(
                    duration != null ? String.format("%d:%02d", duration / 60, duration % 60) : null,
                    textOrNull(bestMatch.path("artworkUrl100").asText("")),
                    textOrNull(bestMatch.path("artistName").asText("")),
                    textOrNull(bestMatch.path("trackName").asText(""))
            );

        } catch (Exception e) {
            System.err.println("[iTunes] Fallo: " + e.getMessage());
            return null;
        }
    }

    private String buildQuery(String title, String artist) {
        String cleanTitle = TextCleaner.clean(title);
        String cleanArtist = TextCleaner.clean(artist);

        if (isBlank(cleanArtist)) return cleanTitle;
        if (isBlank(cleanTitle)) return cleanArtist;

        return cleanTitle + " " + cleanArtist;
    }

    private String textOrNull(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    public static class TrackData {
        public final String duration;
        public final String artworkUrl;
        public final String artistName;
        public final String trackName;

        public TrackData(String duration, String artworkUrl, String artistName, String trackName) {
            this.duration = duration;
            this.artworkUrl = artworkUrl;
            this.artistName = artistName;
            this.trackName = trackName;
        }
    }
}
