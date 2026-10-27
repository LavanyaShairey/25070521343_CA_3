import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Users,
  Trophy,
  Zap,
  Activity,
  Database,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { eventService, systemService } from '../services/api';

const CampusBuzz = () => {
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, healthRes] = await Promise.all([
          eventService.getStatsSummary().catch(() => ({ stats: null })),
          systemService.checkHealth().catch(() => null),
        ]);

        if (statsRes && statsRes.stats) {
          setStats(statsRes.stats);
        }
        if (healthRes) {
          setSystemHealth(healthRes);
        }
      } catch (err) {
        console.error('Failed to load buzz stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const departmentLeaderboard = [
    { name: 'Computer Science & Engineering', participants: 480, score: 94 },
    { name: 'Information Technology', participants: 320, score: 86 },
    { name: 'Electronics & Communication', participants: 245, score: 79 },
    { name: 'Mechanical Engineering & Robotics', participants: 190, score: 72 },
    { name: 'Business & Management Studies', participants: 140, score: 65 },
    { name: 'Design & Media Arts', participants: 110, score: 58 },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-dark-950 via-dark-900 to-dark-850">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>CAMPUS PULSE & ANALYTICS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          EventHive Real-Time Campus Buzz
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Live event participation telemetry, department engagement leaderboards, category distributions, and MongoDB database health.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-card border border-slate-800 bg-dark-850/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Events</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">
            {stats?.totalEvents ?? 7}
          </p>
          <p className="text-xs text-amber-400 font-semibold mt-1">Across 8 Categories</p>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-slate-800 bg-dark-850/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total RSVPs</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">
            {stats?.totalRegistrations ?? 1420}
          </p>
          <p className="text-xs text-indigo-300 font-semibold mt-1">Confirmed Digital Passes</p>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-slate-800 bg-dark-850/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Clubs</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">
            {stats?.activeClubs ?? 7}
          </p>
          <p className="text-xs text-emerald-300 font-semibold mt-1">Societies & Chapters</p>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-slate-800 bg-dark-850/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Prize Pool</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">₹6,45,000</p>
          <p className="text-xs text-rose-400 font-semibold mt-1">+ Internships & Gear</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Leaderboard */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Department Engagement Leaderboard</span>
            </h3>
            <span className="text-xs text-amber-300 font-bold">Fall 2026</span>
          </div>

          <div className="space-y-3">
            {departmentLeaderboard.map((dept, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-dark-900 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950 shadow-glow-hive'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-950'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-dark-800 text-slate-400'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{dept.name}</p>
                    <p className="text-[11px] text-slate-400">{dept.participants} active attendees</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-400">{dept.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MongoDB Status & System Telemetry */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>MongoDB Storage & API Telemetry</span>
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Database Engine:</span>
                <span className="font-semibold text-white">MongoDB Community Server</span>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Database Name:</span>
                <span className="font-mono font-bold text-amber-400">eventhive</span>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Compass Connection URI:</span>
                <span className="font-mono text-emerald-300 truncate ml-2">
                  mongodb://127.0.0.1:27017/eventhive
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Backend API URL:</span>
                <span className="font-mono text-indigo-300">http://localhost:5000/api</span>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">System Uptime:</span>
                <span className="text-slate-200">{systemHealth?.uptime || 'Active'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300">
            <p className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compass Compatibility</span>
            </p>
            Open <strong>MongoDB Compass</strong>, paste <code className="bg-dark-950 px-1.5 py-0.5 rounded text-amber-300">mongodb://127.0.0.1:27017</code>, and inspect the collections: <code className="text-white">users</code>, <code className="text-white">events</code>, and <code className="text-white">registrations</code> in real time!
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusBuzz;
