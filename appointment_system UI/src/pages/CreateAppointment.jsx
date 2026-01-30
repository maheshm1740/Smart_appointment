import React, { useState } from 'react';
import { createAppointment } from '../api/appointmentApi';
import DateSlotPicker from '../components/DateSlotPicker';
import { User, Activity, Loader2, CheckCircle2, AlertOctagon, Sparkles } from 'lucide-react';

const CreateAppointment = () => {
  const [formData, setFormData] = useState({
    doctorId: '',
    patientId: '',
    slotTime: '',
    priority: 'NORMAL',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation: Require specific time (19 chars: YYYY-MM-DDTHH:MM:SS ? or just length check)
    if (!formData.doctorId || !formData.patientId || !formData.slotTime) {
      setError('Please fill in all fields and select a specific time.');
      setLoading(false);
      return;
    }

    try {
      const response = await createAppointment(formData);
      setSuccess(`Appointment created! ID: ${response.appointmentId}`);
      // Don't clear doctor ID for convenience? Or clear all.
      setFormData(prev => ({
        ...prev,
        patientId: '',
        slotTime: '',
        priority: 'NORMAL'
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create appointment.');
    } finally {
      setLoading(false);
    }
  };

  // Floating Input Component
  const FloatingInput = ({ label, name, type = "text", value, onChange, icon: Icon, placeholder = " " }) => (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Icon className={`h-4 w-4 transition-colors duration-300 ${value ? 'text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
      </div>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="block px-9 pb-2 pt-4 w-full text-sm text-slate-900 bg-slate-50 border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:bg-white transition-all peer"
        placeholder={placeholder}
        required
      />
      <label
        htmlFor={name}
        className="absolute text-xs text-slate-500 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-9 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
      >
        {label}
      </label>
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-focus-within:w-full"></div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-3xl"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[30%] h-[30%] rounded-full bg-purple-400/10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-5xl h-full max-h-[700px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-10 flex flex-col md:flex-row">

        {/* LEFT COLUMN: Time Selection */}
        <div className="w-full md:w-5/12 bg-slate-50/50 border-r border-slate-100 flex flex-col p-6 overflow-hidden">
          <div className="mb-4 shrink-0">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="text-blue-600" size={20} />
              Select Time
            </h2>
            <p className="text-xs text-slate-500">Pick a date and 15-min slot.</p>
          </div>

          <div className="flex-1 min-h-0 relative">
            <DateSlotPicker
              doctorId={formData.doctorId}
              selectedSlot={formData.slotTime}
              onSlotSelect={(slot) => setFormData(prev => ({ ...prev, slotTime: slot }))}
              className="h-full"
            />
            {!formData.doctorId && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 text-center">
                  <Activity className="mx-auto text-blue-500 mb-2" size={24} />
                  <p className="text-sm font-semibold text-slate-700">Doctor Required</p>
                  <p className="text-xs text-slate-500">Enter Doctor UUID on the right</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Details Form */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="text-center mb-6 shrink-0">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              New Appointment
            </h2>
            <p className="text-slate-500 text-xs font-medium">Complete booking details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
            <div className="space-y-4">
              <FloatingInput
                icon={Activity}
                label="Doctor UUID"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
              />

              <FloatingInput
                icon={User}
                label="Patient UUID"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
              />

              <div className="relative group pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 ml-1">Priority Level</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block px-3 py-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                >
                  <option value="NORMAL">Normal Priority</option>
                  <option value="VIP">VIP Request</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </div>

              {/* Selected Time Display */}
              <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Selected Slot</p>
                  <p className="text-sm font-bold text-slate-800 font-mono">
                    {formData.slotTime ? new Date(formData.slotTime).toLocaleString() : 'No time selected'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grow"></div>

            {/* Messages */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex gap-2 items-center mb-2">
                <AlertOctagon size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex gap-2 items-center mb-2">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.slotTime}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;
