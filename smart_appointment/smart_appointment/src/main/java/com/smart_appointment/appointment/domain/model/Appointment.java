package com.smart_appointment.appointment.domain.model;

import com.smart_appointment.appointment.domain.enums.AppointmentStatus;
import com.smart_appointment.appointment.domain.enums.Priority;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class Appointment {
    private final UUID id;
    private final UUID doctorId;
    private final UUID patientId;
    private final LocalDateTime slotTime;
    private AppointmentStatus status;
    private final Priority priority;

    public Appointment(
            UUID id,
            UUID doctorId,
            UUID patientId,
            LocalDateTime slotTime,
            Priority priority
    ) {
        if (slotTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Appointment time cannot be in the past");
        }

        this.id = id;
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.slotTime = slotTime;
        this.priority = priority;
        this.status = AppointmentStatus.REQUESTED;
    }

    // ---- Business behavior ----

    public void confirm() {
        if (status != AppointmentStatus.REQUESTED) {
            throw new IllegalStateException("Only requested appointments can be confirmed");
        }
        this.status = AppointmentStatus.CONFIRMED;
    }

    public void cancel() {
        if (status == AppointmentStatus.COMPLETED) {
            throw new IllegalStateException("Completed appointment cannot be cancelled");
        }
        this.status = AppointmentStatus.CANCELLED;
    }

    public void moveToQueue() {
        if (status != AppointmentStatus.CONFIRMED) {
            throw new IllegalStateException("Only confirmed appointments can enter queue");
        }
        this.status = AppointmentStatus.IN_QUEUE;
    }

    public void complete() {
        if (status != AppointmentStatus.IN_QUEUE) {
            throw new IllegalStateException("Only queued appointments can be completed");
        }
        this.status = AppointmentStatus.COMPLETED;
    }

}
