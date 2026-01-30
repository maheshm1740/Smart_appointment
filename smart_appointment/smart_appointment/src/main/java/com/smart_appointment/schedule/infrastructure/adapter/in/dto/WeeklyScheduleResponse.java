package com.smart_appointment.schedule.infrastructure.adapter.in.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record WeeklyScheduleResponse(
        UUID doctorId,
        Map<DayOfWeek, List<TimeSlotResponse>> days
) {
    public record TimeSlotResponse(
            LocalTime start,
            LocalTime end
    ) {}
}
