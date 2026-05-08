package edu.cit.laurente.laundryhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.laurente.laundryhub.entity.Order;
import edu.cit.laurente.laundryhub.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}