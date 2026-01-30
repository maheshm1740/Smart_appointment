package com.smart_appointment.schedule.domain.model;

import lombok.Getter;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

public class WeeklyDoctorSchedule {

    @Getter
    private final UUID doctorId;

    private final Map<DayOfWeek, List<TimeSlot>> weeklySlots =
            new EnumMap<>(DayOfWeek.class);

    public WeeklyDoctorSchedule(UUID doctorId) {
        this.doctorId = doctorId;
    }

    public void addSlot(DayOfWeek day, TimeSlot slot) {
        weeklySlots
                .computeIfAbsent(day, d -> new ArrayList<>())
                .add(slot);
    }

    public boolean isAvailable(LocalDateTime dateTime) {
        DayOfWeek day = dateTime.getDayOfWeek();
        LocalTime time = dateTime.toLocalTime();

        return weeklySlots.getOrDefault(day, List.of())
                .stream()
                .anyMatch(slot -> slot.contains(time));
    }
    public void clearSlots() {
        weeklySlots.clear();
    }

    public Map<DayOfWeek, List<TimeSlot>> getWeeklySlots() {
        return Collections.unmodifiableMap(weeklySlots);
    }
}
