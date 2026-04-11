package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.dto.ExternalSongDTO;
import utez.edu.mx.nextsong.models.Song;
import utez.edu.mx.nextsong.repositories.SongRepository;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio orquestador que combina MusicBrainz + OpenOpus + Lyrics.ovh
 * en una sola capa limpia para el controlador.
 *
 * También permite importar una canción externa directamente a tu BD.
 */
@Service
public class ExternalSongService {

    private final MusicBrainzService musicBrainzService;
    private final OpenOpusService openOpusService;
    private final LyricsService lyricsService;
    private final SongRepository songRepository;

    public ExternalSongService(
            MusicBrainzService musicBrainzService,
            OpenOpusService openOpusService,
            LyricsService lyricsService,
            SongRepository songRepository
    ) {
        this.musicBrainzService = musicBrainzService;
        this.openOpusService    = openOpusService;
        this.lyricsService      = lyricsService;
        this.songRepository     = songRepository;
    }

    /**
     * Búsqueda combinada: busca en MusicBrainz (popular + clásica) y en OpenOpus (clásica).
     * Los resultados se mezclan y se devuelven juntos.
     *
     * @param query  texto libre: título, artista o compositor
     * @return       lista de resultados de ambas fuentes
     */
    public List<ExternalSongDTO> searchAll(String query) {
        List<ExternalSongDTO> combined = new ArrayList<>();

        // Búsqueda en MusicBrainz (música popular y clásica con metadatos)
        List<ExternalSongDTO> mbResults = musicBrainzService.searchSongs(query, 10);
        combined.addAll(mbResults);

        // Búsqueda en OpenOpus (solo clásica, pero con más contexto musical)
        List<ExternalSongDTO> opResults = openOpusService.searchWorks(query);
        combined.addAll(opResults);

        return combined;
    }

    /**
     * Busca solo por compositor en OpenOpus (ideal para exploración clásica).
     */
    public List<ExternalSongDTO> searchByComposer(String composerName) {
        return openOpusService.searchByComposer(composerName);
    }

    /**
     * Lista compositores populares del catálogo clásico.
     */
    public List<String> getPopularComposers() {
        return openOpusService.getPopularComposers();
    }

    /**
     * ⭐ IMPORTAR: Toma los datos de una búsqueda externa y los guarda en tu BD.
     *
     * Este método es el puente entre las APIs externas y tu sistema.
     * Si el usuario encuentra una canción y la quiere agregar a un evento,
     * primero la importa con este método, y luego la asigna al evento por ID.
     *
     * Proceso:
     *   1. Recibe un ExternalSongDTO (lo manda el frontend con los datos del resultado)
     *   2. Intenta jalar la letra desde Lyrics.ovh automáticamente
     *   3. Convierte el DTO a tu entidad Song
     *   4. Guarda en tu BD y retorna la Song con su ID ya asignado
     *
     * @param dto  datos de la canción externa seleccionada por el usuario
     * @return     Song guardada en BD, lista para asignar a eventos
     */
    public Song importExternalSong(ExternalSongDTO dto) {
        Song song = new Song();
        song.setTitle(dto.getTitle());
        song.setAuthor(dto.getAuthor());
        song.setDuration(dto.getDuration());
        song.setKeyTone(dto.getKeyTone());
        song.setBpm(dto.getBpm());
        song.setNotes(dto.getNotes());
        song.setStatus("active");

        // Intentar jalar letra automáticamente si no viene ya en el DTO
        if ((dto.getLyrics() == null || dto.getLyrics().isBlank())
                && dto.getAuthor() != null && dto.getTitle() != null) {

            String lyrics = lyricsService.getLyrics(dto.getAuthor(), dto.getTitle());
            song.setLyrics(lyrics); // puede ser null si no existe letra (música instrumental)
        } else {
            song.setLyrics(dto.getLyrics());
        }

        // chords/partitura no viene de APIs externas — queda null para que el usuario la agregue después
        song.setChords(null);

        return songRepository.save(song);
    }

    /**
     * Busca la letra de una canción que YA está en tu BD y la actualiza.
     * Útil si una canción fue creada sin letra y se quiere completar automáticamente.
     *
     * @param songId  ID de tu Song en BD
     * @return        Song actualizada con la letra, o null si no se encontró
     */
    public Song enrichLyrics(Long songId) {
        Song song = songRepository.findById(songId).orElse(null);
        if (song == null) return null;

        if (song.getAuthor() != null && song.getTitle() != null) {
            String lyrics = lyricsService.getLyrics(song.getAuthor(), song.getTitle());
            if (lyrics != null) {
                song.setLyrics(lyrics);
                return songRepository.save(song);
            }
        }

        return song; // regresa sin cambios si no se encontró letra
    }
}
