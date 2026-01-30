import React, { useState, useEffect } from 'react';
import { getWeeklySchedule, updateWeeklySchedule, createWeeklySchedule, deleteWeeklySchedule } from '../api/scheduleApi';
import { Clock, Save, Trash2, Plus, AlertCircle, CheckCircle2, Loader2, Calendar } from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const WeeklyScheduleEditor = ({ doctorId, mode = 'edit' }) => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeDay, setActiveDay] = useState('MONDAY');

  useEffect(() => {
    if (doctorId && mode === 'edit') {
      fetchSchedule();
    } else if (mode === 'create') {
      // Start with empty schedule
      setSchedule({});
    }
  }, [doctorId, mode]);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeeklySchedule(doctorId);
      // Data structure expected: { days: { "MONDAY": [{start: "09:00", end: "12:00"}] } }
      const textSchedule = data?.days || {};
      setSchedule(textSchedule);
    } catch (err) {
      console.error(err);
      setError('Failed to load schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = (day) => {
    const daySlots = schedule[day] || [];
    const newSlot = { start: '09:00', end: '17:00' }; // Default
    setSchedule({
      ...schedule,
      [day]: [...daySlots, newSlot]
    });
  };

  const handleRemoveSlot = (day, index) => {
    const daySlots = schedule[day] || [];
    const newSlots = daySlots.filter((_, i) => i !== index);
    setSchedule({
      ...schedule,
      [day]: newSlots
    });
  };

  const handleSlotChange = (day, index, field, value) => {
    const daySlots = schedule[day] || [];
    const newSlots = [...daySlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSchedule({
      ...schedule,
      [day]: newSlots
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      const payload = {
        doctorId,
        days: schedule
      };

      if (mode === 'create') {
        await createWeeklySchedule(payload);
        setSuccess('Schedule created successfully!');
      } else {
        await updateWeeklySchedule(doctorId, payload);
        setSuccess('Schedule updated successfully!');
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save schedule.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the entire weekly schedule? This cannot be undone.')) return;

    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      await deleteWeeklySchedule(doctorId);
      setSchedule({});
      setSuccess('Schedule deleted successfully.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete schedule.');
    } finally {
      setSaving(false);
    }
  };

  if (!doctorId) {
    return <div className="text-center text-slate-500 p-8">Please enter a Doctor ID to continue.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            {mode === 'create' ? 'Create Schedule' : 'Weekly Schedule'}
          </h3>
          <p className="text-sm text-slate-500">Configure your available hours for each day.</p>
        </div>
        <div className="flex gap-2">
          {mode === 'edit' && (
            <button
              onClick={handleDelete}
              disabled={saving || Object.keys(schedule).length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-sm shadow-blue-500/30"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {mode === 'create' ? 'Create Schedule' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="mx-6 mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar Days */}
        <div className="w-full md:w-48 border-r border-slate-100 bg-slate-50/50">
          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible p-2 md:p-4 gap-1 md:gap-2">
            {DAYS.map(day => {
              const slotsCount = (schedule[day] || []).length;
              const isActive = activeDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${isActive
                      ? 'bg-white text-blue-700 shadow-md shadow-slate-200 ring-1 ring-slate-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <span className="capitalize">{day.toLowerCase()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-50 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                    {slotsCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-center">
            <h4 className="text-base font-semibold text-slate-800 capitalize">{activeDay.toLowerCase()} Slots</h4>
            <button
              onClick={() => handleAddSlot(activeDay)}
              className="text-sm flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus size={16} />
              Add Slot
            </button>
          </div>

          <div className="space-y-3">
            {(schedule[activeDay] || []).map((slot, index) => (
              <div key={index} className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <Clock size={16} className="text-slate-400" />
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) => handleSlotChange(activeDay, index, 'start', e.target.value)}
                    className="text-sm bg-transparent outline-none text-slate-700 w-24"
                  />
                </div>
                <span className="text-slate-400 text-sm font-medium">to</span>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <Clock size={16} className="text-slate-400" />
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => handleSlotChange(activeDay, index, 'end', e.target.value)}
                    className="text-sm bg-transparent outline-none text-slate-700 w-24"
                  />
                </div>

                <div className="flex-grow"></div>

                <button
                  onClick={() => handleRemoveSlot(activeDay, index)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  title="Remove slot"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {(schedule[activeDay] || []).length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Clock className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-slate-500 font-medium">No slots configured</p>
                <p className="text-slate-400 text-sm">Doctor is unavailable on this day.</p>
                <button
                  onClick={() => handleAddSlot(activeDay)}
                  className="mt-4 text-sm text-blue-600 font-medium hover:underline"
                >
                  + Add first slot
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleEditor;
