package com.smart_appointment.queue.infrastructure.adapter.in.dto;

import java.util.List;
import java.util.UUID;

public record QueueResponse(UUID doctorId,
                            List<QueueEntryResponse> entries) {
}
