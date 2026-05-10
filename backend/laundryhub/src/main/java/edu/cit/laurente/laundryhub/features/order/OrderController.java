package edu.cit.laurente.laundryhub.features.order;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.laurente.laundryhub.features.machine.MachineAssignmentRequest;
import edu.cit.laurente.laundryhub.features.machine.StatusRequest;
import edu.cit.laurente.laundryhub.features.machine.WeightRequest;
import edu.cit.laurente.laundryhub.shared.dto.ApiResponse;
import edu.cit.laurente.laundryhub.shared.entity.Order;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderFacade orderFacade;

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<Order>> createBooking(@Valid @RequestBody OrderRequest request) {
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Order order = orderFacade.createBooking(request, userEmail);
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ORDER-001", e.getMessage(), null));
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders() {
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Order> orders = orderFacade.getUserOrders(userEmail);
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ORDER-002", e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        try {
            List<Order> orders = orderFacade.getAllOrders();
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ORDER-006", e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable Long id) {
        try {
            Order order = orderFacade.getOrder(id);
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("DB-001", "Order not found", null));
        }
    }

    @PutMapping("/{id}/weigh")
    public ResponseEntity<ApiResponse<Order>> weighOrder(@PathVariable Long id, @Valid @RequestBody WeightRequest request) {
        try {
            Order order = orderFacade.weighOrder(id, request.getActualWeight());
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("VALID-001", e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<Order>> confirmPayment(@PathVariable Long id) {
        try {
            Order order = orderFacade.confirmPayment(id);
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ORDER-003", e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        try {
            Order order = orderFacade.updateStatus(id, request.getStatus());
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ORDER-004", e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/machines")
    public ResponseEntity<ApiResponse<Order>> assignMachine(@PathVariable Long id, @Valid @RequestBody MachineAssignmentRequest request) {
        try {
            Order order = orderFacade.assignMachine(id, request);
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ORDER-005", e.getMessage(), null));
        }
    }
}