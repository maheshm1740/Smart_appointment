package com.smart_appointment.appointment.domain.repository;

import com.smart_appointment.appointment.domain.model.Appointment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AppointmentRepository {

    Appointment save(Appointment appointment);

    Optional<Appointment> findById(UUID appointmentId);

    List<Appointment> findByDoctorId(UUID doctorId);

}
