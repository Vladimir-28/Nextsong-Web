package utez.edu.mx.nextsong.models;
import jakarta.persistence.*;

@Entity
@Table(name="event_users")
public class EventUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

}
