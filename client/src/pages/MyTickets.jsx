import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  AlertCircle,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import TicketPassCard from '../components/TicketPassCard';
import { registrationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const MyTickets = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelTargetId, setCancelTargetId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchMyTickets = async () => {
    try {
      setIsLoading(true);
      const res = await registrationService.getMyTickets();
      if (res.success) {
        setTickets(res.tickets || []);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
      showToast('Could not load your digital passes.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handlePrint = (ticket) => {
    window.print();
  };

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;
    try {
      setIsCancelling(true);
      const res = await registrationService.cancelRegistration(cancelTargetId);
      if (res.success) {
        showToast('RSVP cancelled and pass revoked.', 'info');
        setTickets(tickets.filter((t) => t._id !== cancelTargetId));
        setCancelTargetId(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel RSVP.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-dark-950 to-dark-900">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Ticket className="w-3.5 h-3.5" />
            <span>STUDENT WALLET</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Campus Passes & Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Official digital entry barcodes registered under{' '}
            <strong className="text-amber-300">{user?.name}</strong> ({user?.studentId || 'ID Verified'}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold flex items-center gap-2 transition-colors print:hidden"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print All Passes</span>
          </button>
          <Link
            to="/events"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-glow-hive flex items-center gap-1.5 transition-all print:hidden"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Ticket List */}
      <div>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="h-56 rounded-3xl bg-dark-850/60 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          /* Empty Wallet */
          <div className="text-center py-20 px-6 glass-panel rounded-3xl border border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No active passes yet</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              You haven't RSVP'd for any upcoming events. Browse hackathons, music battles, workshops and grab your digital entry tickets.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-glow-hive transition-all"
            >
              <span>Browse Campus Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Passes ({tickets.length})
            </p>
            {tickets.map((ticket) => (
              <TicketPassCard
                key={ticket._id}
                ticket={ticket}
                onPrint={handlePrint}
                onCancel={(id) => setCancelTargetId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-dark-900 rounded-3xl border border-slate-700/80 p-6 max-w-md w-full space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Revoke RSVP & Pass?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Are you sure you want to cancel your registration? Your reserved spot will be released back to other students.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelTargetId(null)}
                className="flex-1 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
              >
                Keep Pass
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isCancelling ? 'Revoking...' : 'Yes, Cancel RSVP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
