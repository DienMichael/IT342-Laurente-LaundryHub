package edu.cit.laurente.laundryhub.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private Double actualWeight;
    private BigDecimal finalAmount;

    @Enumerated(EnumType.STRING)
    private PricingStatus pricingStatus;

    // Computed for UI only (not stored in DB). Filled by backend using machine assignments.
    @Transient
    private Long assignedMachineId;

    private String notes;
    private LocalDateTime createdAt;

    public enum OrderStatus {
        BOOKED, AWAITING_WEIGHING, AWAITING_PAYMENT, PAID,
        WASHING, DRYING, READY_FOR_PICKUP, COMPLETED
    }

    public enum PricingStatus {
        PENDING_WEIGHING, FINALIZED
    }

    public Order() {}

    private Order(Builder builder) {
        this.id = builder.id;
        this.user = builder.user;
        this.status = builder.status;
        this.actualWeight = builder.actualWeight;
        this.finalAmount = builder.finalAmount;
        this.pricingStatus = builder.pricingStatus;
        this.notes = builder.notes;
        this.createdAt = builder.createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private OrderStatus status;
        private Double actualWeight;
        private BigDecimal finalAmount;
        private PricingStatus pricingStatus;
        private String notes;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder status(OrderStatus status) { this.status = status; return this; }
        public Builder actualWeight(Double actualWeight) { this.actualWeight = actualWeight; return this; }
        public Builder finalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; return this; }
        public Builder pricingStatus(PricingStatus pricingStatus) { this.pricingStatus = pricingStatus; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Order build() { return new Order(this); }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAssignedMachineId() { return assignedMachineId; }
    public void setAssignedMachineId(Long assignedMachineId) { this.assignedMachineId = assignedMachineId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public Double getActualWeight() { return actualWeight; }
    public void setActualWeight(Double actualWeight) { this.actualWeight = actualWeight; }
    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }
    public PricingStatus getPricingStatus() { return pricingStatus; }
    public void setPricingStatus(PricingStatus pricingStatus) { this.pricingStatus = pricingStatus; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}