import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Printer,
  Trash2,
  CheckCircle2,
  Zap,
  Users,
} from 'lucide-react';

const TicketPassCard = ({ ticket, onCancel, onPrint }) => {
  const {
    _id,
    ticketCode,
    event,
    teamName,
    teamMembers = [],
    status = 'confirmed',
    registeredAt,
  } = ticket;

  if (!event) return null;

  const formattedRegDate = new Date(registeredAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative glass-card rounded-3xl overflow-hidden border border-amber-500/30 bg-dark-850/90 shadow-2xl transition-all duration-300 hover:border-amber-400/50 group printable-pass">
      
      {/* Top Header Strip */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 px-6 py-2.5 flex items-center justify-between text-slate-950 font-black text-xs uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 fill-slate-950" />
          <span>EventHive Official Campus Pass</span>
        </div>
        <div className="flex items-center gap-1 font-mono">
          <span className="bg-slate-950/20 px-2 py-0.5 rounded text-[11px] font-bold">
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-7 flex flex-col md:flex-row gap-6 justify-between items-stretch">
        
        {/* Left Side: Event & Pass Details */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {event.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Host: <strong className="text-slate-200">{event.club}</strong>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {event.title}
            </h3>
          </div>

          {/* Logistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-900/60 border border-slate-800">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Date & Time</p>
                <p className="font-semibold text-white">{event.date} • {event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-900/60 border border-slate-800">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Venue</p>
                <p className="font-semibold text-white truncate">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Team / Attendee Tag */}
          {teamName && (
            <div className="p-3 rounded-xl bg-dark-900/40 border border-slate-800/80 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">Team:</span>
                <span className="font-bold text-white">{teamName}</span>
              </div>
              {teamMembers.length > 0 && (
                <span className="text-[11px] text-slate-400">
                  +{teamMembers.length} member(s)
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Issued: {formattedRegDate}</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Entry Pass
            </span>
          </div>
        </div>

        {/* Divider / Perforated Line */}
        <div className="hidden md:block w-px bg-dashed border-r border-dashed border-slate-700/80 my-2 relative" />

        {/* Right Side: QR Code & Unique Ticket ID */}
        <div className="w-full md:w-56 flex flex-col items-center justify-between p-4 rounded-2xl bg-dark-950/80 border border-slate-800 text-center shrink-0">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              SCAN AT ENTRY GATE
            </p>
            
            {/* Visual Simulated QR Box */}
            <div className="w-32 h-32 mx-auto bg-white rounded-xl p-2.5 shadow-inner flex flex-col items-center justify-center my-2">
              <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-slate-950 rounded">
                <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                <div className="bg-white col-span-1 rounded-sm" />
                <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                <div className="bg-white col-span-1" />
                <div className="bg-white col-span-3 row-span-1 rounded-sm" />
                <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                <div className="bg-white col-span-1" />
                <div className="bg-white col-span-2 rounded-sm" />
              </div>
            </div>

            <p className="font-mono text-sm font-black text-amber-400 tracking-wider">
              {ticketCode}
            </p>
          </div>

          {/* Ticket Action Buttons (Hidden when printing) */}
          <div className="flex items-center gap-2 w-full pt-3 mt-2 border-t border-slate-800 print:hidden">
            <button
              onClick={() => onPrint && onPrint(ticket)}
              className="flex-1 py-1.5 px-2 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 border border-slate-700 transition-colors"
              title="Print Pass"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={() => onCancel && onCancel(_id)}
              className="py-1.5 px-2 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-1 border border-rose-500/30 transition-colors"
              title="Cancel RSVP"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPassCard;
