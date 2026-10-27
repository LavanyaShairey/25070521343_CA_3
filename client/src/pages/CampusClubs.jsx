import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Compass,
  Terminal,
  Cpu,
  Bot,
  Music,
  Shield,
  Gamepad2,
  Rocket,
  MapPin,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { clubService } from '../services/api';

const ICON_MAP = {
  Terminal,
  Cpu,
  Bot,
  Music,
  Shield,
  Gamepad2,
  Rocket,
  Users,
};

const CampusClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setIsLoading(true);
        const res = await clubService.getClubs();
        if (res.success) {
          setClubs(res.clubs || []);
        }
      } catch (err) {
        console.error('Failed to load clubs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleExploreClubEvents = (clubName) => {
    navigate(`/events?club=${encodeURIComponent(clubName)}`);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-dark-950 via-dark-900 to-dark-850">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
          <Users className="w-4 h-4" />
          <span>STUDENT LIFE & ORGANIZATIONS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Campus Clubs & Technical Societies
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Connect with student-run computing chapters, maker labs, acoustics guilds, cybersecurity cells, and entrepreneurial networks powering campus life.
        </p>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => {
          const IconComponent = ICON_MAP[club.icon] || Users;
          return (
            <div
              key={club.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-800 bg-dark-850/80 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-card-hover group"
            >
              {/* Club Banner */}
              <div className="relative h-36 w-full overflow-hidden bg-dark-950">
                <img
                  src={club.banner}
                  alt={club.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-dark-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                    {club.category}
                  </span>
                </div>

                {/* Club Floating Icon */}
                <div className="absolute -bottom-4 right-5 w-12 h-12 rounded-2xl bg-dark-850 border border-slate-700/80 flex items-center justify-center text-amber-400 shadow-xl group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>

              {/* Club Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {club.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {club.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {club.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-dark-900 text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Info strip */}
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{club.membersCount} Active Members</span>
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {club.activeEventsCount || 1} Hosted Events
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{club.meetingVenue}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleExploreClubEvents(club.name)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-dark-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>View Club Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampusClubs;
