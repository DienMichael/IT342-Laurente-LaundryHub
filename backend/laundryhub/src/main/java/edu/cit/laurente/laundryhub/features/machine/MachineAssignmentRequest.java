package edu.cit.laurente.laundryhub.features.machine;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MachineAssignmentRequest {
    @NotNull(message = "Machine ID is required")
    private Long machineId;

    @NotBlank(message = "Process type is required")
    private String processType;

    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }
    public String getProcessType() { return processType; }
    public void setProcessType(String processType) { this.processType = processType; }
}