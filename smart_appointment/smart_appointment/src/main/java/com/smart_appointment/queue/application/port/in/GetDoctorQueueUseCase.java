package com.smart_appointment.queue.application.port.in;

import com.smart_appointment.queue.domain.model.Queue;

import java.util.UUID;

public interface GetDoctorQueueUseCase {

    Queue getQueue(UUID doctorId);
}
