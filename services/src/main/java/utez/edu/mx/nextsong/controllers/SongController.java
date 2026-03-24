package utez.edu.mx.nextsong.controllers;

import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.services.SongService;
import utez.edu.mx.nextsong.models.Song;

import java.util.List;

@RestController
@RequestMapping("/songs")
@CrossOrigin(origins ="http://localhost:5173" )
public class SongController {
    private final SongService songService;

    public SongController(SongService songService){
        this.songService = songService;
    }

    @GetMapping
    public List<Song> getSongs(){
        return songService.findAll();
    }

    @PostMapping
    public Song createSong(@RequestBody Song song){
        return songService.save(song);
    }

    @GetMapping("/{id}")
    public Song getSongById(@PathVariable Long id){
        return songService.findById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteSong(@PathVariable Long id){
        boolean deleted = songService.deleteById(id);

        if(deleted){
            return "Canción eliminada correctamente";
        } else {
            return "Canción no encontrada";
        }
    }
}
