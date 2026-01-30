package com.smart_appointment.appointment.application.port.in;

import com.smart_appointment.appointment.domain.model.Appointment;

import java.util.List;
import java.util.UUID;

public interface GetDoctorAppointmentsUseCase {
    List<Appointment> findByDoctorId(UUID doctorId);
}
