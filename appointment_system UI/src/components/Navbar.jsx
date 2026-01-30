import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, PlusCircle, LayoutDashboard, CalendarPlus, Search } from 'lucide-react';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
      ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="block text-xl font-bold text-slate-900 tracking-tight leading-none">
                MediQueue
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                Smart Appointment System
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <NavLink to="/create-appointment" className={linkClass}>
              <PlusCircle size={18} />
              <span>New Appointment</span>
            </NavLink>

            <NavLink to="/doctor-dashboard" className={linkClass}>
              <LayoutDashboard size={18} />
              <span>Doctor Dashboard</span>
            </NavLink>

            <NavLink to="/create-schedule" className={linkClass}>
              <CalendarPlus size={18} />
              <span>New Schedule</span>
            </NavLink>

            <NavLink to="/check-status" className={linkClass}>
              <Search size={18} />
              <span>Status</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
