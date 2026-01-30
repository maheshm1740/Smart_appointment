package com.smart_appointment.schedule.infrastructure.adapter.out.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Getter
@Table(name = "weekly_time_slot")
public class WeeklyTimeSlotJpaEntity  {

    @Id
    @GeneratedValue
    private UUID id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek day;
    private LocalTime startTime;
    private LocalTime endTime;

    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private WeeklyDoctorScheduleJpaEntity schedule;

    protected WeeklyTimeSlotJpaEntity() {}

    public WeeklyTimeSlotJpaEntity(
            WeeklyDoctorScheduleJpaEntity schedule,
            DayOfWeek day,
            LocalTime startTime,
            LocalTime endTime
    ) {
        this.schedule = schedule;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
