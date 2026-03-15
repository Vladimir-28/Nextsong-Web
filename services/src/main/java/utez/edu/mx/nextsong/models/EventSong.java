package utez.edu.mx.nextsong.models;

import jakarta.persistence.*;

@Entity
@Table(name="event_songs")
public class EventSong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name="song_id")
    private Song song;

    private Integer songOrder;

}