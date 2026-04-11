package utez.edu.mx.nextsong.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import utez.edu.mx.nextsong.utils.TextCleaner;

@Service
public class SongsterrChordService {

    private final WebClient songsterrClient;
    private final ObjectMapper objectMapper;

    public SongsterrChordService(@Qualifier("songsterrClient") WebClient songsterrClient) {
        this.songsterrClient = songsterrClient;
        this.objectMapper = new ObjectMapper();
    }

    @Cacheable(value = "songsterrChordCache", key = "#title + '_' + #artist")
    public ChordData searchChordSource(String title, String artist) {
        if (isBlank(title) && isBlank(artist)) return null;

        try {
            String response = songsterrClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/a/ra/songs.json")
                            .queryParam("pattern", buildQuery(title, artist))
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return null;

            JsonNode root = objectMapper.readTree(response);
            if (!root.isArray() || root.isEmpty()) return null;

            for (JsonNode item : root) {
                if (!item.path("chordsPresent").asBoolean(false)) {
                    continue;
                }

                long songId = item.path("id").asLong(0);
                String songTitle = item.path("title").asText("");
                String artistName = item.path("artist").path("name").asText("");

                if (songId <= 0 || isBlank(songTitle) || isBlank(artistName)) {
                    continue;
                }

                String externalUrl = "https://www.songsterr.com/a/wsa/"
                        + slugify(artistName) + "-"
                        + slugify(songTitle)
                        + "-tab-s" + songId;

                return new ChordData(externalUrl, true);
            }
        } catch (Exception e) {
            System.err.println("[Songsterr] Fallo: " + e.getMessage());
        }

        return null;
    }

    private String buildQuery(String title, String artist) {
        String cleanTitle = TextCleaner.clean(title);
        String cleanArtist = TextCleaner.clean(artist);

        if (isBlank(cleanArtist)) return cleanTitle;
        if (isBlank(cleanTitle)) return cleanArtist;

        return cleanTitle + " " + cleanArtist;
    }

    private String slugify(String value) {
        return value.trim()
                .replaceAll("[^A-Za-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    public static class ChordData {
        public final String externalUrl;
        public final boolean chordsAvailable;

        public ChordData(String externalUrl, boolean chordsAvailable) {
            this.externalUrl = externalUrl;
            this.chordsAvailable = chordsAvailable;
        }
    }
}
