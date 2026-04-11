package edu.cit.laurente.laundryhub.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import edu.cit.laurente.laundryhub.entity.Machine;

public interface MachineRepository extends JpaRepository<Machine, Long> {
    List<Machine> findByTypeAndStatus(String type, String status);
}