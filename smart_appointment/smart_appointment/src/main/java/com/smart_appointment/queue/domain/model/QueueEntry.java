package com.smart_appointment.queue.domain.model;

import com.smart_appointment.queue.domain.enums.Priority;
import lombok.Getter;

import java.util.UUID;

@Getter
public class QueueEntry {

    private final UUID appointmentId;
    private final Priority priority;
    private int position;

    public QueueEntry(UUID appointmentId, Priority priority, int position) {
        this.appointmentId = appointmentId;
        this.priority = priority;
        this.position = position;
    }

    void setPosition(int position) {
        this.position = position;
    }
}
