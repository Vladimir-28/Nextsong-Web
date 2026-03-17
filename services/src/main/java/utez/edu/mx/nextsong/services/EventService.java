package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.models.Event;
import utez.edu.mx.nextsong.repositories.EventRepository;
import utez.edu.mx.nextsong.repositories.EventSongRepository;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventSongRepository eventSongRepository;

    public EventService(EventRepository eventRepository,
                        EventSongRepository eventSongRepository) {
        this.eventRepository = eventRepository;
        this.eventSongRepository = eventSongRepository;
    }

    public List<Event> findAll() {

        List<Event> events = eventRepository.findAll();

        // 🔥 agregar conteo sin tocar BD
        for (Event event : events) {
            int count = eventSongRepository.countByEventId(event.getId());
            event.setSongsCount(count);
        }

        return events;
    }

    public Event save(Event event){
        return eventRepository.save(event);
    }

    public void delete(Long id){
        eventRepository.deleteById(id);
    }

    public Event findById(Long id){
        return eventRepository.findById(id).orElse(null);
    }
}