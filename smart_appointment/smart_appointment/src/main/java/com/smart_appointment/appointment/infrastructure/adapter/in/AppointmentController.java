package com.smart_appointment.appointment.infrastructure.adapter.in;


import com.smart_appointment.appointment.application.port.in.*;
import com.smart_appointment.appointment.infrastructure.adapter.in.dto.AppointmentResponse;
import com.smart_appointment.appointment.infrastructure.adapter.in.dto.CreateAppointmentRequest;
import com.smart_appointment.appointment.infrastructure.adapter.in.dto.CreateAppointmentResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final CreateAppointmentUseCase createAppointmentUseCase;
    private final CancelAppointmentUseCase cancelAppointmentUseCase;
    private final CompleteAppointmentUseCase completeAppointmentUseCase;
    private final GetAppointmentUseCase getAppointmentUseCase;
    private final GetDoctorAppointmentsUseCase getDoctorAppointmentsUseCase;

    public AppointmentController(CreateAppointmentUseCase createAppointmentUseCase,
                                 CancelAppointmentUseCase cancelAppointmentUseCase,
                                 CompleteAppointmentUseCase completeAppointmentUseCase,
                                 GetAppointmentUseCase getAppointmentUseCase,
                                 GetDoctorAppointmentsUseCase getDoctorAppointmentsUseCase) {
        this.createAppointmentUseCase = createAppointmentUseCase;
        this.cancelAppointmentUseCase = cancelAppointmentUseCase;
        this.completeAppointmentUseCase = completeAppointmentUseCase;
        this.getAppointmentUseCase = getAppointmentUseCase;
        this.getDoctorAppointmentsUseCase = getDoctorAppointmentsUseCase;
    }

    @PostMapping
    public ResponseEntity<CreateAppointmentResponse> createAppointment(
            @RequestBody CreateAppointmentRequest request) {
        var appointmentId = createAppointmentUseCase.crateAppointment(
                request.doctorId(), request.patientId(), request.slotTime(), request.priority()
        );

        return ResponseEntity.ok(
                new CreateAppointmentResponse(appointmentId)
        );
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponse> getAppointment(@PathVariable UUID appointmentId) {

        var appointment = getAppointmentUseCase.getAppointment(appointmentId);

        return ResponseEntity.ok(new AppointmentResponse(
                appointment.getId(),
                appointment.getDoctorId(),
                appointment.getPatientId(),
                appointment.getSlotTime(),
                appointment.getStatus().name(),
                appointment.getPriority().name()
        ));
    }

    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentResponse> getDoctorAppointments(
            @PathVariable UUID doctorId) {

        return getDoctorAppointmentsUseCase.findByDoctorId(doctorId)
                .stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getDoctorId(),
                        a.getPatientId(),
                        a.getSlotTime(),
                        a.getStatus().name(),
                        a.getPriority().name()
                ))
                .toList();
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable UUID appointmentId) {
        cancelAppointmentUseCase.cancel(appointmentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{appointmentId}/complete")
    public ResponseEntity<Void> completeAppointment(@PathVariable UUID appointmentId) {

        completeAppointmentUseCase.complete(appointmentId);
        return ResponseEntity.noContent().build();
    }
}
