package com.smart_appointment.queue.infrastructure.adapter.out;

import com.smart_appointment.queue.domain.model.Queue;
import com.smart_appointment.queue.domain.repository.QueueRepository;
import com.smart_appointment.queue.infrastructure.adapter.out.mapper.QueueMapper;
import com.smart_appointment.queue.infrastructure.adapter.out.repository.QueueDataRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class QueueRepositoryAdapter implements QueueRepository {

    private final QueueDataRepository queueDataRepository;

    public QueueRepositoryAdapter(QueueDataRepository queueDataRepository) {
        this.queueDataRepository = queueDataRepository;
    }


    @Override
    public Optional<Queue> findByDoctorId(UUID doctorId) {
        var entries = queueDataRepository.findByDoctorIdOrderByPosition(doctorId);
        return entries.isEmpty() ? Optional.empty()
                :Optional.of (QueueMapper.toDomain(doctorId, entries));
    }

    @Override
    public Queue save(Queue queue) {

        queueDataRepository.deleteAll(queueDataRepository.findByDoctorIdOrderByPosition(queue.getDoctorId()));
        queueDataRepository.saveAll(QueueMapper.toQueue(queue));
        return queue;
    }
}
