package edu.cit.laurente.laundryhub.features.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.laurente.laundryhub.features.auth.UserRepository;
import edu.cit.laurente.laundryhub.features.machine.MachineAssignmentRepository;
import edu.cit.laurente.laundryhub.features.machine.MachineAssignmentRequest;
import edu.cit.laurente.laundryhub.features.machine.MachineRepository;
import edu.cit.laurente.laundryhub.shared.entity.Machine;
import edu.cit.laurente.laundryhub.shared.entity.MachineAssignment;
import edu.cit.laurente.laundryhub.shared.entity.Order;
import edu.cit.laurente.laundryhub.shared.entity.User;

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
        
        String newStatus = status.toUpperCase();
        order.setStatus(Order.OrderStatus.valueOf(newStatus));
        
        // When order is completed or ready for pickup, release the assigned machine back to AVAILABLE
        if ("READY_FOR_PICKUP".equals(newStatus) || "COMPLETED".equals(newStatus)) {
            List<MachineAssignment> assignments = assignmentRepository.findByOrder(order);
            
            for (MachineAssignment assignment : assignments) {
                // Only release machines that don't have an end time (still in use)
                if (assignment.getEndTime() == null) {
                    Machine machine = assignment.getMachine();
                    machine.setStatus("AVAILABLE");
                    machineRepository.save(machine);
                    
                    // Mark the assignment as complete
                    assignment.setEndTime(LocalDateTime.now());
                    assignmentRepository.save(assignment);
                }
            }
        }
        
        return orderRepository.save(order);
    }

    public Order assignMachine(Long orderId, MachineAssignmentRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Machine machine = machineRepository.findById(request.getMachineId())
                .orElseThrow(() -> new RuntimeException("Machine not found"));

        // Release previous machine if transitioning to a different process type
        List<MachineAssignment> existingAssignments = assignmentRepository.findByOrder(order);
        for (MachineAssignment existing : existingAssignments) {
            if (existing.getEndTime() == null && 
                !existing.getProcessType().equals(request.getProcessType())) {
                // Different process type, so release the old machine
                Machine oldMachine = existing.getMachine();
                oldMachine.setStatus("AVAILABLE");
                machineRepository.save(oldMachine);
                
                // Mark the assignment as complete
                existing.setEndTime(LocalDateTime.now());
                assignmentRepository.save(existing);
            }
        }

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
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Populate transient assigned machine id so frontend can display it.
        // (Order entity currently doesn't have this field; if your frontend relies on it,
        // we set it via a transient property if supported by serialization.)
        try {
            var assignments = assignmentRepository.findByOrder(order);
            var active = assignments.stream()
                    .filter(a -> a.getEndTime() == null)
                    .findFirst()
                    .orElse(null);

            if (active != null) {
                // MachineAssignment -> Machine -> id
                order.setAssignedMachineId(active.getMachine().getId());
            }
        } catch (Exception ignored) {
            // Ignore (assignedMachineId will stay null)
        }

        return order;
    }

    public List<Order> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        // Populate assignedMachineId for UI
        for (Order order : orders) {
            try {
                List<MachineAssignment> assignments = assignmentRepository.findByOrder(order);
                MachineAssignment active = assignments.stream()
                        .filter(a -> a.getEndTime() == null)
                        .findFirst()
                        .orElse(null);
                if (active != null) {
                    order.setAssignedMachineId(active.getMachine().getId());
                }
            } catch (Exception ignored) {}
        }
        return orders;
    }

}