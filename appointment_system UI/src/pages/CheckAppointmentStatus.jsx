import React, { useState } from 'react';
import { getAppointment } from '../api/appointmentApi';
import { Search, Loader2, Calendar, Clock, User, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';

const CheckAppointmentStatus = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!appointmentId.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await getAppointment(appointmentId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Appointment not found.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'WAITING':
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4 pb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Check Status</h1>
        <p className="text-slate-500">Track your appointment in real-time</p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 mb-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              placeholder="Enter Appointment UUID"
              className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !appointmentId}
            className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Track'}
          </button>
        </form>
      </div>

      {/* Content Area */}
      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={24} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {data && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Ticket Header */}
          <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Appointment ID</p>
              <p className="font-mono text-lg text-white/90">{data.appointmentId}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(data.status)}`}>
              {data.status}
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-8 space-y-8">

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <User size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Doctor</span>
                </div>
                <p className="font-bold text-slate-900 break-all">{data.doctorId}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <User size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Patient</span>
                </div>
                <p className="font-bold text-slate-900 break-all">{data.patientId}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center gap-6">
              <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Scheduled For</p>
                <p className="text-xl font-bold text-slate-900">
                  {new Date(data.slotTime | data.appointmentTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-slate-500 font-medium">
                  {new Date(data.slotTime | data.appointmentTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

          </div>

          {/* Ticket Footer */}
          <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
            <p className="text-xs text-slate-400">Thank you for using MediQueue</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckAppointmentStatus;
