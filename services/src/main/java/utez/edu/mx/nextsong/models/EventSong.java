package utez.edu.mx.nextsong.models;

import jakarta.persistence.*;

@Entity
@Table(name="event_songs")
public class EventSong {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_song_seq")
    @SequenceGenerator(name = "event_song_seq", sequenceName = "event_song_seq", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name="event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name="song_id")
    private Song song;

    private Integer songOrder;
}