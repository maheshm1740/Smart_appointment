package com.smart_appointment.schedule.application.service;

import com.smart_appointment.schedule.application.port.in.ManageWeeklyScheduleUseCase;
import com.smart_appointment.schedule.domain.model.TimeSlot;
import com.smart_appointment.schedule.domain.model.WeeklyDoctorSchedule;
import com.smart_appointment.schedule.domain.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class ManageWeeklyScheduleService implements ManageWeeklyScheduleUseCase {

    private final ScheduleRepository scheduleRepository;

    public ManageWeeklyScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    // ✅ CREATE
    @Override
    public void create(UUID doctorId,
                       Map<DayOfWeek, List<SlotCommand>> days) {

        scheduleRepository.findWeeklyByDoctorId(doctorId)
                .ifPresent(s -> {
                    throw new IllegalStateException("Weekly schedule already exists");
                });

        WeeklyDoctorSchedule schedule = new WeeklyDoctorSchedule(doctorId);
        addSlots(schedule, days);

        scheduleRepository.save(schedule);
    }

    // ✅ UPDATE
    @Override
    public void update(UUID doctorId,
                       Map<DayOfWeek, List<SlotCommand>> days) {

        WeeklyDoctorSchedule schedule = scheduleRepository
                .findWeeklyByDoctorId(doctorId)
                .orElseThrow(() -> new IllegalStateException("Weekly schedule not found"));

        schedule.clearSlots(); // important
        addSlots(schedule, days);

        scheduleRepository.save(schedule);
    }

    // 🔒 Shared slot logic
    private void addSlots(WeeklyDoctorSchedule schedule,
                          Map<DayOfWeek, List<SlotCommand>> days) {

        days.forEach((day, slots) -> {

            validateSlots(slots);

            slots.forEach(slot ->
                    schedule.addSlot(
                            day,
                            new TimeSlot(slot.start(), slot.end())
                    )
            );
        });
    }

    // 🧠 Validation logic (VERY IMPORTANT)
    private void validateSlots(List<SlotCommand> slots) {

        // start < end
        slots.forEach(slot -> {
            if (!slot.start().isBefore(slot.end())) {
                throw new IllegalArgumentException("Slot start must be before end");
            }
        });

        // no overlap
        for (int i = 0; i < slots.size(); i++) {
            for (int j = i + 1; j < slots.size(); j++) {
                if (overlaps(slots.get(i), slots.get(j))) {
                    throw new IllegalArgumentException("Overlapping time slots");
                }
            }
        }
    }

    private boolean overlaps(SlotCommand a, SlotCommand b) {
        return a.start().isBefore(b.end()) && b.start().isBefore(a.end());
    }
}
