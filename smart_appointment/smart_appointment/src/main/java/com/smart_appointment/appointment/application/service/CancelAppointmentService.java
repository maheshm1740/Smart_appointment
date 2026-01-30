package com.smart_appointment.appointment.application.service;

import com.smart_appointment.appointment.application.port.in.CancelAppointmentUseCase;
import com.smart_appointment.appointment.domain.model.Appointment;
import com.smart_appointment.appointment.domain.repository.AppointmentRepository;
import com.smart_appointment.queue.domain.repository.QueueRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CancelAppointmentService implements CancelAppointmentUseCase {

    private final AppointmentRepository appointmentRepository;
    private final QueueRepository queueRepository;

    public CancelAppointmentService(AppointmentRepository appointmentRepository,
                                    QueueRepository queueRepository) {
        this.appointmentRepository = appointmentRepository;
        this.queueRepository = queueRepository;
    }

    @Override
    @Transactional
    public void cancel(UUID appointmentId) {

        // 1️⃣ Fetch appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalStateException("Appointment not found"));

        // 2️⃣ Cancel appointment
        appointment.cancel();
        appointmentRepository.save(appointment);

        // 3️⃣ Remove from queue
        queueRepository.findByDoctorId(appointment.getDoctorId())
                .ifPresent(queue -> {
                    queue.remove(appointmentId);
                    queueRepository.save(queue);
                });
    }
}
