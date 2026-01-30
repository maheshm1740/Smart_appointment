package com.smart_appointment.appointment.infrastructure.adapter.out.mapper;

import com.smart_appointment.appointment.domain.enums.Priority;
import com.smart_appointment.appointment.domain.model.Appointment;
import com.smart_appointment.appointment.infrastructure.adapter.out.entity.AppointmentJpaEntity;

public class AppointmentMapper {

    public static AppointmentJpaEntity toJpa(Appointment domain) {
        return new AppointmentJpaEntity(
                domain.getId(),
                domain.getDoctorId(),
                domain.getPatientId(),
                domain.getSlotTime(),
                domain.getPriority(),
                domain.getStatus()
        );
    }

    public static Appointment toDomain(AppointmentJpaEntity entity) {

        Appointment appointment = new Appointment(
                entity.getId(),
                entity.getDoctorId(),
                entity.getPatientId(),
                entity.getSlotTime(),
                entity.getPriority()
        );

        // 🔥 Restore status via domain behavior
        switch (entity.getStatus()) {

            case CONFIRMED -> appointment.confirm();

            case IN_QUEUE -> {
                appointment.confirm();
                appointment.moveToQueue();
            }

            case COMPLETED -> {
                appointment.confirm();
                appointment.moveToQueue();
                appointment.complete();
            }

            case CANCELLED -> appointment.cancel();

            case REQUESTED -> {
                // default state, do nothing
            }
        }

        return appointment;
    }

}
