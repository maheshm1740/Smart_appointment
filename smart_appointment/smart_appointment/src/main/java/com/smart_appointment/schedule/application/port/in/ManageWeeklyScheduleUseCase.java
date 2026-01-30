package com.smart_appointment.schedule.application.port.in;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ManageWeeklyScheduleUseCase  {
    void create(UUID doctorId, Map<DayOfWeek, List<SlotCommand>> days);

    void update(UUID doctorId, Map<DayOfWeek, List<SlotCommand>> days);

    record SlotCommand(LocalTime start, LocalTime end) {}
}
