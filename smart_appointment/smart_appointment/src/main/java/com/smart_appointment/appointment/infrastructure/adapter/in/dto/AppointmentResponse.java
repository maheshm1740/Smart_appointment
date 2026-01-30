package com.smart_appointment.appointment.infrastructure.adapter.in.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentResponse(
        UUID appointmentId,
        UUID doctorId,
        UUID patientId,
        LocalDateTime slotTime,
        String status,
        String priority
) {}
