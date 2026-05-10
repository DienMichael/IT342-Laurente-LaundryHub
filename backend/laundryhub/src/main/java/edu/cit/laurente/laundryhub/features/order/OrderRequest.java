package edu.cit.laurente.laundryhub.features.order;

public class OrderRequest {
    private Long serviceId;
    private Double estimatedWeight;
    private String notes;

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public Double getEstimatedWeight() { return estimatedWeight; }
    public void setEstimatedWeight(Double estimatedWeight) { this.estimatedWeight = estimatedWeight; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}