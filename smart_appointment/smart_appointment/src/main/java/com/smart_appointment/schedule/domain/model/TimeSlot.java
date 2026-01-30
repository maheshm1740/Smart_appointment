package com.smart_appointment.schedule.domain.model;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record TimeSlot(LocalTime start, LocalTime end) {

    public boolean contains(LocalTime time) {

        return !time.isBefore(start) && time.isBefore(end);
    }
}
