package com.smart_appointment.schedule.application.port.in;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface GetDoctorAvailabilityUseCase {

    AvailabilityResponse getAvailability(UUID doctorId, LocalDate date);

    record AvailabilityResponse(
            UUID doctorId,
            LocalDate date,
            List<Slot> slots
    ) {}

    record Slot(LocalTime start, LocalTime end) {}
}
