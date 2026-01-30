package com.smart_appointment.appointment.application.service;

import com.smart_appointment.appointment.application.port.in.CompleteAppointmentUseCase;
import com.smart_appointment.appointment.domain.repository.AppointmentRepository;
import com.smart_appointment.queue.domain.repository.QueueRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CompleteAppointmentService implements CompleteAppointmentUseCase {

    private final AppointmentRepository appointmentRepository;
    private final QueueRepository  queueRepository;

    public CompleteAppointmentService(AppointmentRepository appointmentRepository,
                                      QueueRepository queueRepository) {
        this.appointmentRepository = appointmentRepository;
        this.queueRepository = queueRepository;
    }


    @Override
    public void complete(UUID appointmentId) {
        var appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(()->new RuntimeException("appointment not found"));

        appointment.complete();
        appointmentRepository.save(appointment);

        queueRepository.findByDoctorId(appointment.getDoctorId())
                .ifPresent(queue -> {
                    queue.remove(appointmentId);
                    queueRepository.save(queue);
                });
    }

}
