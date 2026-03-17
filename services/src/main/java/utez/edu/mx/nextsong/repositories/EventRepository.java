package utez.edu.mx.nextsong.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import utez.edu.mx.nextsong.models.Event;

public interface EventRepository  extends JpaRepository<Event,Long>{
}
