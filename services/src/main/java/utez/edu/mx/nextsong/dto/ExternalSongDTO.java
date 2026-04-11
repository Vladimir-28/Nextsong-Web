package utez.edu.mx.nextsong.dto;

/**
 * DTO que representa un resultado de búsqueda desde APIs externas.
 * NO toca tu BD — es solo para mostrar opciones al usuario antes de guardar.
 */
public class ExternalSongDTO {

    private String externalId;       // ID en MusicBrainz o OpenOpus
    private String source;           // "musicbrainz" | "openopus"
    private String title;
    private String author;           // compositor / artista
    private String duration;         // formato "mm:ss" si viene disponible
    private String keyTone;          // si viene disponible
    private Integer bpm;             // si viene disponible
    private String genre;
    private String lyrics;           // jalado de Lyrics.ovh
    private String notes;            // info adicional de la API

    public ExternalSongDTO() {}

    public ExternalSongDTO(String externalId, String source, String title, String author) {
        this.externalId = externalId;
        this.source = source;
        this.title = title;
        this.author = author;
    }

    // Getters y Setters
    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getKeyTone() { return keyTone; }
    public void setKeyTone(String keyTone) { this.keyTone = keyTone; }

    public Integer getBpm() { return bpm; }
    public void setBpm(Integer bpm) { this.bpm = bpm; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getLyrics() { return lyrics; }
    public void setLyrics(String lyrics) { this.lyrics = lyrics; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
