package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.models.EventSong;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.repositories.EventSongRepository;
import utez.edu.mx.nextsong.repositories.SongRepository;
import utez.edu.mx.nextsong.models.Song;
import utez.edu.mx.nextsong.repositories.UserRepository;

import java.util.List;

@Service
public class SongService {
    private final SongRepository songRepository;
    private final EventSongRepository eventSongRepository;
    private final UserRepository userRepository;

    public SongService(SongRepository songRepository, EventSongRepository eventSongRepository,  UserRepository userRepository) {
        this.songRepository = songRepository;
        this.eventSongRepository = eventSongRepository;
        this.userRepository = userRepository;
    }

    public List<Song> findAll(){
        return songRepository.findAll();
    }

    public Song save(Song song){
        return songRepository.save(song);
    }

    public Song findById(Long id){
        return songRepository.findById(id).orElse(null);
    }

    public boolean deleteById(Long id, Long userId){

        if(!songRepository.existsById(id)){
            throw new RuntimeException("Canción no encontrada");
        }

        // validar usuario
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if(user.getRole() == null || user.getRole().getId() != 1L){
            throw new RuntimeException("No tienes permisos para eliminar canciones");
        }

        // validar si está en eventos
        boolean isUsed = eventSongRepository.existsBySong_Id(id);

        if(isUsed){
            throw new RuntimeException("No puedes eliminar la canción porque está asignada a un evento");
        }

        songRepository.deleteById(id);
        return true;
    }
}