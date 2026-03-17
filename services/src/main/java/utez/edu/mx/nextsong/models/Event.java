package utez.edu.mx.nextsong.models;

import jakarta.persistence.*;

@Entity
@Table(name="events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String category;

    private String status;

    private String description;

    private String location;

    private String eventDate;

    // 🔥 NO afecta BD
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
}