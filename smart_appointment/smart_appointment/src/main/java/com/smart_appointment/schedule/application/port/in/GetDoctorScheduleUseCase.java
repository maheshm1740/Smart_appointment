package com.smart_appointment.schedule.application.port.in;

import com.smart_appointment.schedule.domain.model.WeeklyDoctorSchedule;

import java.util.UUID;

public interface GetDoctorScheduleUseCase {

    WeeklyDoctorSchedule getWeeklySchedule(UUID doctorId);
}
