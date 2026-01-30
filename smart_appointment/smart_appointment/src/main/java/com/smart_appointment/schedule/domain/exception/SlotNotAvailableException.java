package com.smart_appointment.schedule.domain.exception;

public class SlotNotAvailableException extends IllegalStateException{
    public SlotNotAvailableException(String message){
        super(message);
    }
}
