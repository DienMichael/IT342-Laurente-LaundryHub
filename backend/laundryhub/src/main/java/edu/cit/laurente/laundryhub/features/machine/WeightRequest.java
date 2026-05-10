package edu.cit.laurente.laundryhub.features.machine;

import jakarta.validation.constraints.Positive;

public class WeightRequest {
    @Positive(message = "Weight must be greater than 0")
    private Double actualWeight;

    public Double getActualWeight() { return actualWeight; }
    public void setActualWeight(Double actualWeight) { this.actualWeight = actualWeight; }
}