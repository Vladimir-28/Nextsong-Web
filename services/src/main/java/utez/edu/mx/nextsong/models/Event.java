package utez.edu.mx.nextsong.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate eventDate;

    private String location;

    private String description;

    private String status;
}
