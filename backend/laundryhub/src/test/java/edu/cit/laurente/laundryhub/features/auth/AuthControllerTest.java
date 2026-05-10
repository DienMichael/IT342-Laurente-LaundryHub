package edu.cit.laurente.laundryhub.features.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import edu.cit.laurente.laundryhub.features.auth.RegisterRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerUser_ShouldDefaultToCustomer() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Juan");
        // Use a unique email to avoid hitting the "Email already registered" error
        request.setEmail("juan" + System.currentTimeMillis() + "@test.com");
        request.setPassword("123456");


        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                // AuthResponse has fields: success, accessToken, name, email, role
                // Ensure the response returns the default role.
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }
}
