package utez.edu.mx.nextsong.controllers;

import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.models.Event;
import utez.edu.mx.nextsong.services.EventService;
import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService){
        this.eventService = eventService;
    }

    @GetMapping("/user/{userId}")
    public List<Event> getEvents(@PathVariable Long userId){
        return eventService.findByUserId(userId);
    }

    @PostMapping("/creator/{userId}")
    public Event createEvent(@RequestBody Event event, @PathVariable Long userId){
        return eventService.save(event, userId);
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event event) {
        event.setId(id);
        return eventService.update(event);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id){
        eventService.delete(id);
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id){
        return eventService.findById(id);
    }

    // ✅ Añadir un músico al evento
    @PostMapping("/{eventId}/collaborators/{userId}")
    public void addCollaborator(@PathVariable Long eventId, @PathVariable Long userId) {
        eventService.addCollaborator(eventId, userId);
    }

    // ✅ Eliminar un músico del evento (Solo el dueño puede llamar a esto desde la App)
    @DeleteMapping("/{eventId}/collaborators/{userId}")
    public void removeCollaborator(@PathVariable Long eventId, @PathVariable Long userId) {
        eventService.removeCollaborator(eventId, userId);
    }

    // ✅ Obtener eventos donde se es invitado
    @GetMapping("/collaborated/{userId}")
    public List<Event> getCollaboratedEvents(@PathVariable Long userId) {
        return eventService.findCollaboratedEvents(userId);
    }
}
