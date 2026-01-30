package com.smart_appointment.schedule.application.service;

import com.smart_appointment.schedule.application.port.in.DeleteWeeklyScheduleUseCase;
import com.smart_appointment.schedule.domain.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Transactional
public class DeleteWeeklyScheduleService implements DeleteWeeklyScheduleUseCase {

    private final ScheduleRepository scheduleRepository;

    public DeleteWeeklyScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public void delete(UUID doctorId) {
        scheduleRepository.findWeeklyByDoctorId(doctorId)
                .orElseThrow(() -> new IllegalStateException("Schedule not found"));

        scheduleRepository.deleteByDoctorId(doctorId);
    }
}

