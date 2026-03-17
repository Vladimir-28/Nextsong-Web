package utez.edu.mx.nextsong.controllers;

import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.models.Event;
import utez.edu.mx.nextsong.services.EventService;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins ="http://localhost:5173")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService){
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getEvents(){
        return eventService.findAll();
    }


    @PostMapping
    public Event createEvent(@RequestBody Event event){
        return eventService.save(event);
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