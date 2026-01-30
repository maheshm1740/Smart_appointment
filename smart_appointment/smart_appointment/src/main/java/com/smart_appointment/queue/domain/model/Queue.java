package com.smart_appointment.queue.domain.model;


import com.smart_appointment.queue.domain.enums.Priority;
import lombok.Getter;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Getter
public class Queue {

    private final UUID doctorId;
    private final List<QueueEntry> entries = new ArrayList<>();

    public Queue(UUID doctorId) {
        this.doctorId = doctorId;
    }

    public void add(UUID appointmentId, Priority priority) {
        entries.add(new QueueEntry(appointmentId, priority, 0));
        reorder();
    }

    public void remove(UUID appointmentId) {
        entries.removeIf(e -> e.getAppointmentId().equals(appointmentId));
        reorder();
    }

    public List<QueueEntry> getEntries() {
        return List.copyOf(entries);
    }

    // ---- Core Business Rule ----
    private void reorder() {
        entries.sort(
                Comparator
                        .comparing(QueueEntry::getPriority)
                        .thenComparing(QueueEntry::getPosition)
        );

        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setPosition(i + 1);
        }
    }
}
