import React, { useState } from 'react';
import QueueTable from '../components/QueueTable';
import WeeklyScheduleEditor from '../components/WeeklyScheduleEditor';
import { getDoctorQueue, completeAppointment, cancelAppointment } from '../api/appointmentApi';
import { LayoutDashboard, Users, Calendar, Search, Loader2, LogOut } from 'lucide-react';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'schedule'
  const [doctorId, setDoctorId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Queue State
  const [queueData, setQueueData] = useState(null);
  const [queueLoading, setQueueLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [queueError, setQueueError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (doctorId.trim()) {
      setIsLoggedIn(true);
      fetchQueue();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDoctorId('');
    setQueueData(null);
    setQueueError(null);
  };

  const fetchQueue = async () => {
    if (!doctorId) return;
    setQueueLoading(true);
    setQueueError(null);
    try {
      const data = await getDoctorQueue(doctorId);
      setQueueData(data);
    } catch (err) {
      console.error(err);
      setQueueError('Failed to load queue. Please check the Doctor ID.');
    } finally {
      setQueueLoading(false);
    }
  };

  const handleComplete = async (appointmentId) => {
    if (!window.confirm('Mark this appointment as completed?')) return;
    setActionLoadingId(`complete-${appointmentId}`);
    try {
      await completeAppointment(appointmentId);
      await fetchQueue();
    } catch (err) {
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
      alert('Failed to cancel appointment: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <LayoutDashboard className="text-white" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Doctor Dashboard</h2>
        <p className="text-slate-500 mb-8">Enter your UUID to access your queue and schedule.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative text-left">
            <input
              type="text"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              placeholder="Doctor UUID"
              className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-mono text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online as <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{doctorId}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('queue')}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium text-sm transition-all border-b-2
            ${activeTab === 'queue'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }
          `}
        >
          <Users size={18} />
          Patient Queue
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium text-sm transition-all border-b-2
            ${activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }
          `}
        >
          <Calendar size={18} />
          Schedule Management
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'queue' ? (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={fetchQueue}
                disabled={queueLoading}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                {queueLoading ? <Loader2 className="animate-spin" size={14} /> : <Search size={14} />}
                Refresh Queue
              </button>
            </div>

            {queueError ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
                {queueError}
              </div>
            ) : (
              <QueueTable
                entries={queueData?.entries || []}
                onComplete={handleComplete}
                onCancel={handleCancel}
                loadingActionId={actionLoadingId}
              />
            )}
          </div>
        ) : (
          <WeeklyScheduleEditor doctorId={doctorId} />
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
