package edu.cit.laurente.laundryhub.features.order;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.cit.laurente.laundryhub.features.auth.UserRepository;
import edu.cit.laurente.laundryhub.shared.entity.Order;
import edu.cit.laurente.laundryhub.shared.entity.User;
import edu.cit.laurente.laundryhub.shared.security.JwtService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    void weighOrder_ShouldCalculateCorrectPrice() throws Exception {
        // Arrange - create an authenticated user + ensure order exists in DB.
        User user = userRepository.findByEmail("john@example.com")
                .orElseThrow(() -> new RuntimeException("Expected seeded user not found"));

        // Use existing seeded order id=3 (AWAITING_PAYMENT) OR create a fresh one if missing.
        Order order;
        if (orderRepository.existsById(1L)) {
            order = orderRepository.findById(1L).orElseThrow();
        } else {
            order = Order.builder()
                    .user(user)
                    .status(Order.OrderStatus.BOOKED)
                    .pricingStatus(Order.PricingStatus.PENDING_WEIGHING)
                    .notes("test")
                    .createdAt(LocalDateTime.now())
                    .build();
            order = orderRepository.save(order);
        }

        String weightJson = "{\"actualWeight\": 2.0}";

        String token = jwtService.generateToken(user);

        mockMvc.perform(put("/api/orders/" + order.getId() + "/weigh")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(weightJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.finalAmount").value(100.0))
                .andExpect(jsonPath("$.data.status").value("AWAITING_PAYMENT"));
    }
}

