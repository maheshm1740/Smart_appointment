package com.smart_appointment.appointment.domain.vo;

import java.time.LocalDateTime;

public record SlotTime(LocalDateTime value) {

    public SlotTime {
        if (value.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Slot time cannot be past");
        }
    }
}
