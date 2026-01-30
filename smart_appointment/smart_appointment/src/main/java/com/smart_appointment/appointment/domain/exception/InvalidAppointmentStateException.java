package com.smart_appointment.appointment.domain.exception;

public class InvalidAppointmentStateException extends RuntimeException {
    public InvalidAppointmentStateException(String message) {
        super(message);
    }
}
