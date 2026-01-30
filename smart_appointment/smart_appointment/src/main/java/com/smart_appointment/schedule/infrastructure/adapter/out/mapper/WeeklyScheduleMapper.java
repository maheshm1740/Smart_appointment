package com.smart_appointment.schedule.infrastructure.adapter.out.mapper;

import com.smart_appointment.schedule.domain.model.TimeSlot;
import com.smart_appointment.schedule.domain.model.WeeklyDoctorSchedule;
import com.smart_appointment.schedule.infrastructure.adapter.out.entity.WeeklyDoctorScheduleJpaEntity;
import com.smart_appointment.schedule.infrastructure.adapter.out.entity.WeeklyTimeSlotJpaEntity;

public class WeeklyScheduleMapper  {

    public static WeeklyDoctorSchedule toDomain(WeeklyDoctorScheduleJpaEntity entity) {
        WeeklyDoctorSchedule schedule =
                new WeeklyDoctorSchedule(entity.getDoctorId());

        entity.getSlots().forEach(slot ->
                schedule.addSlot(
                        slot.getDay(),
                        new TimeSlot(slot.getStartTime(), slot.getEndTime())
                )
        );

        return schedule;
    }

    public static WeeklyDoctorScheduleJpaEntity toJpa(WeeklyDoctorSchedule domain) {
        WeeklyDoctorScheduleJpaEntity entity =
                new WeeklyDoctorScheduleJpaEntity(domain.getDoctorId());

        domain.getWeeklySlots().forEach((day, slots) ->
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

        return entity;
    }
}
