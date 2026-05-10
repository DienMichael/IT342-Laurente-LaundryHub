package edu.cit.laurente.laundryhub.features.machine;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.laurente.laundryhub.shared.entity.MachineAssignment;
import edu.cit.laurente.laundryhub.shared.entity.Order;

public interface MachineAssignmentRepository extends JpaRepository<MachineAssignment, Long> {
    List<MachineAssignment> findByOrder(Order order);
}