package utez.edu.mx.nextsong.models;

import jakarta.persistence.*;

@Entity
@Table(name="event_users")
public class EventUser {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_user_seq")
    @SequenceGenerator(name = "event_user_seq", sequenceName = "event_user_seq", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name="event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;
}