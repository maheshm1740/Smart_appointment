import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateAppointment from './pages/CreateAppointment';


import DoctorQueue from './pages/DoctorQueue';
import DoctorDashboard from './pages/DoctorDashboard';
import CreateSchedule from './pages/CreateSchedule';
import CheckAppointmentStatus from './pages/CheckAppointmentStatus';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/create-appointment" replace />} />
            <Route path="/create-appointment" element={<CreateAppointment />} />
            <Route path="/doctor-queue" element={<DoctorQueue />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/create-schedule" element={<CreateSchedule />} />
            <Route path="/check-status" element={<CheckAppointmentStatus />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Smart Appointment System
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
