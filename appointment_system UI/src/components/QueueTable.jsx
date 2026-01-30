import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const QueueTable = ({ entries, onComplete, onCancel, loadingActionId }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <Clock className="text-slate-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Queue is Empty</h3>
        <p className="text-slate-500 text-sm text-center max-w-xs">
          There are no appointments currently in the queue for this doctor.
        </p>
      </div>
    );
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'EMERGENCY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Emergency
          </span>
        );
      case 'VIP':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            VIP
          </span>
        );
      case 'NORMAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Normal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-100">
            {priority}
          </span>
        );
    }
  };

  return (
    <div className="bg-white shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th scope="col" className="px-6 py-4">Position</th>
              <th scope="col" className="px-6 py-4">Appointment ID</th>
              <th scope="col" className="px-6 py-4">Priority</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr
                key={entry.appointmentId}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                    {entry.position}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {entry.appointmentId}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getPriorityBadge(entry.priority)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onComplete(entry.appointmentId)}
                      disabled={!!loadingActionId}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed group-hover:text-slate-500"
                      title="Complete Appointment"
                    >
                      {loadingActionId === `complete-${entry.appointmentId}` ? (
                        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckCircle size={20} strokeWidth={2} />
                      )}
                    </button>

                    <button
                      onClick={() => onCancel(entry.appointmentId)}
                      disabled={!!loadingActionId}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed group-hover:text-slate-500"
                      title="Cancel Appointment"
                    >
                      {loadingActionId === `cancel-${entry.appointmentId}` ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <XCircle size={20} strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-xs text-slate-500 text-center">
        Showing {entries.length} appointment{entries.length !== 1 ? 's' : ''} in queue
      </div>
    </div>
  );
};

export default QueueTable;
