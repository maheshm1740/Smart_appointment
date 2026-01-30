package com.smart_appointment.appointment.infrastructure.adapter.in.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CreateAppointmentRequest(UUID doctorId, UUID patientId,
                                       LocalDateTime slotTime, String priority) {
}
