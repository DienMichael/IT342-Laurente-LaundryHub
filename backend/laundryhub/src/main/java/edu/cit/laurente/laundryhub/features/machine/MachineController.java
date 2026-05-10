package edu.cit.laurente.laundryhub.features.machine;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.laurente.laundryhub.shared.entity.Machine;

@RestController
@RequestMapping("/api/machines")
public class MachineController {

    @Autowired
    private MachineRepository machineRepository;

    @GetMapping("/available")
    public ResponseEntity<List<Machine>> getAvailableMachinesByType(
            @RequestParam("type") String type) {

        // Your domain uses: Machine.type = WASHER/DRYER and Machine.status = AVAILABLE
        String normalizedType = type == null ? "" : type.trim().toUpperCase();

        List<Machine> machines = machineRepository
                .findByTypeAndStatus(normalizedType, "AVAILABLE");

        return ResponseEntity.ok(machines);
    }
}

