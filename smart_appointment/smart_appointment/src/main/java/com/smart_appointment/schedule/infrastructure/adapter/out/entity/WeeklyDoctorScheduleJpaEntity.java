package com.smart_appointment.schedule.infrastructure.adapter.out.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "weekly_doctor_schedule")
@Getter
public class WeeklyDoctorScheduleJpaEntity  {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID doctorId;

    @OneToMany(
            mappedBy = "schedule",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<WeeklyTimeSlotJpaEntity> slots = new ArrayList<>();

    protected WeeklyDoctorScheduleJpaEntity() {}

    public WeeklyDoctorScheduleJpaEntity(UUID doctorId) {
        this.doctorId = doctorId;
    }

    public void addSlot(WeeklyTimeSlotJpaEntity slot) {
        slots.add(slot);
    }
}
