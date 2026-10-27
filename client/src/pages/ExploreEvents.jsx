import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Filter,
  Calendar,
  Trophy,
  Users,
  Compass,
  ArrowRight,
  Flame,
  Zap,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import RegisterModal from '../components/RegisterModal';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'All',
  'Hackathon',
  'Cultural Fest',
  'Tech Fest',
  'Workshop',
  'Sports & E-Sports',
  'Seminar & Talk',
  'Design & Arts',
];

const ExploreEvents = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, activeClubs: 0 });

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // all, free, paid
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Modals state
  const [activeEventModal, setActiveEventModal] = useState(null);
  const [activeRegisterModal, setActiveRegisterModal] = useState(null);

  // Fetch events from MongoDB
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedMode !== 'All') params.mode = selectedMode;
      if (priceFilter !== 'all') params.price = priceFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sortBy) params.sort = sortBy;

      const res = await eventService.getEvents(params);
      if (res.success) {
        setEvents(res.events || []);
      }
    } catch (err) {
      console.error('Error loading events:', err);
      showToast('Could not fetch events from MongoDB.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch platform stats & user registered tickets
  const fetchInitialData = async () => {
    try {
      const statsRes = await eventService.getStatsSummary();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.warn('Failed to load stats:', err);
    }

    if (isAuthenticated) {
      try {
        const myTicketsRes = await registrationService.getMyTickets();
        if (myTicketsRes.success) {
          const registeredEventIds = myTicketsRes.tickets.map((t) =>
            typeof t.event === 'object' ? t.event?._id : t.event
          );
          setUserRegistrations(registeredEventIds);
        }
      } catch (err) {
        console.warn('Failed to load user registrations:', err);
      }
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedMode, priceFilter, searchQuery, sortBy]);

  const handleRegistrationSuccess = (newReg) => {
    fetchEvents();
    fetchInitialData();
  };

  const featuredEvent = useMemo(() => {
    return events.find((e) => e.isFeatured) || events[0] || null;
  }, [events]);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Spotlight Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>CAMPUS EVENT HEADQUARTERS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Discover What’s Buzzing Across Campus.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            From 36-hour hackathons and collegiate rock battles to autonomous robowars and esports tournaments. RSVP for events, get your instant digital entry passes, and connect with university clubs.
          </p>

          {/* Quick Stats Pill Strip */}
          <div className="pt-2 flex flex-wrap gap-4 sm:gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-glow-hive" />
              <strong className="text-white font-bold">{stats.totalEvents || events.length}</strong> Live Events
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <strong className="text-white font-bold">{stats.totalRegistrations || 1200}+</strong> Active RSVPs
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <strong className="text-white font-bold">{stats.activeClubs || 7}</strong> Campus Clubs
            </div>
          </div>
        </div>

        {/* Featured Card Teaser (Desktop) */}
        {featuredEvent && (
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={featuredEvent.bannerUrl}
                alt={featuredEvent.title}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-amber-500/30"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Featured Spotlight
                </span>
                <h3 className="text-base font-extrabold text-white mt-1 line-clamp-1">
                  {featuredEvent.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>{featuredEvent.date}</span>
                  <span>•</span>
                  <span>{featuredEvent.venue}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveEventModal(featuredEvent)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-glow-hive flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <span>Explore Spotlight</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Search, Categories & Filters Bar */}
      <section className="space-y-4">
        {/* Category Pills (Horizontal Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-glow-hive scale-105'
                    : 'bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-dark-850/60 border border-slate-800">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event title, host club, venue, tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-slate-700/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Mode Filter */}
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="px-3 py-2 rounded-xl bg-dark-900 border border-slate-700/60 text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Modes</option>
              <option value="In-Person">In-Person</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Online">Online</option>
            </select>

            {/* Price Filter */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-dark-900 border border-slate-700/60 text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">Free & Paid</option>
              <option value="free">Free RSVP Only</option>
              <option value="paid">Paid Events</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-dark-900 border border-slate-700/60 text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="popular">Most Popular</option>
              <option value="date_asc">Earliest Date</option>
              <option value="capacity">Highest Capacity</option>
            </select>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {selectedCategory === 'All' ? 'All Upcoming Events' : `${selectedCategory} Events`}
            </h2>
            <p className="text-xs text-slate-400">
              Showing {events.length} active events in MongoDB
            </p>
          </div>
        </div>

        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-96 rounded-2xl bg-dark-850/60 border border-slate-800 animate-pulse flex flex-col justify-between p-5"
              >
                <div className="h-44 bg-dark-800 rounded-xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-5 bg-dark-800 rounded w-3/4" />
                  <div className="h-4 bg-dark-800 rounded w-1/2" />
                </div>
                <div className="h-9 bg-dark-800 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No matching events found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              No campus events currently match your selected filters. Try clearing the search or category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedMode('All');
                setPriceFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-amber-300 text-xs font-bold border border-slate-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Event Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const isRegistered = userRegistrations.includes(event._id);
              return (
                <EventCard
                  key={event._id}
                  event={event}
                  isUserRegistered={isRegistered}
                  onSelectEvent={(evt) => setActiveEventModal(evt)}
                  onQuickRegister={(evt) => setActiveRegisterModal(evt)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Modals */}
      <EventDetailModal
        event={activeEventModal}
        isOpen={!!activeEventModal}
        isUserRegistered={activeEventModal ? userRegistrations.includes(activeEventModal._id) : false}
        onClose={() => setActiveEventModal(null)}
        onRegister={(evt) => setActiveRegisterModal(evt)}
      />

      <RegisterModal
        event={activeRegisterModal}
        isOpen={!!activeRegisterModal}
        onClose={() => setActiveRegisterModal(null)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default ExploreEvents;
