package com.smart_appointment.appointment.domain.service;

import com.smart_appointment.appointment.domain.enums.Priority;
import com.smart_appointment.appointment.domain.model.Appointment;

import java.time.LocalDateTime;
import java.util.UUID;

public class SlotAllocator {

    public Appointment create(
            UUID doctorId,
            UUID patientId,
            LocalDateTime slotTime,
            Priority priority
    ) {
        return new Appointment(
                UUID.randomUUID(),
                doctorId,
                patientId,
                slotTime,
                priority
        );
    }
}
