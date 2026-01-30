package com.smart_appointment.queue.application.service;

import com.smart_appointment.queue.application.port.in.GetDoctorQueueUseCase;
import com.smart_appointment.queue.domain.model.Queue;
import com.smart_appointment.queue.domain.repository.QueueRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GetDoctorQueueService implements GetDoctorQueueUseCase {

    private final QueueRepository queueRepository;

    public GetDoctorQueueService(QueueRepository queueRepository) {
        this.queueRepository = queueRepository;
    }

    @Override
    public Queue getQueue(UUID doctorId) {
        return queueRepository.findByDoctorId(doctorId)
                .orElse(new Queue(doctorId));
    }
}
