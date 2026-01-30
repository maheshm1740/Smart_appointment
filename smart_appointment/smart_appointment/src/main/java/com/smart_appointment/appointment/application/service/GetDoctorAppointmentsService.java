package com.smart_appointment.appointment.application.service;

import com.smart_appointment.appointment.application.port.in.GetDoctorAppointmentsUseCase;
import com.smart_appointment.appointment.domain.model.Appointment;
import com.smart_appointment.appointment.domain.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GetDoctorAppointmentsService implements GetDoctorAppointmentsUseCase {

    private final AppointmentRepository appointmentRepository;

    public GetDoctorAppointmentsService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public List<Appointment> findByDoctorId(UUID doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
}
