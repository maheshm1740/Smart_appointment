package com.smart_appointment.common.exception;

import java.time.LocalDateTime;

public record ApiErrorResponse(String error,
                               String message,
                               int status,
                               LocalDateTime timestamp) {
}
