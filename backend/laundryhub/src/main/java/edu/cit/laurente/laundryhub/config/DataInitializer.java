package edu.cit.laurente.laundryhub.config;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import edu.cit.laurente.laundryhub.entity.LaundryService;
import edu.cit.laurente.laundryhub.entity.Machine;
import edu.cit.laurente.laundryhub.repository.LaundryServiceRepository;
import edu.cit.laurente.laundryhub.repository.MachineRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private LaundryServiceRepository serviceRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize laundry services if none exist
        if (serviceRepository.count() == 0) {
            LaundryService service1 = LaundryService.builder()
                    .name("Wash & Dry")
                    .pricePerKg(BigDecimal.valueOf(50))
                    .description("Complete wash and dry service")
                    .build();

            LaundryService service2 = LaundryService.builder()
                    .name("Dry Cleaning")
                    .pricePerKg(BigDecimal.valueOf(80))
                    .description("Professional dry cleaning")
                    .build();

            LaundryService service3 = LaundryService.builder()
                    .name("Iron Only")
                    .pricePerKg(BigDecimal.valueOf(30))
                    .description("Ironing service only")
                    .build();

            serviceRepository.save(service1);
            serviceRepository.save(service2);
            serviceRepository.save(service3);

            System.out.println("✓ Initialized laundry services");
        }

        // Initialize machines if none exist
        if (machineRepository.count() == 0) {
            Machine washer1 = Machine.builder()
                    .type("WASHER")
                    .capacity(10.0)
                    .status("AVAILABLE")
                    .build();

            Machine washer2 = Machine.builder()
                    .type("WASHER")
                    .capacity(15.0)
                    .status("AVAILABLE")
                    .build();

            Machine dryer1 = Machine.builder()
                    .type("DRYER")
                    .capacity(10.0)
                    .status("AVAILABLE")
                    .build();

            Machine dryer2 = Machine.builder()
                    .type("DRYER")
                    .capacity(15.0)
                    .status("AVAILABLE")
                    .build();

            machineRepository.save(washer1);
            machineRepository.save(washer2);
            machineRepository.save(dryer1);
            machineRepository.save(dryer2);

            System.out.println("✓ Initialized machines");
        }
    }
}