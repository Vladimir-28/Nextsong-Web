package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.repositories.SongRepository;
import utez.edu.mx.nextsong.models.Song;

import java.util.List;

@Service
public class SongService {
    private final SongRepository songRepository;

    public SongService(SongRepository songRepository){
        this.songRepository = songRepository;
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
}
