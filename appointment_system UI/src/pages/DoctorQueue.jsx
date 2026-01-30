import React, { useState } from 'react';
import { getDoctorQueue, completeAppointment, cancelAppointment } from '../api/appointmentApi';
import QueueTable from '../components/QueueTable';
import { Search, Stethoscope, Clock, Users, Loader2, AlertCircle } from 'lucide-react';

const DoctorQueue = () => {
  const [doctorId, setDoctorId] = useState('');
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchQueue = async (e) => {
    if (e) e.preventDefault();
    if (!doctorId) {
      setError('Please enter a Doctor ID.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctorQueue(doctorId);
      setQueueData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch queue.');
      setQueueData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (appointmentId) => {
    if (!window.confirm('Mark this appointment as completed?')) return;

    setActionLoadingId(`complete-${appointmentId}`);
    try {
      await completeAppointment(appointmentId);
      await fetchQueue();
    } catch (err) {
      console.error(err);
      alert('Failed to complete appointment: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    setActionLoadingId(`cancel-${appointmentId}`);
    try {
      await cancelAppointment(appointmentId);
      await fetchQueue();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel appointment: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-2">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-3">
          <Stethoscope className="text-blue-600" size={28} />
          Doctor Queue Dashboard
        </h2>
        <p className="text-slate-500 mt-1 ml-1">Manage patient flow and appointments efficiently.</p>
      </div>

      <div className="mb-8 sticky top-20 z-10">
        <form onSubmit={fetchQueue} className="flex gap-2 shadow-xl shadow-slate-200/50 p-2 bg-white rounded-2xl border border-slate-200">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              placeholder="Enter Doctor UUID to load queue..."
              className="w-full pl-10 pr-4 py-3 bg-transparent border-none rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none font-mono text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-700/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Fetch'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-700 text-sm">Error Loading Queue</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {queueData ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
              <Users size={14} />
              <span>Doctor ID: <span className="font-mono">{queueData.doctorId.substring(0, 8)}...</span></span>
            </div>

            {queueData.averageWaitTime !== undefined && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">
                <Clock size={14} />
                <span>Avg Wait: {queueData.averageWaitTime} mins</span>
              </div>
            )}
          </div>

          <QueueTable
            entries={queueData.entries}
            onComplete={handleComplete}
            onCancel={handleCancel}
            loadingActionId={actionLoadingId}
          />
        </div>
      ) : (
        !loading && !error && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No Queue Loaded</h3>
            <p className="text-slate-500 mt-1">Enter a Doctor ID above and hit "Fetch" to see the schedule.</p>
          </div>
        )
      )}
    </div>
  );
};

export default DoctorQueue;
