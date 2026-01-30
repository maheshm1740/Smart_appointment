package com.smart_appointment.queue.infrastructure.adapter.out.entity;

import com.smart_appointment.queue.domain.enums.Priority;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "queue_entry")
public class QueueJpaEntity {
    @Id
    @GeneratedValue
    private UUID id;

    private UUID doctorId;
    private UUID appointmentId;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private int position;

    protected QueueJpaEntity() {}

    public QueueJpaEntity(UUID doctorId, UUID appointmentId, Priority priority, int position) {
        this.doctorId = doctorId;
        this.appointmentId = appointmentId;
        this.priority = priority;
        this.position = position;
    }
}
