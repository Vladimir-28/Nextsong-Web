package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.models.Event;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.repositories.EventRepository;
import utez.edu.mx.nextsong.repositories.EventSongRepository;
import utez.edu.mx.nextsong.repositories.UserRepository;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventSongRepository eventSongRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository,
                        EventSongRepository eventSongRepository,
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.eventSongRepository = eventSongRepository;
        this.userRepository = userRepository;
    }

    public List<Event> findByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Event> events;

        //  LÓGICA DE ROLES: Si el ID de rol es 1 (ADMIN), devolvemos todo
        if (user.getRole() != null && user.getRole().getId() == 1L) {
            events = eventRepository.findAll();
        } else {
            // Si es un usuario normal, devolvemos solo lo que él creó
            events = eventRepository.findByCreatorId(userId);
        }

        // Agregar conteo de canciones a cada evento
        for (Event event : events) {
            int count = eventSongRepository.countByEventId(event.getId());
            event.setSongsCount(count);
        }

        return events;
    }

    public Event save(Event event, Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));
        event.setCreator(creator);
        return eventRepository.save(event);
    }

    public void delete(Long id) {
        eventSongRepository.deleteByEvent_Id(id);
        eventRepository.deleteById(id);
    }

    public Event findById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }
}