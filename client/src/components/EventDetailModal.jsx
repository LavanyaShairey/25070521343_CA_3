import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  CheckCircle2,
  Share2,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const EventDetailModal = ({
  event,
  isOpen,
  onClose,
  onRegister,
  isUserRegistered = false,
}) => {
  const { showToast } = useToast();

  if (!isOpen || !event) return null;

  const {
    _id,
    title,
    tagline,
    description,
    category,
    club,
    college,
    venue,
    mode = 'In-Person',
    date,
    time,
    registrationDeadline,
    entryFee,
    prizePool,
    teamSize,
    capacity,
    registeredCount = 0,
    bannerUrl,
    schedule = [],
    rules = [],
    organizerName,
    contactEmail,
    contactPhone,
  } = event;

  const spotsLeft = Math.max(0, capacity - registeredCount);
  const isFull = spotsLeft === 0;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Event link copied to clipboard!', 'info');
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl glass-panel bg-dark-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0 bg-dark-950">
          <img
            src={bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />

          {/* Close & Share Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-full bg-dark-950/70 hover:bg-dark-850 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md transition-colors"
              title="Share event link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-dark-950/70 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700/60 backdrop-blur-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Badges on Banner */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                {category}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-dark-950/80 text-slate-200 border border-slate-700 backdrop-blur-md">
                {mode}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {teamSize || 'Open Participation'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {title}
            </h2>
            {tagline && (
              <p className="mt-1 text-sm text-slate-300 italic font-medium">
                "{tagline}"
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Key Event Snapshot Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Date</span>
              </div>
              <p className="text-sm font-bold text-white">{date}</p>
              <p className="text-xs text-slate-400 truncate">{time}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</span>
              </div>
              <p className="text-sm font-bold text-white truncate">{venue}</p>
              <p className="text-xs text-slate-400 truncate">{college}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Prize Pool</span>
              </div>
              <p className="text-sm font-bold text-amber-300 truncate">{prizePool || 'Certificates'}</p>
              <p className="text-xs text-emerald-400 font-medium">{entryFee === 0 ? 'Free Entry' : `Fee: ₹${entryFee}`}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attendance</span>
              </div>
              <p className="text-sm font-bold text-white">
                {registeredCount} / {capacity}
              </p>
              <p className="text-xs text-indigo-300 font-medium">
                {isFull ? 'Housefull' : `${spotsLeft} seats available`}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
              About The Event
            </h4>
            <div className="p-5 rounded-2xl bg-dark-850/60 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>

          {/* Schedule / Agenda Timeline */}
          {schedule && schedule.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
                Event Schedule & Agenda
              </h4>
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-dark-850/80 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                      {item.time}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">{item.title}</h5>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                      )}
                      {item.speaker && (
                        <p className="text-xs text-indigo-300 mt-1 font-medium">
                          Lead: {item.speaker}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Guidelines */}
          {rules && rules.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Participation Rules & Guidelines
              </h4>
              <ul className="space-y-2 p-5 rounded-2xl bg-dark-850/50 border border-slate-800 text-xs text-slate-300 list-disc list-inside">
                {rules.map((rule, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Organizing Club & Contact */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-dark-850 to-dark-800 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Organized by</p>
                <p className="text-sm font-bold text-white">{club}</p>
                <p className="text-xs text-amber-300/80">{organizerName}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-700/60 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{contactEmail}</span>
                </a>
              )}
              {contactPhone && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-700/60">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{contactPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Footer */}
        <div className="p-4 sm:p-6 bg-dark-950 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs text-slate-400">Registration</p>
            <p className="text-base font-extrabold text-white">
              {entryFee === 0 ? 'Free Entry' : `₹${entryFee} per attendee`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>

            {isUserRegistered ? (
              <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You're Registered!</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onRegister(event);
                }}
                disabled={isFull}
                className={`px-7 py-2.5 rounded-xl text-sm font-bold shadow-glow-hive transition-all ${
                  isFull
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {isFull ? 'Event Full' : 'Claim Pass / RSVP Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
