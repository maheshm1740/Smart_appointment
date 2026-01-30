package com.smart_appointment.schedule.domain.repository;

import com.smart_appointment.schedule.domain.model.WeeklyDoctorSchedule;

import java.util.Optional;
import java.util.UUID;

public interface ScheduleRepository {

    Optional<WeeklyDoctorSchedule> findWeeklyByDoctorId(UUID doctorId);

    WeeklyDoctorSchedule save(WeeklyDoctorSchedule schedule);

    void deleteByDoctorId(UUID doctorId);
}

