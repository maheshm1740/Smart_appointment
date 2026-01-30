# 🏥 Smart Appointment & Queue Optimization System

A backend application built using **Spring Boot 4** that manages doctor appointments efficiently using **Domain-Driven Design (DDD)** and **Hexagonal Architecture**.  
The system focuses on clean design, priority-based queue handling, and doctor schedule management.

---

## 🎯 Purpose of the Project

Traditional appointment systems often face:
- Long patient waiting times  
- Overbooking issues  
- Poor separation of business logic  

This project solves these problems by:
- Enforcing doctor availability through schedules  
- Managing appointments through a defined lifecycle  
- Optimizing patient flow using priority-based queues  
- Keeping business logic independent of frameworks  

---

## 🧱 Architecture Used

This project follows **Hexagonal Architecture (Ports & Adapters)**:

- **Domain Layer** – Core business rules (Appointment, Queue, Schedule)
- **Application Layer** – Use cases (Create, Cancel, Complete, View)
- **Infrastructure Layer** – Database & JPA adapters
- **Adapters (In)** – REST Controllers

### Benefits
- High maintainability  
- Easy testing  
- Framework independence  
- Microservice readiness  

---

## 📦 Core Modules

### Appointment
- Create, confirm, cancel, and complete appointments
- Controls the complete appointment lifecycle

### Queue
- Maintains doctor-specific queues
- Supports priority-based ordering

### Schedule
- Manages doctor availability
- Prevents double booking
- Reserves and releases slots safely

---

## 📡 API Endpoints

### Appointments
```http
POST   /appointments
GET    /appointments/{appointmentId}
GET    /appointments/doctor/{doctorId}
DELETE /appointments/{appointmentId}
POST   /appointments/{appointmentId}/complete
```

### Queue
```http
GET /queues/doctor/{doctorId}\
```
### Schedule
```http
GET /schedules/doctor/{doctorId}
```
###🛠️ Tech Stack
Java 21

Spring Boot 4

PostgreSQL

JPA / Hibernate

Maven

REST APIs

DDD + Hexagonal Architecture

🧪 Error Handling
Centralized global exception handling

Domain-level validations

Clean and meaningful API responses

▶️ How to Run
Prerequisites
Java 21+

Maven

PostgreSQL

Steps
```
git clone <repository-url>
cd smart-appointment
mvn clean install
mvn spring-boot:run
```

Application runs at:

http://localhost:8080

## 🔮 Future Enhancements
Authentication & authorization

Notifications (Email / SMS)

Waiting time estimation

Admin dashboard

Microservices migration

Event-driven architecture

👨‍💻 Author
Mahesh M
Java Full-Stack Developer
Focus: Spring Boot • Clean Architecture • Scalable Backend Systems
