package utez.edu.mx.nextsong.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableCaching
public class WebClientConfig {

    @Bean(name = "musicBrainzClient")
    public WebClient musicBrainzClient() {
        return WebClient.builder()
                .baseUrl("https://musicbrainz.org/ws/2")
                .defaultHeader("User-Agent", "NextSong/1.0 (utez.edu.mx)")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    @Bean(name = "lyricsClient")
    public WebClient lyricsClient() {
        return WebClient.builder()
                .baseUrl("https://api.lyrics.ovh/v1")
                .build();
    }

    @Bean(name = "openOpusClient")
    public WebClient openOpusClient() {
        return WebClient.builder()
                .baseUrl("https://api.openopus.org")
                .build();
    }

    @Bean(name = "acousticBrainzClient")
    public WebClient acousticBrainzClient() {
        return WebClient.builder()
                .baseUrl("https://acousticbrainz.org")
                .defaultHeader("User-Agent", "NextSong/1.0 (utez.edu.mx)")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    @Bean(name = "happiClient")
    public WebClient happiClient() {
        return WebClient.builder()
                .baseUrl("https://api.happi.dev")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    @Bean(name = "itunesClient")
    public WebClient itunesClient() {
        return WebClient.builder()
                .baseUrl("https://itunes.apple.com")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    @Bean(name = "lrclibClient")
    public WebClient lrclibClient() {
        return WebClient.builder()
                .baseUrl("https://lrclib.net")
                .defaultHeader("User-Agent", "NextSong/1.0 (utez.edu.mx)")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    @Bean(name = "songsterrClient")
    public WebClient songsterrClient() {
        return WebClient.builder()
                .baseUrl("https://www.songsterr.com")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    @Bean(name = "lastFmClient")
    public WebClient lastFmClient() {
        return WebClient.builder()
                .baseUrl("https://ws.audioscrobbler.com/2.0")
                .defaultHeader("Accept", "application/json")
                .build();
    }
}
