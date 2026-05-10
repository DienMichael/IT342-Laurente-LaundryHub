package edu.cit.laurente.laundryhub.features.machine;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.laurente.laundryhub.shared.entity.Machine;

public interface MachineRepository extends JpaRepository<Machine, Long> {
    List<Machine> findByType(String type);
    List<Machine> findByTypeAndStatus(String type, String status);
}