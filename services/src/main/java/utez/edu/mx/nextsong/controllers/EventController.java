package utez.edu.mx.nextsong.controllers;

import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.models.Event;
import utez.edu.mx.nextsong.services.EventService;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*") // Permitimos acceso desde cualquier origen (móvil y web)
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService){
        this.eventService = eventService;
    }

    // Obtener eventos filtrados por el ID del usuario solicitante
    @GetMapping("/user/{userId}")
    public List<Event> getEvents(@PathVariable Long userId){
        return eventService.findByUserId(userId);
    }

    // Crear un evento asignándolo al creador
    @PostMapping("/creator/{userId}")
    public Event createEvent(@RequestBody Event event, @PathVariable Long userId){
        return eventService.save(event, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id){
        eventService.delete(id);
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id){
        return eventService.findById(id);
    }
}