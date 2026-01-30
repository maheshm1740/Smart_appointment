package com.smart_appointment.appointment.application.port.in;

import java.util.UUID;

public interface CancelAppointmentUseCase {

    void cancel(UUID appointmentId);
}
