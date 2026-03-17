package utez.edu.mx.nextsong.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import utez.edu.mx.nextsong.models.Song;

public interface SongRepository extends JpaRepository<Song,Long>{
}
