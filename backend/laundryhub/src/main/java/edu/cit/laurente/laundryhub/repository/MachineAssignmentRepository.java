package edu.cit.laurente.laundryhub.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import edu.cit.laurente.laundryhub.entity.MachineAssignment;
import edu.cit.laurente.laundryhub.entity.Order;

public interface MachineAssignmentRepository extends JpaRepository<MachineAssignment, Long> {
    List<MachineAssignment> findByOrder(Order order);
}