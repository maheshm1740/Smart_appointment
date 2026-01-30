package com.smart_appointment.schedule.infrastructure.adapter.in;

import com.smart_appointment.schedule.application.port.in.DeleteWeeklyScheduleUseCase;
import com.smart_appointment.schedule.application.port.in.GetDoctorAvailabilityUseCase;
import com.smart_appointment.schedule.application.port.in.GetDoctorScheduleUseCase;
import com.smart_appointment.schedule.application.port.in.ManageWeeklyScheduleUseCase;
import com.smart_appointment.schedule.infrastructure.adapter.in.dto.WeeklyScheduleRequest;
import com.smart_appointment.schedule.infrastructure.adapter.in.dto.WeeklyScheduleResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    private final ManageWeeklyScheduleUseCase manage;
    private final GetDoctorScheduleUseCase getSchedule;
    private final GetDoctorAvailabilityUseCase availability;
    private final DeleteWeeklyScheduleUseCase deleteWeeklyScheduleUseCase;

    public ScheduleController(
            ManageWeeklyScheduleUseCase manage,
            GetDoctorScheduleUseCase getSchedule,
            GetDoctorAvailabilityUseCase availability,
            DeleteWeeklyScheduleUseCase deleteWeeklyScheduleUseCase) {
        this.manage = manage;
        this.getSchedule = getSchedule;
        this.availability = availability;
        this.deleteWeeklyScheduleUseCase = deleteWeeklyScheduleUseCase;
    }

    // POST /schedules/weekly
    @PostMapping("/weekly")
    public void create(@RequestBody WeeklyScheduleRequest req) {
        manage.create(req.doctorId(), map(req));
    }

    // PUT /schedules/weekly/{doctorId}
    @PutMapping("/weekly/{doctorId}")
    public void update(@PathVariable UUID doctorId,
                       @RequestBody WeeklyScheduleRequest req) {
        manage.update(doctorId, map(req));
    }

    // GET /schedules/weekly/{doctorId}
    @GetMapping("/weekly/{doctorId}")
    public WeeklyScheduleResponse get(@PathVariable UUID doctorId) {

        var schedule = getSchedule.getWeeklySchedule(doctorId);

        return new WeeklyScheduleResponse(
                schedule.getDoctorId(),
                schedule.getWeeklySlots().entrySet().stream()
                        .collect(Collectors.toMap(
                                e -> e.getKey(),
                                e -> e.getValue().stream()
                                        .map(s -> new WeeklyScheduleResponse.TimeSlotResponse(
                                                s.start(), s.end()))
                                        .toList()
                        ))
        );
    }

    // GET /schedules/{doctorId}/availability
    @GetMapping("/{doctorId}/availability")
    public GetDoctorAvailabilityUseCase.AvailabilityResponse availability(
            @PathVariable UUID doctorId,
            @RequestParam LocalDate date) {

        return availability.getAvailability(doctorId, date);
    }

    private Map<DayOfWeek, List<ManageWeeklyScheduleUseCase.SlotCommand>> map(
            WeeklyScheduleRequest req) {

        return req.days().entrySet().stream()
                .collect(Collectors.toMap(
                        e -> e.getKey(),
                        e -> e.getValue().stream()
                                .map(s -> new ManageWeeklyScheduleUseCase.SlotCommand(
                                        s.start(), s.end()))
                                .toList()
                ));
    }

    @DeleteMapping("/weekly/{doctorId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID doctorId) {
        deleteWeeklyScheduleUseCase.delete(doctorId);
    }

}
