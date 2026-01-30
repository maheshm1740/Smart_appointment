import React, { useState } from 'react';
import WeeklyScheduleEditor from '../components/WeeklyScheduleEditor';
import { CalendarPlus, ArrowRight } from 'lucide-react';

const CreateSchedule = () => {
  const [doctorId, setDoctorId] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = (e) => {
    e.preventDefault();
    if (doctorId.trim()) {
      setIsStarted(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
            <CalendarPlus size={28} />
          </div>
          Create New Schedule
        </h1>
        <p className="text-slate-500 mt-2 max-w-2xl">
          Initialize a weekly schedule for a new doctor or an existing doctor who doesn't have a schedule configured yet.
        </p>
      </div>

      {!isStarted ? (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <CalendarPlus className="text-blue-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Enter Doctor Details</h2>
          <p className="text-slate-500 mb-8 text-sm">Please provide the Doctor UUID to begin configuring the schedule.</p>

          <form onSubmit={handleStart} className="space-y-4">
            <div>
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
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <span>Configuring for:</span>
            <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">{doctorId}</span>
            <button onClick={() => setIsStarted(false)} className="text-blue-600 hover:underline ml-2">Change</button>
          </div>
          <WeeklyScheduleEditor doctorId={doctorId} mode="create" />
        </div>
      )}
    </div>
  );
};

export default CreateSchedule;
