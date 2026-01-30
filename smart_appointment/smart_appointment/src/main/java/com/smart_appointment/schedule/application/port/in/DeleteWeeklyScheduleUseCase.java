package com.smart_appointment.schedule.application.port.in;

import java.util.UUID;

public interface DeleteWeeklyScheduleUseCase {
    void delete(UUID doctorId);
}
