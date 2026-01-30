package com.smart_appointment.queue.infrastructure.adapter.out.mapper;

import com.smart_appointment.queue.domain.enums.Priority;
import com.smart_appointment.queue.domain.model.Queue;
import com.smart_appointment.queue.infrastructure.adapter.out.entity.QueueJpaEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class QueueMapper {

    public static List<QueueJpaEntity> toQueue(Queue queue) {

        return queue.getEntries().stream()
                .map(e -> new QueueJpaEntity(
                        queue.getDoctorId(),
                        e.getAppointmentId(),
                        e.getPriority(),
                        e.getPosition()
                )).toList();
    }

    public static Queue toDomain(UUID doctorId, List<QueueJpaEntity> entities) {

        Queue queue = new Queue(doctorId);
        for (QueueJpaEntity entity : entities) {
            queue.add(entity.getAppointmentId(), entity.getPriority());
        }

        return queue;
    }
}
