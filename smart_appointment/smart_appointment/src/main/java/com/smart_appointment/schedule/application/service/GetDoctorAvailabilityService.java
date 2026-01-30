package com.smart_appointment.schedule.application.service;

import com.smart_appointment.schedule.application.port.in.GetDoctorAvailabilityUseCase;
import com.smart_appointment.schedule.domain.model.WeeklyDoctorSchedule;
import com.smart_appointment.schedule.domain.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class GetDoctorAvailabilityService implements GetDoctorAvailabilityUseCase {

    private final ScheduleRepository scheduleRepository;

    public GetDoctorAvailabilityService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public AvailabilityResponse getAvailability(UUID doctorId, LocalDate date) {

        WeeklyDoctorSchedule schedule = scheduleRepository
                .findWeeklyByDoctorId(doctorId)
                .orElseThrow(() -> new IllegalStateException("Schedule not found"));

        var slots = schedule.getWeeklySlots()
                .getOrDefault(date.getDayOfWeek(), List.of())
                .stream()
                .map(s -> new Slot(s.start(), s.end()))
                .toList();

        return new AvailabilityResponse(doctorId, date, slots);
    }
}
