package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.dto.ExternalSongDTO;
import utez.edu.mx.nextsong.models.Song;
import utez.edu.mx.nextsong.repositories.SongRepository;
import utez.edu.mx.nextsong.utils.TextCleaner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
public class ExternalSongService {

    private final MusicBrainzService musicBrainzService;
    private final OpenOpusService openOpusService;
    private final LyricsService lyricsService;
    private final AcousticBrainzService acousticBrainzService;
    private final ItunesMetadataService itunesMetadataService;
    private final LastFmMetadataService lastFmMetadataService;
    private final SongsterrChordService songsterrChordService;
    private final SongRepository songRepository;

    public ExternalSongService(
            MusicBrainzService musicBrainzService,
            OpenOpusService openOpusService,
            LyricsService lyricsService,
            AcousticBrainzService acousticBrainzService,
            ItunesMetadataService itunesMetadataService,
            LastFmMetadataService lastFmMetadataService,
            SongsterrChordService songsterrChordService,
            SongRepository songRepository
    ) {
        this.musicBrainzService    = musicBrainzService;
        this.openOpusService       = openOpusService;
        this.lyricsService         = lyricsService;
        this.acousticBrainzService = acousticBrainzService;
        this.itunesMetadataService = itunesMetadataService;
        this.lastFmMetadataService = lastFmMetadataService;
        this.songsterrChordService = songsterrChordService;
        this.songRepository        = songRepository;
    }

    public List<ExternalSongDTO> searchAll(String query) {
        List<ExternalSongDTO> combined = new ArrayList<>();
        combined.addAll(musicBrainzService.searchSongs(query, 10));
        combined.addAll(openOpusService.searchWorks(query));
        combined.forEach(this::completeMetadata);
        return combined;
    }

    public List<ExternalSongDTO> searchByComposer(String composerName) {
        List<ExternalSongDTO> results = openOpusService.searchByComposer(composerName);
        results.forEach(this::completeMetadata);
        return results;
    }

    public List<String> getPopularComposers() {
        return openOpusService.getPopularComposers();
    }

    /**
     * Importa una canción externa a la BD.
     * Intenta completar todos los datos posibles desde las APIs.
     * Si faltan datos (letra, BPM, tonalidad), se guarda de todas formas
     * con los campos disponibles — el usuario puede completarlos después.
     */
    public Song importExternalSong(ExternalSongDTO dto) {
        completeMetadata(dto);

        Song song = new Song();

        String cleanArtist = TextCleaner.clean(dto.getAuthor());
        String cleanTitle  = TextCleaner.clean(dto.getTitle());

        song.setTitle(cleanTitle);
        song.setAuthor(cleanArtist);
        song.setDuration(dto.getDuration());
        song.setNotes(buildNotes(dto));
        song.setStatus("active");
        song.setBpm(dto.getBpm());
        song.setKeyTone(dto.getKeyTone());

        // Letra: usar la que ya viene en el DTO (fue buscada en completeMetadata)
        song.setLyrics(!isBlank(dto.getLyrics()) ? dto.getLyrics() : null);

        // Acordes: si Songsterr encontró un enlace, guardarlo en chords como referencia
        if (!isBlank(dto.getChordSourceUrl())) {
            song.setChords("Acordes disponibles en: " + dto.getChordSourceUrl());
        } else {
            song.setChords(null);
        }

        return songRepository.save(song);
    }

    public Song enrichLyrics(Long songId) {
        Song song = songRepository.findById(songId).orElse(null);
        if (song == null) return null;

        String lyrics = lyricsService.getLyrics(song.getAuthor(), song.getTitle());
        if (lyrics != null) {
            song.setLyrics(lyrics);
            return songRepository.save(song);
        }

        return song;
    }

    /**
     * Enriquece el DTO con datos de todas las APIs disponibles.
     * No lanza excepción si algo falta — simplemente deja el campo null.
     */
    private void completeMetadata(ExternalSongDTO dto) {
        if (dto == null) return;

        // Limpiar texto
        dto.setAuthor(TextCleaner.clean(dto.getAuthor()));
        dto.setTitle(TextCleaner.clean(dto.getTitle()));

        // Last.fm: corregir nombre y obtener duración/género
        if (!isBlank(dto.getAuthor()) && !isBlank(dto.getTitle())) {
            LastFmMetadataService.TrackMetadata lastFm =
                    lastFmMetadataService.enrichTrack(dto.getAuthor(), dto.getTitle());
            if (lastFm != null) {
                if (!isBlank(lastFm.title()))    dto.setTitle(lastFm.title());
                if (!isBlank(lastFm.artist()))   dto.setAuthor(lastFm.artist());
                if (isBlank(dto.getDuration()))  dto.setDuration(lastFm.duration());
                if (isBlank(dto.getGenre()))     dto.setGenre(lastFm.genre());
            }
        }

        // iTunes: duración y portada
        ItunesMetadataService.TrackData itunes =
                itunesMetadataService.searchTrack(dto.getTitle(), dto.getAuthor());
        if (itunes != null) {
            if (isBlank(dto.getDuration()))   dto.setDuration(itunes.duration);
            if (isBlank(dto.getArtworkUrl())) dto.setArtworkUrl(itunes.artworkUrl);
            if (isBlank(dto.getAuthor()))     dto.setAuthor(itunes.artistName);
            if (isBlank(dto.getTitle()))      dto.setTitle(itunes.trackName);
        }

        // AcousticBrainz: BPM y tonalidad (solo si viene de MusicBrainz)
        if (!isBlank(dto.getExternalId()) && (dto.getBpm() == null || isBlank(dto.getKeyTone()))) {
            AcousticBrainzService.AudioData audio =
                    acousticBrainzService.getAudioData(dto.getExternalId());
            if (audio != null) {
                if (dto.getBpm() == null)       dto.setBpm(audio.bpm);
                if (isBlank(dto.getKeyTone()))  dto.setKeyTone(audio.keyTone);
            }
        }

        // Letra: buscar en Lyrics.ovh → LrcLib → Happi.dev
        if (isBlank(dto.getLyrics()) && !isBlank(dto.getAuthor()) && !isBlank(dto.getTitle())) {
            dto.setLyrics(lyricsService.getLyrics(dto.getAuthor(), dto.getTitle()));
        }

        // Songsterr: enlace a acordes/tabs
        SongsterrChordService.ChordData chords =
                songsterrChordService.searchChordSource(dto.getTitle(), dto.getAuthor());
        if (chords != null) {
            dto.setChordsAvailable(chords.chordsAvailable);
            if (isBlank(dto.getChordSourceUrl())) dto.setChordSourceUrl(chords.externalUrl);
        }

        // Marcar campos faltantes para que el frontend los muestre
        dto.setMissingFields(getMissingFields(dto));
        dto.setImportReady(dto.getMissingFields().isEmpty());
    }

    private List<String> getMissingFields(ExternalSongDTO dto) {
        return Arrays.asList(
                        isBlank(dto.getTitle())    ? "título"    : null,
                        isBlank(dto.getAuthor())   ? "autor"     : null,
                        isBlank(dto.getDuration()) ? "duración"  : null,
                        dto.getBpm() == null       ? "BPM"       : null,
                        isBlank(dto.getKeyTone())  ? "tonalidad" : null,
                        isBlank(dto.getLyrics()) && !dto.isChordsAvailable() ? "letra/acordes" : null
                ).stream()
                .filter(Objects::nonNull)
                .toList();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String buildNotes(ExternalSongDTO dto) {
        List<String> parts = new ArrayList<>();
        if (!isBlank(dto.getNotes()))          parts.add(dto.getNotes().trim());
        if (!isBlank(dto.getChordSourceUrl())) parts.add("Acordes: " + dto.getChordSourceUrl());
        return parts.isEmpty() ? null : String.join(" | ", parts);
    }
}
