package com.smart_appointment.appointment.infrastructure.adapter.out.entity;

import com.smart_appointment.appointment.domain.enums.AppointmentStatus;
import com.smart_appointment.appointment.domain.enums.Priority;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity
@Table(
        name = "appointment",
        indexes = {
                @Index(name = "idx_appointment_doctor", columnList = "doctor_id"),
                @Index(name = "idx_appointment_patient", columnList = "patient_id"),
                @Index(name = "idx_appointment_slot_time", columnList = "slot_time")
        }
)
public class AppointmentJpaEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @NotNull
    @Column(name = "doctor_id", nullable = false)
    private UUID doctorId;

    @NotNull
    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @NotNull
    @Column(name = "slot_time", nullable = false)
    private LocalDateTime slotTime;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppointmentStatus status;

    /* ===== JPA Constructor ===== */
    protected AppointmentJpaEntity() {
    }

    /* ===== Aggregate Constructor ===== */
    public AppointmentJpaEntity(
            UUID id,
            UUID doctorId,
            UUID patientId,
            LocalDateTime slotTime,
            Priority priority,
            AppointmentStatus status
    ) {
        this.id = id;
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.slotTime = slotTime;
        this.priority = priority;
        this.status = status;
    }

    /* ===== Controlled Mutators (DDD-style) ===== */

    public void reschedule(LocalDateTime newSlotTime) {
        this.slotTime = newSlotTime;
    }

    public void changePriority(Priority priority) {
        this.priority = priority;
    }

    public void markCompleted() {
        this.status = AppointmentStatus.COMPLETED;
    }

    public void cancel() {
        this.status = AppointmentStatus.CANCELLED;
    }
}
