package com.smart_appointment.schedule.application.service;

import com.smart_appointment.schedule.application.port.in.GetDoctorScheduleUseCase;
import com.smart_appointment.schedule.domain.model.WeeklyDoctorSchedule;
import com.smart_appointment.schedule.domain.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GetDoctorScheduleService implements GetDoctorScheduleUseCase {

    private final ScheduleRepository scheduleRepository;

    public GetDoctorScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public WeeklyDoctorSchedule getWeeklySchedule(UUID doctorId) {
        return scheduleRepository.findWeeklyByDoctorId(doctorId)
                .orElseThrow(() -> new IllegalStateException("Weekly schedule not found"));
    }
}
