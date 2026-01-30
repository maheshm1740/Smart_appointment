package com.smart_appointment.appointment.infrastructure.adapter.out;

import com.smart_appointment.appointment.domain.model.Appointment;
import com.smart_appointment.appointment.domain.repository.AppointmentRepository;
import com.smart_appointment.appointment.infrastructure.adapter.out.mapper.AppointmentMapper;
import com.smart_appointment.appointment.infrastructure.adapter.out.repository.AppointmentDataRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class AppointmentRepositoryAdapter implements AppointmentRepository {

    private final AppointmentDataRepository appointmentDataRepository;

    public AppointmentRepositoryAdapter(AppointmentDataRepository appointmentDataRepository) {
        this.appointmentDataRepository = appointmentDataRepository;
    }

    @Override
    public Appointment save(Appointment appointment) {
        var entity = AppointmentMapper.toJpa(appointment);
        var saved = appointmentDataRepository.save(entity);
        return AppointmentMapper.toDomain(saved);
    }

    @Override
    public Optional<Appointment> findById(UUID appointmentId) {
        return appointmentDataRepository.findById(appointmentId).map(AppointmentMapper::toDomain);
    }

    @Override
    public List<Appointment> findByDoctorId(UUID doctorId) {
        return appointmentDataRepository.findByDoctorId(doctorId)
                .stream()
                .map(AppointmentMapper::toDomain)
                .toList();
    }
}
