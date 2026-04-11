package edu.cit.laurente.laundryhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.cit.laurente.laundryhub.entity.LaundryService;

public interface LaundryServiceRepository extends JpaRepository<LaundryService, Long> {
}