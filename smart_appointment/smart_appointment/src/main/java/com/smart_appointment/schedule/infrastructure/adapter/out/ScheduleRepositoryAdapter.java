package com.smart_appointment.schedule.infrastructure.adapter.out;

import com.smart_appointment.schedule.domain.model.WeeklyDoctorSchedule;
import com.smart_appointment.schedule.domain.repository.ScheduleRepository;
import com.smart_appointment.schedule.infrastructure.adapter.out.entity.WeeklyDoctorScheduleJpaEntity;
import com.smart_appointment.schedule.infrastructure.adapter.out.entity.WeeklyTimeSlotJpaEntity;
import com.smart_appointment.schedule.infrastructure.adapter.out.mapper.WeeklyScheduleMapper;
import com.smart_appointment.schedule.infrastructure.adapter.out.repository.WeeklyDoctorScheduleJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class ScheduleRepositoryAdapter implements ScheduleRepository {

    private final WeeklyDoctorScheduleJpaRepository jpaRepository;

    public ScheduleRepositoryAdapter(WeeklyDoctorScheduleJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<WeeklyDoctorSchedule> findWeeklyByDoctorId(UUID doctorId) {
        return jpaRepository.findByDoctorId(doctorId)
                .map(WeeklyScheduleMapper::toDomain);
    }

    @Override
    public WeeklyDoctorSchedule save(WeeklyDoctorSchedule schedule) {

        WeeklyDoctorScheduleJpaEntity entity =
                jpaRepository.findByDoctorId(schedule.getDoctorId())
                        .orElseGet(() -> new WeeklyDoctorScheduleJpaEntity(schedule.getDoctorId()));

        entity.getSlots().clear();

        schedule.getWeeklySlots().forEach((day, slots) ->
                slots.forEach(slot ->
                        entity.addSlot(
                                new WeeklyTimeSlotJpaEntity(
                                        entity,
                                        day,
                                        slot.start(),
                                        slot.end()
                                )
                        )
                )
        );

        return WeeklyScheduleMapper.toDomain(
                jpaRepository.save(entity)
        );
    }


    @Override
    public void deleteByDoctorId(UUID doctorId) {
        jpaRepository.findByDoctorId(doctorId)
                .ifPresent(jpaRepository::delete);
    }

}
