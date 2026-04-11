package edu.cit.laurente.laundryhub.facade;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.laurente.laundryhub.dto.MachineAssignmentRequest;
import edu.cit.laurente.laundryhub.dto.OrderRequest;
import edu.cit.laurente.laundryhub.entity.*;
import edu.cit.laurente.laundryhub.repository.*;

@Service
public class OrderFacade {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MachineRepository machineRepository;
    @Autowired
    private MachineAssignmentRepository assignmentRepository;

    public Order createBooking(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .user(user)
                .status(Order.OrderStatus.BOOKED)
                .pricingStatus(Order.PricingStatus.PENDING_WEIGHING)
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .build();

        return orderRepository.save(order);
    }

    public Order weighOrder(Long orderId, Double actualWeight) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        BigDecimal finalAmount = BigDecimal.valueOf(actualWeight).multiply(BigDecimal.valueOf(50));

        order.setActualWeight(actualWeight);
        order.setFinalAmount(finalAmount);
        order.setPricingStatus(Order.PricingStatus.FINALIZED);
        order.setStatus(Order.OrderStatus.AWAITING_PAYMENT);

        return orderRepository.save(order);
    }

    public Order confirmPayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(Order.OrderStatus.PAID);
        return orderRepository.save(order);
    }

    public Order updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(Order.OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }

    public Order assignMachine(Long orderId, MachineAssignmentRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Machine machine = machineRepository.findById(request.getMachineId())
                .orElseThrow(() -> new RuntimeException("Machine not found"));

        MachineAssignment assignment = MachineAssignment.builder()
                .order(order)
                .machine(machine)
                .processType(request.getProcessType())
                .startTime(LocalDateTime.now())
                .build();

        assignmentRepository.save(assignment);
        machine.setStatus("IN_USE");
        machineRepository.save(machine);

        if ("WASHING".equals(request.getProcessType())) {
            order.setStatus(Order.OrderStatus.WASHING);
        } else if ("DRYING".equals(request.getProcessType())) {
            order.setStatus(Order.OrderStatus.DRYING);
        }

        return orderRepository.save(order);
    }

    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
}