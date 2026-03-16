package utez.edu.mx.nextsong.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_seq")
    @SequenceGenerator(name = "event_seq", sequenceName = "event_seq", allocationSize = 1)
    private Long id;

    private String name;

    private LocalDate eventDate;

    private String location;

    private String description;

    private String status;
}