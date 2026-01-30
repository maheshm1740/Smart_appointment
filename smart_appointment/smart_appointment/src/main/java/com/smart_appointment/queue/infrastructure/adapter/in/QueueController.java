package com.smart_appointment.queue.infrastructure.adapter.in;

import com.smart_appointment.queue.application.port.in.GetDoctorQueueUseCase;
import com.smart_appointment.queue.infrastructure.adapter.in.dto.QueueEntryResponse;
import com.smart_appointment.queue.infrastructure.adapter.in.dto.QueueResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/queues")
public class QueueController {

    private final GetDoctorQueueUseCase getDoctorQueueUseCase;

    public QueueController(GetDoctorQueueUseCase getDoctorQueueUseCase) {
        this.getDoctorQueueUseCase = getDoctorQueueUseCase;
    }

    @GetMapping("/doctor/{doctorId}")
    public QueueResponse getDoctorQueue(@PathVariable UUID doctorId) {

        var queue =  getDoctorQueueUseCase.getQueue(doctorId);

        var entries = queue.getEntries().stream()
                .map(e -> new QueueEntryResponse(
                        e.getAppointmentId(),
                        e.getPriority().name(),
                        e.getPosition()
                )).toList();
        return new QueueResponse(queue.getDoctorId(), entries);
    }
}
