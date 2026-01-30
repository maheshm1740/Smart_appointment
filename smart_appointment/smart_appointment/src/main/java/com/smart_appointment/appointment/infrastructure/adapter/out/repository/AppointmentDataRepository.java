package com.smart_appointment.appointment.infrastructure.adapter.out.repository;

import com.smart_appointment.appointment.infrastructure.adapter.out.entity.AppointmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AppointmentDataRepository extends JpaRepository<AppointmentJpaEntity, UUID> {

    List<AppointmentJpaEntity> findByDoctorId(UUID doctorId);
}
