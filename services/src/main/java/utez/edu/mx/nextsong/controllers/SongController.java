package utez.edu.mx.nextsong.controllers;

import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.services.SongService;
import utez.edu.mx.nextsong.models.Song;

import java.util.List;

@RestController
@RequestMapping("/songs")
@CrossOrigin(origins = "*") // ✅ Permitir acceso desde Android
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

    @PutMapping("/{id}")
    public Song updateSong(@PathVariable Long id, @RequestBody Song song) {
        song.setId(id);
        return songService.save(song);
    }

    @DeleteMapping("/{id}/user/{userId}")
    public String deleteSong(@PathVariable Long id, @PathVariable Long userId){

        boolean deleted = songService.deleteById(id, userId);

        if(deleted){
            return "Canción eliminada correctamente";
        } else {
            return "Canción no encontrada";
        }
    }
}