package com.smart_appointment.appointment.application.port.in;

import com.smart_appointment.appointment.domain.model.Appointment;

import java.util.UUID;

public interface GetAppointmentUseCase {

    Appointment getAppointment(UUID appointmentId);
}
