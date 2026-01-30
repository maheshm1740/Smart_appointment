package com.smart_appointment.appointment.application.service;

import com.smart_appointment.appointment.application.port.in.GetAppointmentUseCase;
import com.smart_appointment.appointment.domain.model.Appointment;
import com.smart_appointment.appointment.domain.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GetAppointmentService implements GetAppointmentUseCase {

    private final AppointmentRepository appointmentRepository;


    public GetAppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public Appointment getAppointment(UUID appointmentId) {

        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalStateException("appointment not found"));
    }
}
