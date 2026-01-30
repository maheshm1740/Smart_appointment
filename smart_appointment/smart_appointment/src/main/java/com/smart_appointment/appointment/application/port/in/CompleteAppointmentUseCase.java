package com.smart_appointment.appointment.application.port.in;

import java.util.UUID;

public interface CompleteAppointmentUseCase {
    void complete(UUID appointmentId);
}
