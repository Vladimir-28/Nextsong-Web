package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.dto.ExternalSongDTO;
import utez.edu.mx.nextsong.models.Song;
import utez.edu.mx.nextsong.repositories.SongRepository;
import utez.edu.mx.nextsong.utils.TextCleaner;

import java.util.*;
import java.util.stream.Collectors;

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
        this.musicBrainzService = musicBrainzService;
        this.openOpusService = openOpusService;
        this.lyricsService = lyricsService;
        this.acousticBrainzService = acousticBrainzService;
        this.itunesMetadataService = itunesMetadataService;
        this.lastFmMetadataService = lastFmMetadataService;
        this.songsterrChordService = songsterrChordService;
        this.songRepository = songRepository;
    }

    public List<ExternalSongDTO> searchAll(String query) {
        List<ExternalSongDTO> rawResults = new ArrayList<>();
        rawResults.addAll(musicBrainzService.searchSongs(query, 10));
        rawResults.addAll(openOpusService.searchWorks(query));

        // 1. De-duplicación para no procesar dos veces la misma canción
        Map<String, ExternalSongDTO> uniqueMap = new LinkedHashMap<>();
        for (ExternalSongDTO dto : rawResults) {
            String key = (TextCleaner.clean(dto.getTitle()) + "|" + TextCleaner.clean(dto.getAuthor())).toLowerCase();
            uniqueMap.putIfAbsent(key, dto);
        }

        List<ExternalSongDTO> combined = new ArrayList<>(uniqueMap.values());

        // 2. PARALELISMO: Completa la metadata de todas las canciones a la vez
        combined.parallelStream().forEach(this::completeMetadata);

        return combined;
    }

    public List<ExternalSongDTO> searchByComposer(String composerName) {
        List<ExternalSongDTO> results = openOpusService.searchByComposer(composerName);
        results.parallelStream().forEach(this::completeMetadata);
        return results;
    }

    public List<String> getPopularComposers() {
        return openOpusService.getPopularComposers();
    }

    public Song importExternalSong(ExternalSongDTO dto) {
        completeMetadata(dto);
        Song song = new Song();

        String cleanArtist = TextCleaner.clean(dto.getAuthor());
        String cleanTitle = TextCleaner.clean(dto.getTitle());

        song.setTitle(cleanTitle);
        song.setAuthor(cleanArtist);
        song.setDuration(dto.getDuration());
        song.setNotes(buildNotes(dto));
        song.setStatus("active");
        song.setBpm(dto.getBpm());
        song.setKeyTone(dto.getKeyTone());
        song.setLyrics(!isBlank(dto.getLyrics()) ? dto.getLyrics() : null);

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

    private void completeMetadata(ExternalSongDTO dto) {
        if (dto == null) return;
        try {
            dto.setAuthor(TextCleaner.clean(dto.getAuthor()));
            dto.setTitle(TextCleaner.clean(dto.getTitle()));

            // Last.fm
            if (!isBlank(dto.getAuthor()) && !isBlank(dto.getTitle())) {
                LastFmMetadataService.TrackMetadata lastFm = lastFmMetadataService.enrichTrack(dto.getAuthor(), dto.getTitle());
                if (lastFm != null) {
                    if (!isBlank(lastFm.title())) dto.setTitle(lastFm.title());
                    if (!isBlank(lastFm.artist())) dto.setAuthor(lastFm.artist());
                    if (isBlank(dto.getDuration())) dto.setDuration(lastFm.duration());
                    if (isBlank(dto.getGenre())) dto.setGenre(lastFm.genre());
                }
            }

            // iTunes
            ItunesMetadataService.TrackData itunes = itunesMetadataService.searchTrack(dto.getTitle(), dto.getAuthor());
            if (itunes != null) {
                if (isBlank(dto.getDuration())) dto.setDuration(itunes.duration);
                if (isBlank(dto.getArtworkUrl())) dto.setArtworkUrl(itunes.artworkUrl);
            }

            // AcousticBrainz
            if (!isBlank(dto.getExternalId()) && (dto.getBpm() == null || isBlank(dto.getKeyTone()))) {
                AcousticBrainzService.AudioData audio = acousticBrainzService.getAudioData(dto.getExternalId());
                if (audio != null) {
                    if (dto.getBpm() == null) dto.setBpm(audio.bpm);
                    if (isBlank(dto.getKeyTone())) dto.setKeyTone(audio.keyTone);
                }
            }

            // Letra
            if (isBlank(dto.getLyrics()) && !isBlank(dto.getAuthor()) && !isBlank(dto.getTitle())) {
                dto.setLyrics(lyricsService.getLyrics(dto.getAuthor(), dto.getTitle()));
            }

            // Songsterr
            SongsterrChordService.ChordData chords = songsterrChordService.searchChordSource(dto.getTitle(), dto.getAuthor());
            if (chords != null) {
                dto.setChordsAvailable(chords.chordsAvailable);
                if (isBlank(dto.getChordSourceUrl())) dto.setChordSourceUrl(chords.externalUrl);
            }
        } catch (Exception e) {
            System.err.println("Error procesando metadata de " + dto.getTitle() + ": " + e.getMessage());
        }

        dto.setMissingFields(getMissingFields(dto));
        dto.setImportReady(dto.getMissingFields().isEmpty());
    }

    private List<String> getMissingFields(ExternalSongDTO dto) {
        return Arrays.asList(
                        isBlank(dto.getTitle()) ? "título" : null,
                        isBlank(dto.getAuthor()) ? "autor" : null,
                        isBlank(dto.getDuration()) ? "duración" : null,
                        dto.getBpm() == null ? "BPM" : null,
                        isBlank(dto.getKeyTone()) ? "tonalidad" : null,
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
        if (!isBlank(dto.getNotes())) parts.add(dto.getNotes().trim());
        if (!isBlank(dto.getChordSourceUrl())) parts.add("Acordes: " + dto.getChordSourceUrl());
        return parts.isEmpty() ? null : String.join(" | ", parts);
    }
}