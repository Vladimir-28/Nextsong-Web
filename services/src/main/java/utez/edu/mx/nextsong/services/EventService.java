package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.nextsong.models.Event;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.repositories.EventRepository;
import utez.edu.mx.nextsong.repositories.EventSongRepository;
import utez.edu.mx.nextsong.repositories.UserRepository;

import java.util.ArrayList;
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

        List<Event> events = new ArrayList<>();

        if (user.getRole() != null && user.getRole().getId() == 1L) {
            events = eventRepository.findAll();
        } else {
            // 1. Eventos propios
            events.addAll(eventRepository.findByCreatorId(userId));

            // 2. Eventos donde es colaborador
            List<Event> collaborated = eventRepository.findByCollaboratorsId(userId);

            // 3. Combinar sin duplicados
            for (Event colEvent : collaborated) {
                if (events.stream().noneMatch(e -> e.getId().equals(colEvent.getId()))) {
                    events.add(colEvent);
                }
            }
        }

        for (Event event : events) {
            int count = eventSongRepository.countByEventId(event.getId());
            event.setSongsCount(count);
        }
        return events;
    }

    @Transactional
    public Event save(Event event, Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));
        event.setCreator(creator);
        return eventRepository.save(event);
    }

    @Transactional
    public void delete(Long id) {
        eventSongRepository.deleteByEvent_Id(id);
        eventRepository.deleteById(id);
    }

    public Event findById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    @Transactional
    public Event update(Event updatedEvent) {
        Event event = eventRepository.findById(updatedEvent.getId())
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        event.setName(updatedEvent.getName());
        event.setEventDate(updatedEvent.getEventDate());
        event.setCategory(updatedEvent.getCategory());
        event.setLocation(updatedEvent.getLocation());
        event.setDescription(updatedEvent.getDescription());
        event.setStatus(updatedEvent.getStatus());

        eventSongRepository.deleteByEvent_Id(event.getId());
        return eventRepository.save(event);
    }

    @Transactional
    public void addCollaborator(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        event.getCollaborators().add(user);
        eventRepository.save(event);
    }

    @Transactional
    public void removeCollaborator(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        event.getCollaborators().removeIf(u -> u.getId().equals(userId));
        eventRepository.save(event);
    }

    public List<Event> findCollaboratedEvents(Long userId) {
        List<Event> events = eventRepository.findByCollaboratorsId(userId);
        for (Event event : events) {
            int count = eventSongRepository.countByEventId(event.getId());
            event.setSongsCount(count);
        }
        return events;
    }
}