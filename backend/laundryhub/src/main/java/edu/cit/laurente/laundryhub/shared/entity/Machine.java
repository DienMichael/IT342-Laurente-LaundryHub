package edu.cit.laurente.laundryhub.shared.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "machines")
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type; // WASHER, DRYER
    private Double capacity;
    private String status; // AVAILABLE, IN_USE, MAINTENANCE

    public Machine() {}

    private Machine(Builder builder) {
        this.id = builder.id;
        this.type = builder.type;
        this.capacity = builder.capacity;
        this.status = builder.status;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String type;
        private Double capacity;
        private String status;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder capacity(Double capacity) { this.capacity = capacity; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Machine build() { return new Machine(this); }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Double getCapacity() { return capacity; }
    public void setCapacity(Double capacity) { this.capacity = capacity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}