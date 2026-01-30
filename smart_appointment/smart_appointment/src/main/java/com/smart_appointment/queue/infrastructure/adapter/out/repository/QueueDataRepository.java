package com.smart_appointment.queue.infrastructure.adapter.out.repository;

import com.smart_appointment.queue.infrastructure.adapter.out.entity.QueueJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QueueDataRepository extends JpaRepository<QueueJpaEntity, UUID> {

    List<QueueJpaEntity> findByDoctorIdOrderByPosition(UUID doctorId);

    void deleteByAppointmentId(UUID appointmentId);
}
