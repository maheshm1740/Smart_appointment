package com.smart_appointment.appointment.application.service;

import com.smart_appointment.appointment.application.port.in.CreateAppointmentUseCase;
import com.smart_appointment.appointment.domain.enums.Priority;
import com.smart_appointment.appointment.domain.model.Appointment;
import com.smart_appointment.appointment.domain.repository.AppointmentRepository;
import com.smart_appointment.appointment.domain.service.SlotAllocator;
import com.smart_appointment.queue.domain.model.Queue;
import com.smart_appointment.queue.domain.repository.QueueRepository;
import com.smart_appointment.schedule.domain.model.WeeklyDoctorSchedule;
import com.smart_appointment.schedule.domain.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CreateAppointmentService implements CreateAppointmentUseCase {

    private final AppointmentRepository appointmentRepository;
    private final SlotAllocator slotAllocator;
    private final QueueRepository queueRepository;
    private final ScheduleRepository scheduleRepository;

    public CreateAppointmentService(AppointmentRepository appointmentRepository,
                                    QueueRepository queueRepository, ScheduleRepository scheduleRepository) {
        this.appointmentRepository = appointmentRepository;
        this.queueRepository = queueRepository;
        this.scheduleRepository = scheduleRepository;
        this.slotAllocator = new SlotAllocator();
    }

    @Override
    @Transactional
    public UUID crateAppointment(
            UUID doctorId,
            UUID patientId,
            LocalDateTime slotTime,
            String priority
    ) {
        Priority appointmentPriority = Priority.valueOf(priority);

        // ✅ 1. Fetch WEEKLY schedule
        WeeklyDoctorSchedule schedule = scheduleRepository
                .findWeeklyByDoctorId(doctorId)
                .orElseThrow(() -> new IllegalStateException("Weekly schedule not found"));

        // ✅ 2. Validate availability (NON-DESTRUCTIVE)
        if (!schedule.isAvailable(slotTime)) {
            throw new IllegalStateException("Doctor not available at this time");
        }

        // ✅ 3. Create appointment
        Appointment appointment = slotAllocator.create(
                doctorId,
                patientId,
                slotTime,
                appointmentPriority
        );

        appointment.confirm();
        appointment.moveToQueue();
        appointmentRepository.save(appointment);

        // ✅ 4. Add to queue (unchanged)
        Queue queue = queueRepository.findByDoctorId(doctorId)
                .orElse(new Queue(doctorId));

        com.smart_appointment.queue.domain.enums.Priority queuePriority =
                com.smart_appointment.queue.domain.enums.Priority.valueOf(priority);

        queue.add(appointment.getId(), queuePriority);
        queueRepository.save(queue);

        return appointment.getId();
    }
}
