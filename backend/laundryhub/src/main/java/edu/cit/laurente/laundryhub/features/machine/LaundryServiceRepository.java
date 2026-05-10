package edu.cit.laurente.laundryhub.features.machine;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.laurente.laundryhub.shared.entity.LaundryService;

public interface LaundryServiceRepository extends JpaRepository<LaundryService, Long> {
}