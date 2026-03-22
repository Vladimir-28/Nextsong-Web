package utez.edu.mx.nextsong.models;

import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name="events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "events_seq_gen")
    @SequenceGenerator(name = "events_seq_gen", sequenceName = "EVENTS_SEQ", allocationSize = 1)
    private Long id;

    private String name;
    private String category;
    private String status;
    private String description;
    private String location;
    private String eventDate;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    // ✅ NUEVO: Lista de músicos invitados al evento
    @ManyToMany
    @JoinTable(
            name = "event_collaborators",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> collaborators = new HashSet<>();

    @Transient
    private Integer songsCount;

    public Event(){}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public Integer getSongsCount() { return songsCount; }
    public void setSongsCount(Integer songsCount) { this.songsCount = songsCount; }
    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }
    public Set<User> getCollaborators() { return collaborators; }
    public void setCollaborators(Set<User> collaborators) { this.collaborators = collaborators; }
}