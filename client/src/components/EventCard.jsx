import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  CheckCircle2,
  ExternalLink,
  Tag,
  Zap,
} from 'lucide-react';

const CATEGORY_STYLES = {
  Hackathon: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  'Cultural Fest': 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  'Tech Fest': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  Workshop: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'Sports & E-Sports': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'Seminar & Talk': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'Design & Arts': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  'Club Meet': 'bg-teal-500/20 text-teal-300 border-teal-500/40',
};

const EventCard = ({
  event,
  onSelectEvent,
  onQuickRegister,
  isUserRegistered = false,
}) => {
  const {
    _id,
    title,
    tagline,
    category,
    club,
    venue,
    date,
    time,
    entryFee,
    prizePool,
    capacity = 150,
    registeredCount = 0,
    bannerUrl,
    mode = 'In-Person',
  } = event;

  const spotsLeft = Math.max(0, capacity - registeredCount);
  const fillPercentage = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const isFull = spotsLeft === 0;

  const categoryBadgeClass =
    CATEGORY_STYLES[category] || 'bg-slate-500/20 text-slate-300 border-slate-500/40';

  // Format nice date string
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover border border-slate-800/80 bg-dark-850/80">
      {/* Banner Image & Overlay Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-dark-950">
        <img
          src={bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

        {/* Category & Mode Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${categoryBadgeClass}`}
          >
            {category}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-dark-950/80 text-slate-300 border border-slate-700 backdrop-blur-md">
            {mode}
          </span>
        </div>

        {/* Free vs Fee Badge */}
        <div className="absolute top-3 right-3 z-10">
          {entryFee === 0 ? (
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 shadow-md">
              FREE RSVP
            </span>
          ) : (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-dark-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              ₹{entryFee}
            </span>
          )}
        </div>

        {/* Host Club Name */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 text-xs font-semibold text-amber-300 truncate">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{club}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3
            onClick={() => onSelectEvent(event)}
            className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {title}
          </h3>

          {tagline && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-1 italic">
              "{tagline}"
            </p>
          )}

          {/* Date, Time & Venue Meta */}
          <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{formattedDate}</span>
              <span className="text-slate-500">•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{time}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{venue}</span>
            </div>

            {prizePool && (
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{prizePool}</span>
              </div>
            )}
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              {registeredCount} / {capacity} Attendees
            </span>
            <span
              className={
                isFull
                  ? 'text-rose-400 font-bold'
                  : fillPercentage > 75
                  ? 'text-amber-400 font-semibold'
                  : 'text-emerald-400'
              }
            >
              {isFull ? 'Sold Out' : `${spotsLeft} spots left`}
            </span>
          </div>

          <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? 'bg-rose-500'
                  : fillPercentage > 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onSelectEvent(event)}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-slate-700/80 transition-all text-center"
          >
            Details
          </button>

          {isUserRegistered ? (
            <div className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Registered</span>
            </div>
          ) : (
            <button
              onClick={() => onQuickRegister(event)}
              disabled={isFull}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isFull
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-hive'
              }`}
            >
              {isFull ? 'Waitlist' : 'RSVP Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
