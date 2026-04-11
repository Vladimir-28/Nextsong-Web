package utez.edu.mx.nextsong.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.dto.ExternalSongDTO;
import utez.edu.mx.nextsong.models.Song;
import utez.edu.mx.nextsong.services.ExternalSongService;

import java.util.List;

/**
 * Controlador para búsqueda e importación de canciones desde APIs externas.
 *
 * ✅ NO modifica ni reemplaza SongController.java
 * ✅ Se agrega como ruta separada: /external-songs/*
 *
 * Flujo de uso desde la app:
 *   1. GET /external-songs/search?q=beethoven  → usuario ve resultados externos
 *   2. POST /external-songs/import             → usuario importa la que eligió a tu BD
 *   3. (Ya con ID en BD) → asigna al evento normalmente con EventSongController
 */
@RestController
@RequestMapping("/external-songs")
@CrossOrigin(origins = "*")
public class ExternalSongController {

    private final ExternalSongService externalSongService;

    public ExternalSongController(ExternalSongService externalSongService) {
        this.externalSongService = externalSongService;
    }

    /**
     * Búsqueda combinada en MusicBrainz + OpenOpus.
     *
     * GET /external-songs/search?q=queen
     * GET /external-songs/search?q=fur+elise
     * GET /external-songs/search?q=bach
     */
    @GetMapping("/search")
    public ResponseEntity<List<ExternalSongDTO>> search(@RequestParam("q") String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        List<ExternalSongDTO> results = externalSongService.searchAll(query.trim());
        return ResponseEntity.ok(results);
    }

    /**
     * Busca solo por compositor en OpenOpus (para el módulo de música clásica).
     *
     * GET /external-songs/composer?name=Mozart
     */
    @GetMapping("/composer")
    public ResponseEntity<List<ExternalSongDTO>> searchByComposer(@RequestParam("name") String name) {
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        List<ExternalSongDTO> results = externalSongService.searchByComposer(name.trim());
        return ResponseEntity.ok(results);
    }

    /**
     * Lista compositores populares del catálogo clásico.
     * Útil para mostrar un menú de exploración en la pantalla de agregar canción.
     *
     * GET /external-songs/composers/popular
     */
    @GetMapping("/composers/popular")
    public ResponseEntity<List<String>> popularComposers() {
        return ResponseEntity.ok(externalSongService.getPopularComposers());
    }

    /**
     * ⭐ Importar canción externa a tu BD.
     *
     * El usuario encontró una canción en el buscador y quiere agregarla a un evento.
     * Este endpoint la guarda en tu BD y devuelve la Song con su ID.
     *
     * POST /external-songs/import
     * Body: { "title": "...", "author": "...", "source": "musicbrainz", ... }
     *
     * Después de esto, el frontend usa el ID devuelto para asignarla al evento
     * con el endpoint de EventSongController que ya tienes.
     */
    @PostMapping("/import")
    public ResponseEntity<Song> importSong(@RequestBody ExternalSongDTO dto) {
        if (dto == null || dto.getTitle() == null || dto.getTitle().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Song saved = externalSongService.importExternalSong(dto);
        return ResponseEntity.ok(saved);
    }

    /**
     * Enriquecer letra de una canción que ya existe en tu BD.
     * Útil si una canción fue creada sin letra y se quiere completar automáticamente.
     *
     * PATCH /external-songs/{id}/enrich-lyrics
     */
    @PatchMapping("/{id}/enrich-lyrics")
    public ResponseEntity<Song> enrichLyrics(@PathVariable Long id) {
        Song updated = externalSongService.enrichLyrics(id);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}
