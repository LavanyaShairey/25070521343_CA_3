import React, { useState } from 'react';
import {
  X,
  Ticket,
  Users,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { registrationService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterModal = ({ event, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredTicket, setRegisteredTicket] = useState(null);

  if (!isOpen || !event) return null;

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!memberInput.trim()) return;
    if (teamMembers.length >= 6) {
      showToast('Maximum team members reached.', 'info');
      return;
    }
    setTeamMembers([...teamMembers, memberInput.trim()]);
    setMemberInput('');
  };

  const handleRemoveMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please log in or create an account to RSVP.', 'error');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await registrationService.registerForEvent(event._id, {
        teamName,
        teamMembers,
        notes,
      });

      if (res.success) {
        setRegisteredTicket(res.registration || { ticketCode: res.ticketCode });
        showToast('🎉 Digital Pass generated & registered in MongoDB!', 'success');
        if (onSuccess) {
          onSuccess(res.registration);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete registration.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onClose();
    setRegisteredTicket(null);
    navigate('/my-tickets');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg glass-panel bg-dark-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Event RSVP & Pass</h3>
              <p className="text-xs text-slate-400">Official Campus Registration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {registeredTicket ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-brand animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-white">You're In!</h4>
              <p className="text-sm text-slate-300 mt-1">
                Your entry ticket has been confirmed and saved to MongoDB.
              </p>
            </div>

            {/* Generated Ticket Box */}
            <div className="p-4 rounded-2xl bg-dark-850 border border-amber-500/40 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Ticket ID</span>
                <span className="text-amber-400 font-mono font-extrabold text-sm tracking-wider">
                  {registeredTicket.ticketCode || 'EH-2026-CONFIRMED'}
                </span>
              </div>
              <p className="text-sm font-bold text-white truncate">{event.title}</p>
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.date}</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{event.venue}</span>
              </div>
              <p className="text-xs text-emerald-300 font-medium pt-1">
                Attendee: {user?.name} ({user?.studentId || 'Student'})
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-dark-800 hover:bg-dark-750 text-slate-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-hive flex items-center justify-center gap-2 transition-all"
              >
                <span>View My Passes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmitRegistration} className="p-6 space-y-4">
            {/* Event Summary Banner */}
            <div className="p-3.5 rounded-2xl bg-dark-850/80 border border-slate-800 flex items-center gap-3">
              <img
                src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80'}
                alt={event.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {event.category}
                </span>
                <h4 className="text-sm font-bold text-white truncate mt-1">{event.title}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>{event.date}</span>
                  <span>•</span>
                  <span>{event.entryFee === 0 ? 'Free Entry' : `₹${event.entryFee}`}</span>
                </p>
              </div>
            </div>

            {/* Attendee Details Card */}
            <div className="p-3.5 rounded-2xl bg-dark-850/40 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Attendee Name:</span>
                <span className="text-white font-semibold">{user?.name || 'Guest'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">College Email:</span>
                <span className="text-slate-200">{user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Student Roll / ID:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {user?.studentId || 'EH-STU-01'}
                </span>
              </div>
            </div>

            {/* Team Registration (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Team Name <span className="text-slate-500 font-normal">(Optional for groups/hackathons)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CodeWarriors, ByteMe, CyberSquad"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Additional Teammates <span className="text-slate-500 font-normal">(Names or Student IDs)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma (Roll 204)"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-dark-850 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-amber-300 text-xs font-bold border border-slate-700 transition-colors"
                >
                  + Add
                </button>
              </div>

              {teamMembers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {teamMembers.map((member, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-800 border border-slate-700 text-xs text-slate-200"
                    >
                      <span>{member}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Special Requests or Dietary / Hardware Needs
              </label>
              <input
                type="text"
                placeholder="e.g. Need LAN port, Vegetarian meal, Wheelchair access"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-sm font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-hive transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm RSVP & Generate Pass</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
