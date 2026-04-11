package edu.cit.laurente.laundryhub.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
@Table(name = "laundry_services")
public class LaundryService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private BigDecimal pricePerKg;
    private String description;

    public LaundryService() {}

    private LaundryService(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.pricePerKg = builder.pricePerKg;
        this.description = builder.description;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private BigDecimal pricePerKg;
        private String description;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder pricePerKg(BigDecimal pricePerKg) { this.pricePerKg = pricePerKg; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public LaundryService build() { return new LaundryService(this); }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(BigDecimal pricePerKg) { this.pricePerKg = pricePerKg; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}