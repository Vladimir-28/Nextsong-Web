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
 * Servicio que consulta OpenOpus para música clásica.
 *
 * OpenOpus tiene un catálogo de más de 20,000 obras clásicas de dominio público.
 * API gratuita, sin autenticación.
 * Documentación: https://openopus.org/api-documentation
 */
@Service
public class OpenOpusService {

    private final WebClient openOpusClient;
    private final ObjectMapper objectMapper;

    public OpenOpusService(@Qualifier("openOpusClient") WebClient openOpusClient) {
        this.openOpusClient = openOpusClient;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Busca obras clásicas por nombre de compositor.
     * @param composerName  ej: "Bach", "Mozart", "Beethoven"
     */
    @Cacheable(value = "openOpusComposer", key = "#composerName")
    public List<ExternalSongDTO> searchByComposer(String composerName) {
        List<ExternalSongDTO> results = new ArrayList<>();

        try {
            // Paso 1: buscar el compositor
            String composerResponse = openOpusClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/composer/list/search/{name}.json")
                            .build(composerName))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (composerResponse == null) return results;

            JsonNode composerRoot = objectMapper.readTree(composerResponse);
            JsonNode composers = composerRoot.path("composers");

            if (!composers.isArray() || composers.isEmpty()) return results;

            // Tomamos el primer compositor encontrado
            JsonNode composer = composers.get(0);
            String composerId = composer.path("id").asText();
            String composerFullName = composer.path("complete_name").asText(composerName);

            // Paso 2: obtener obras de ese compositor
            String worksResponse = openOpusClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/work/list/composer/{id}/genre/all.json")
                            .build(composerId))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (worksResponse == null) return results;

            JsonNode worksRoot = objectMapper.readTree(worksResponse);
            JsonNode works = worksRoot.path("works");

            for (JsonNode work : works) {
                ExternalSongDTO dto = new ExternalSongDTO();
                dto.setExternalId("openopus_" + work.path("id").asText());
                dto.setSource("openopus");
                dto.setTitle(work.path("title").asText("Sin título"));
                dto.setAuthor(composerFullName);
                dto.setGenre(work.path("genre").asText("Clásica"));
                dto.setNotes("Época: " + work.path("epoch").asText("") +
                             " | Género: " + work.path("genre").asText(""));
                results.add(dto);
            }

        } catch (Exception e) {
            System.err.println("[OpenOpusService] Error al buscar compositor: " + e.getMessage());
        }

        return results;
    }

    /**
     * Búsqueda general de obras clásicas por texto libre.
     * @param query  ej: "Für Elise", "Symphony No. 5"
     */
    @Cacheable(value = "openOpusSearch", key = "#query")
    public List<ExternalSongDTO> searchWorks(String query) {
        List<ExternalSongDTO> results = new ArrayList<>();

        try {
            String response = openOpusClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/work/list/search/{query}.json")
                            .build(query))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return results;

            JsonNode root = objectMapper.readTree(response);
            JsonNode works = root.path("works");

            for (JsonNode work : works) {
                ExternalSongDTO dto = new ExternalSongDTO();
                dto.setExternalId("openopus_" + work.path("id").asText());
                dto.setSource("openopus");
                dto.setTitle(work.path("title").asText("Sin título"));
                dto.setGenre(work.path("genre").asText("Clásica"));

                // El compositor viene anidado en algunos endpoints
                JsonNode composerNode = work.path("composer");
                if (!composerNode.isMissingNode()) {
                    dto.setAuthor(composerNode.path("complete_name").asText("Desconocido"));
                }

                dto.setNotes("Época: " + work.path("epoch").asText(""));
                results.add(dto);
            }

        } catch (Exception e) {
            System.err.println("[OpenOpusService] Error en búsqueda: " + e.getMessage());
        }

        return results;
    }

    /**
     * Lista los compositores más populares del catálogo.
     * Útil para mostrar un menú de exploración en la app.
     */
    @Cacheable(value = "openOpusPopular")
    public List<String> getPopularComposers() {
        List<String> composers = new ArrayList<>();

        try {
            String response = openOpusClient.get()
                    .uri("/composer/list/pop.json")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) return composers;

            JsonNode root = objectMapper.readTree(response);
            JsonNode composerList = root.path("composers");

            for (JsonNode c : composerList) {
                composers.add(c.path("complete_name").asText());
            }

        } catch (Exception e) {
            System.err.println("[OpenOpusService] Error al listar compositores: " + e.getMessage());
        }

        return composers;
    }
}
