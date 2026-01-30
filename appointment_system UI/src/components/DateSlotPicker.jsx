import React, { useState, useEffect } from 'react';
import { getDoctorAvailability } from '../api/scheduleApi';
import { Calendar as CalendarIcon, Clock, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';

const DateSlotPicker = ({ doctorId, onSlotSelect, selectedSlot, className = "" }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableRanges, setAvailableRanges] = useState([]); // Slots from API (ranges)
  const [selectedRange, setSelectedRange] = useState(null); // The range user clicked
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with today's date
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, []);

  // Fetch ranges when date/doctor changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (doctorId && selectedDate) {
        fetchAvailability();
      } else {
        setAvailableRanges([]);
      }
      setSelectedRange(null);
      onSlotSelect(null); // Clear parent selection
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, selectedDate]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching availability for ${doctorId} on ${selectedDate}`);
      const data = await getDoctorAvailability(doctorId, selectedDate);
      console.log("Availability:", data);

      let ranges = [];
      if (Array.isArray(data)) ranges = data;
      else if (data?.availableSlots) ranges = data.availableSlots;
      else if (data?.slots) ranges = data.slots;

      setAvailableRanges(ranges);
    } catch (err) {
      console.error(err);
      if (err?.status !== 404) setError('Could not load slots.');
      setAvailableRanges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedRange(null);
    onSlotSelect(null);
  };

  // 1. Handle Range Click
  const handleRangeClick = (range) => {
    // Normalize range object
    const start = range.start || (typeof range === 'string' ? range.split(' - ')[0] : range.startTime);
    const end = range.end || (typeof range === 'string' ? range.split(' - ')[1] : range.endTime);

    // Safety check
    if (!start || !end) {
      // Fallback for single time points (unlikely given requirement, but safe)
      const time = start || range.time || range;
      onSlotSelect(`${selectedDate}T${time}`);
      return;
    }

    setSelectedRange({ start, end, original: range });
    onSlotSelect(null); // Reset specific time until chosen
  };

  // 2. Handle Specific Time Click
  const handleTimeSelect = (timeStr) => {
    const fullIso = `${selectedDate}T${timeStr}`;
    onSlotSelect(fullIso);
  };

  // Helper: Generate 15-min intervals
  const generateTimeSlots = (startStr, endStr) => {
    if (!startStr || !endStr) return [];

    const slots = [];
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);

    let current = new Date();
    current.setHours(startH, startM, 0, 0);

    const end = new Date();
    end.setHours(endH, endM, 0, 0);

    while (current < end) {
      const timeString = current.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      slots.push(timeString);
      current.setMinutes(current.getMinutes() + 15);
    }
    return slots;
  };

  // Helper: Check past time
  const isTimeDisabled = (timeStr) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (selectedDate !== todayStr) return false;

    const now = new Date();
    const [h, m] = timeStr.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(h, m, 0, 0);

    return slotTime < now;
  };

  // Render logic helpers
  const getRangeLabel = (range) => {
    if (typeof range === 'string') return range;
    if (range.start && range.end) return `${range.start} - ${range.end}`;
    return range.time || "Unknown Slot";
  };

  const isRangeAvailable = (range) => {
    if (range.available !== undefined) return range.available;
    if (range.isAvailable !== undefined) return range.isAvailable;
    return true;
  };

  const timeOptions = selectedRange ? generateTimeSlots(selectedRange.start, selectedRange.end) : [];

  return (
    <div className={`space-y-4 ${className} flex flex-col h-full`}>
      {/* Date Picker */}
      <div className="relative shrink-0">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
          Select Date
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <CalendarIcon size={16} />
          </div>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-4 custom-scrollbar">

        {/* Step 1: Range Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Available Slots
            </label>
            {loading && <RefreshCw size={12} className="animate-spin text-blue-600" />}
          </div>

          {loading && availableRanges.length === 0 ? (
            <div className="p-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <RefreshCw className="animate-spin mx-auto text-slate-400 mb-1" size={16} />
              <p className="text-xs text-slate-400">Loading...</p>
            </div>
          ) : availableRanges.length === 0 ? (
            <div className="p-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">No availability.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availableRanges.map((range, idx) => {
                const label = getRangeLabel(range);
                const available = isRangeAvailable(range);
                const isRangeSelected = selectedRange?.original === range; // Reference check

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!available}
                    onClick={() => handleRangeClick(range)}
                    className={`
                             px-2 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5
                             ${!available
                        ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                        : isRangeSelected
                          ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-100 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                      }
                          `}
                  >
                    <Clock size={12} />
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2: Time Selection */}
        {selectedRange && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Pick Time
              </label>
              <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                {selectedRange.start} - {selectedRange.end}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeOptions.map((time) => {
                const disabled = isTimeDisabled(time);
                const fullIso = `${selectedDate}T${time}`;
                const isSelected = selectedSlot === fullIso;

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleTimeSelect(time)}
                    className={`
                             py-1.5 text-xs font-medium rounded border transition-all
                             ${disabled
                        ? 'bg-slate-50 text-slate-300 border-transparent decoration-slate-300 line-through cursor-not-allowed'
                        : isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700'
                      }
                          `}
                  >
                    {time}
                  </button>
                );
              })}
              {timeOptions.length === 0 && (
                <p className="col-span-3 text-xs text-slate-400 italic">No valid times in this slot.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DateSlotPicker;
