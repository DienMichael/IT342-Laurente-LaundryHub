package edu.cit.laurente.laundryhub.shared.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "machine_assignments")
public class MachineAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;

    private String processType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public MachineAssignment() {}

    private MachineAssignment(Builder builder) {
        this.id = builder.id;
        this.order = builder.order;
        this.machine = builder.machine;
        this.processType = builder.processType;
        this.startTime = builder.startTime;
        this.endTime = builder.endTime;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Order order;
        private Machine machine;
        private String processType;
        private LocalDateTime startTime;
        private LocalDateTime endTime;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder order(Order order) { this.order = order; return this; }
        public Builder machine(Machine machine) { this.machine = machine; return this; }
        public Builder processType(String processType) { this.processType = processType; return this; }
        public Builder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public Builder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public MachineAssignment build() { return new MachineAssignment(this); }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }
    public String getProcessType() { return processType; }
    public void setProcessType(String processType) { this.processType = processType; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}