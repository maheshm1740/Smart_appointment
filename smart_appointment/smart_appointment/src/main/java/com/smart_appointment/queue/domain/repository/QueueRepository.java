package com.smart_appointment.queue.domain.repository;

import com.smart_appointment.queue.domain.model.Queue;

import java.util.Optional;
import java.util.UUID;

public interface QueueRepository {

    Optional<Queue> findByDoctorId(UUID doctorId);

    Queue save(Queue queue);
}
