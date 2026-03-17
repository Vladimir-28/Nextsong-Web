package utez.edu.mx.nextsong.controllers;

import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.dto.EventSongDTO;
import utez.edu.mx.nextsong.models.EventSong;
import utez.edu.mx.nextsong.services.EventSongService;

import java.util.List;

@RestController
@RequestMapping("/event-songs")
@CrossOrigin(origins ="http://localhost:5173")
public class EventSongController {

    private final EventSongService service;

    public EventSongController(EventSongService service){
        this.service = service;
    }

    @GetMapping("/event/{eventId}")
    public List<EventSong> getSongsByEvent(@PathVariable Long eventId){
        return service.getSongsByEvent(eventId);
    }

    @PostMapping("/event/{eventId}")
    public void saveEventSongs(@PathVariable Long eventId,
                               @RequestBody List<EventSongDTO> songs){

        service.saveEventSongs(eventId, songs);
    }
}