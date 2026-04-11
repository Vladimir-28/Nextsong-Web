package utez.edu.mx.nextsong.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class LastFmMetadataService {

    private final WebClient lastFmClient;
    private final ObjectMapper objectMapper;

    @Value("${lastfm.api.key:}")
    private String lastFmApiKey;

    public LastFmMetadataService(@Qualifier("lastFmClient") WebClient lastFmClient) {
        this.lastFmClient = lastFmClient;
        this.objectMapper = new ObjectMapper();
    }

    @Cacheable(value = "lastFmTrackMetadataCache", key = "#artist + '_' + #title")
    public TrackMetadata enrichTrack(String artist, String title) {
        if (isBlank(lastFmApiKey) || isBlank(artist) || isBlank(title)) {
            return null;
        }

        TrackCorrection correction = getTrackCorrection(artist, title);
        String resolvedArtist = correction != null && !isBlank(correction.artist) ? correction.artist : artist;
        String resolvedTitle = correction != null && !isBlank(correction.title) ? correction.title : title;

        return getTrackInfo(resolvedArtist, resolvedTitle);
    }

    private TrackCorrection getTrackCorrection(String artist, String title) {
        try {
            String response = lastFmClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("method", "track.getCorrection")
                            .queryParam("artist", artist)
                            .queryParam("track", title)
                            .queryParam("api_key", lastFmApiKey)
                            .queryParam("format", "json")
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return null;

            JsonNode root = objectMapper.readTree(response);
            JsonNode correctedTrack = root.path("corrections").path("correction").path("track");
            if (correctedTrack.isMissingNode()) return null;

            return new TrackCorrection(
                    textOrNull(correctedTrack.path("artist").path("name").asText("")),
                    textOrNull(correctedTrack.path("name").asText(""))
            );
        } catch (Exception e) {
            System.err.println("[Last.fm correction] Fallo: " + e.getMessage());
            return null;
        }
    }

    private TrackMetadata getTrackInfo(String artist, String title) {
        try {
            String response = lastFmClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("method", "track.getInfo")
                            .queryParam("artist", artist)
                            .queryParam("track", title)
                            .queryParam("api_key", lastFmApiKey)
                            .queryParam("format", "json")
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return null;

            JsonNode root = objectMapper.readTree(response);
            JsonNode track = root.path("track");
            if (track.isMissingNode()) return null;

            String duration = null;
            long durationMs = track.path("duration").asLong(0);
            if (durationMs > 0) {
                long totalSeconds = durationMs / 1000;
                duration = String.format("%d:%02d", totalSeconds / 60, totalSeconds % 60);
            }

            String genre = null;
            JsonNode tags = track.path("toptags").path("tag");
            if (tags.isArray() && !tags.isEmpty()) {
                genre = textOrNull(tags.get(0).path("name").asText(""));
            }

            return new TrackMetadata(
                    textOrNull(track.path("name").asText("")),
                    textOrNull(track.path("artist").path("name").asText("")),
                    duration,
                    genre
            );
        } catch (Exception e) {
            System.err.println("[Last.fm info] Fallo: " + e.getMessage());
            return null;
        }
    }

    private String textOrNull(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private record TrackCorrection(String artist, String title) {
    }

    public record TrackMetadata(String title, String artist, String duration, String genre) {
    }
}
