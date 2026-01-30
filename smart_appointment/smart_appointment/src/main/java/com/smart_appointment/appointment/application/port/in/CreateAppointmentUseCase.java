package com.smart_appointment.appointment.application.port.in;

import java.time.LocalDateTime;
import java.util.UUID;

public interface CreateAppointmentUseCase {

    UUID crateAppointment(
            UUID doctorId,
            UUID patientId,
            LocalDateTime slotTime,
            String priority
    );
}
