package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.models.Event;
import utez.edu.mx.nextsong.repositories.EventRepository;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository){
        this.eventRepository = eventRepository;
    }

    public List<Event> findAll(){
        return eventRepository.findAll();
    }

    public Event save(Event event){
        return eventRepository.save(event);
    }

    public Event findById(Long id){
        return eventRepository.findById(id).orElse(null);
    }

    public void delete(Long id){
        eventRepository.deleteById(id);
    }
}
