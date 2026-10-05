import React, { useState } from 'react';
import { X, Calendar, MapPin, Video, Users, CheckSquare, Plus } from 'lucide-react';
import { PAWBatch, ICLMember, WorkshopType } from '@/types/paw';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMembers: ICLMember[];
  onBatchCreated: (batch: PAWBatch) => void;
}

export const NewBatchModal: React.FC<NewBatchModalProps> = ({
  isOpen,
  onClose,
  availableMembers,
  onBatchCreated,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<WorkshopType>('Offline');
  const [venueOrLink, setVenueOrLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetRegistrations, setTargetRegistrations] = useState(100);
  const [pawHeadId, setPawHeadId] = useState(availableMembers[0]?.id || '');
  
  // Creation Meeting Checklist
  const [meetingDone, setMeetingDone] = useState(true);
  const [rolesExplained, setRolesExplained] = useState(true);
  const [callingAllocated, setCallingAllocated] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) return;

    // Calculate Welcome Start Date as T-7 days before startDate
    const start = new Date(startDate);
    const welcomeDate = new Date(start);
    welcomeDate.setDate(welcomeDate.getDate() - 7);
    const welcomeStartStr = welcomeDate.toISOString().split('T')[0];

    const newBatch: PAWBatch = {
      id: `batch-${Date.now()}`,
      name,
      code: code || `PAW-${type.toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      type,
      venueOrLink: venueOrLink || (type === 'Online' ? 'Zoom Live Interactive Room' : 'ICL Foundation Center'),
      startDate,
      endDate,
      welcomeStartDate: welcomeStartStr,
      pawHeadId,
      status: 'Calling',
      totalTargetRegistrations: Number(targetRegistrations),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onBatchCreated(newBatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Create New PAW</h2>
            <p className="text-xs text-slate-500">PAW Creation, Dates, Head Assignment & Team Roster</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* PAW Batch Title & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PAW Batch Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PAW Offline Ahmedabad Batch #43"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batch Code
              </label>
              <input
                type="text"
                placeholder="PAW-AHM-43"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Workshop Mode (Online / Offline) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Workshop Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('Offline')}
                className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg border text-xs font-medium transition ${
                  type === 'Offline'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>🏛️ Offline (Venue / Location)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('Online')}
                className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg border text-xs font-medium transition ${
                  type === 'Online'
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-blue-600" />
                <span>🌐 Online (Zoom / Meeting)</span>
              </button>
            </div>
          </div>

          {/* Venue or Online Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {type === 'Offline' ? 'Venue Address (Offline Location)' : 'Meeting URL (Online Link)'}
            </label>
            <input
              type="text"
              placeholder={type === 'Offline' ? 'e.g. ICL Foundation Center, Satellite, Ahmedabad' : 'e.g. https://zoom.us/j/9876543210'}
              value={venueOrLink}
              onChange={(e) => setVenueOrLink(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Dates & Target */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Participants
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={targetRegistrations}
                onChange={(e) => setTargetRegistrations(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* PAW Head Assignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign PAW Head
            </label>
            <select
              value={pawHeadId}
              onChange={(e) => setPawHeadId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {availableMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role.replace('_', ' ')}) — {m.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Creation Meeting & Roles Checklist */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Creation Checklist</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={meetingDone}
                  onChange={(e) => setMeetingDone(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <span>Creation Meeting Done</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rolesExplained}
                  onChange={(e) => setRolesExplained(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <span>Roles & Responsibilities Defined</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={callingAllocated}
                  onChange={(e) => setCallingAllocated(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <span>Capacity Allocated</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Create Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
