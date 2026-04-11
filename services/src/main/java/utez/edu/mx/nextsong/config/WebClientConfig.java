package utez.edu.mx.nextsong.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuración de WebClient para consumir APIs externas.
 * Se crean 3 beans separados, uno por cada API.
 */
@Configuration
@EnableCaching  // ✅ Activa el caché para no spamear las APIs externas
public class WebClientConfig {

    /**
     * MusicBrainz — metadatos de canciones populares y clásicas
     * Documentación: https://musicbrainz.org/doc/MusicBrainz_API
     */
    @Bean(name = "musicBrainzClient")
    public WebClient musicBrainzClient() {
        return WebClient.builder()
                .baseUrl("https://musicbrainz.org/ws/2")
                // ⚠️ MusicBrainz REQUIERE User-Agent identificado o bloquea la petición
                .defaultHeader("User-Agent", "NextSong/1.0 (utez.edu.mx)")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    /**
     * Lyrics.ovh — letras de canciones gratis, sin autenticación
     * Documentación: https://lyricsovh.docs.apiary.io
     */
    @Bean(name = "lyricsClient")
    public WebClient lyricsClient() {
        return WebClient.builder()
                .baseUrl("https://api.lyrics.ovh/v1")
                .build();
    }

    /**
     * OpenOpus — catálogo de música clásica de dominio público
     * Documentación: https://openopus.org
     */
    @Bean(name = "openOpusClient")
    public WebClient openOpusClient() {
        return WebClient.builder()
                .baseUrl("https://api.openopus.org")
                .build();
    }
}
