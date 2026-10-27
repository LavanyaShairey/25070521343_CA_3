import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  Image as ImageIcon,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ListPlus,
  Trash2,
} from 'lucide-react';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PRESET_BANNERS = [
  {
    name: 'Hackathon Tech',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
  },
  {
    name: 'Music & Cultural',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
  },
  {
    name: 'Robotics & Hardware',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
  },
  {
    name: 'AI & Coding Lab',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
  },
  {
    name: 'E-Sports Arena',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',
  },
  {
    name: 'Startups & Pitching',
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
  },
];

const CreateEvent = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Hackathon',
    club: user?.clubAffiliation || 'Google Developer Student Club (GDSC)',
    college: user?.college || 'Apex Institute of Technology',
    venue: '',
    mode: 'In-Person',
    date: '2026-11-20',
    time: '10:00 AM - 05:00 PM',
    registrationDeadline: '2026-11-18',
    entryFee: 0,
    prizePool: '₹50,000 Cash Pool + Certificates',
    teamSize: 'Team of 2 - 4',
    capacity: 200,
    bannerUrl: PRESET_BANNERS[0].url,
    contactEmail: user?.email || '',
    contactPhone: '+91 98765 43210',
    isFeatured: false,
  });

  // Schedule items
  const [scheduleItems, setScheduleItems] = useState([
    { time: '10:00 AM', title: 'Registration & Welcome Keynote', speaker: 'Faculty & Club Leads' },
    { time: '01:00 PM', title: 'Main Round / Exhibition Kickoff', speaker: 'All Participants' },
    { time: '04:30 PM', title: 'Judging & Awards Ceremony', speaker: 'Jury Panel' },
  ]);

  const [rules, setRules] = useState([
    'Open to all currently enrolled college students with valid student ID.',
    'Follow university campus code of conduct throughout the event.',
  ]);

  const [ruleInput, setRuleInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddScheduleItem = () => {
    setScheduleItems([
      ...scheduleItems,
      { time: '12:00 PM', title: 'New Session', speaker: '' },
    ]);
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = [...scheduleItems];
    updated[index][field] = value;
    setScheduleItems(updated);
  };

  const handleRemoveScheduleItem = (index) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!ruleInput.trim()) return;
    setRules([...rules, ruleInput.trim()]);
    setRuleInput('');
  };

  const handleRemoveRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.venue || !formData.date) {
      showToast('Please fill out the Title, Description, Venue, and Date.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        entryFee: Number(formData.entryFee),
        capacity: Number(formData.capacity),
        schedule: scheduleItems,
        rules,
      };

      const res = await eventService.createEvent(payload);

      if (res.success) {
        showToast('Event published successfully to MongoDB!', 'success');
        navigate('/events');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create event.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-dark-950 via-dark-900 to-dark-850">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
          <PlusCircle className="w-4 h-4" />
          <span>HOST CAMPUS EVENT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Publish a New College Event
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Bring your hackathon, cultural battle, tech talk, or tournament to life. Your event will be published directly to MongoDB and visible across campus.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Core Details */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>1. Basic Event Information</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Event Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. CodeNova 2026 — 24hr Campus Hackathon"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Catchy Tagline
              </label>
              <input
                type="text"
                name="tagline"
                placeholder="e.g. Innovate, Collaborate & Deploy Tomorrow's Solutions"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Cultural Fest">Cultural Fest</option>
                  <option value="Tech Fest">Tech Fest</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Sports & E-Sports">Sports & E-Sports</option>
                  <option value="Seminar & Talk">Seminar & Talk</option>
                  <option value="Design & Arts">Design & Arts</option>
                  <option value="Club Meet">Club Meet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Organizing Club / Society <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="club"
                  required
                  placeholder="e.g. Google Developer Student Club"
                  value={formData.club}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Event Mode
                </label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="In-Person">In-Person</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Full Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Detail what attendees will do, highlights, perks, requirements, and food/refreshments provided..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Logistics & Venue */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>2. Venue, Date & Logistics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Venue Location <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="venue"
                required
                placeholder="e.g. Main Auditorium & Tech Lab 3"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                College / Institution
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Event Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Time Duration <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="time"
                placeholder="e.g. 10:00 AM - 05:00 PM"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Entry Fee (₹) <span className="text-slate-500 font-normal">(0 for Free)</span>
              </label>
              <input
                type="number"
                name="entryFee"
                min={0}
                value={formData.entryFee}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Prize Pool / Rewards
              </label>
              <input
                type="text"
                name="prizePool"
                placeholder="e.g. ₹50,000 + Goodies"
                value={formData.prizePool}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Max Attendee Capacity
              </label>
              <input
                type="number"
                name="capacity"
                min={10}
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Banner Image */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>3. Event Banner Artwork</span>
          </h2>

          <div className="space-y-3">
            <p className="text-xs text-slate-300">Choose from curated campus presets or provide an image URL:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_BANNERS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: preset.url }))}
                  className={`relative rounded-xl overflow-hidden h-24 border-2 transition-all ${
                    formData.bannerUrl === preset.url
                      ? 'border-amber-400 shadow-glow-hive scale-[1.02]'
                      : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-dark-950/40 flex items-end p-2">
                    <span className="text-[11px] font-bold text-white drop-shadow">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Custom Banner URL
              </label>
              <input
                type="url"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Schedule / Itinerary */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-rose-400" />
              <span>4. Event Itinerary & Milestones</span>
            </h2>
            <button
              type="button"
              onClick={handleAddScheduleItem}
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              + Add Slot
            </button>
          </div>

          <div className="space-y-3">
            {scheduleItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-xl bg-dark-900 border border-slate-800"
              >
                <input
                  type="text"
                  placeholder="Time (e.g. 10:00 AM)"
                  value={item.time}
                  onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                  className="w-28 px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-xs text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Session Title"
                  value={item.title}
                  onChange={(e) => handleScheduleChange(idx, 'title', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-xs text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Speaker / Host"
                  value={item.speaker}
                  onChange={(e) => handleScheduleChange(idx, 'speaker', e.target.value)}
                  className="w-32 hidden sm:block px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveScheduleItem(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="px-6 py-3 rounded-2xl bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white font-bold text-sm border border-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-glow-hive flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Publish Event to MongoDB</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
