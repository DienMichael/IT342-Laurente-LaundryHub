package edu.cit.laurente.laundryhub.features.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.laurente.laundryhub.shared.entity.Order;
import edu.cit.laurente.laundryhub.shared.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}