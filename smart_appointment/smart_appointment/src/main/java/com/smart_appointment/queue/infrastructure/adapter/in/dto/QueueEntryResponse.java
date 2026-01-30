package com.smart_appointment.queue.infrastructure.adapter.in.dto;

import java.util.UUID;

public record QueueEntryResponse(UUID appointmentId,
                                 String priority,
                                 int position) {
}
