package com.smart_appointment.schedule.infrastructure.adapter.out.repository;

import com.smart_appointment.schedule.infrastructure.adapter.out.entity.WeeklyDoctorScheduleJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WeeklyDoctorScheduleJpaRepository extends
        JpaRepository<WeeklyDoctorScheduleJpaEntity, UUID> {

    Optional<WeeklyDoctorScheduleJpaEntity> findByDoctorId(UUID doctorId);

    void deleteByDoctorId(UUID doctorId);
}
