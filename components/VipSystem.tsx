import React from 'react';
import { ArrowLeft, Users, Gem, Phone, Mail, MoreHorizontal, ChevronRight } from 'lucide-react';

interface VipSystemProps {
  onBack: () => void;
}

const VipSystem: React.FC<VipSystemProps> = ({ onBack }) => {
  const clients = [
    { name: 'Sarah Montgomery', tier: 'Diamond', assets: '$45,000,000', status: 'Active', color: 'text-cyan-400' },
    { name: 'James Sterling', tier: 'Platinum', assets: '$12,500,000', status: 'Review', color: 'text-slate-300' },
    { name: 'Wei Zhang', tier: 'Diamond', assets: '$88,200,000', status: 'Active', color: 'text-cyan-400' },
    { name: 'Elena Petrova', tier: 'Gold', assets: '$5,400,000', status: 'Active', color: 'text-gold-400' },
    { name: 'Robert Fox', tier: 'Platinum', assets: '$18,100,000', status: 'Meeting', color: 'text-slate-300' },
  ];

  return (
    <div className="min-h-screen bg-black text-slate-200 p-6 md:p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none color-dodge">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full pulse-glow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full pulse-glow" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center text-cyan-400 hover:text-white hover:text-glow-accent transition-all active:scale-95 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]" />
          <span className="uppercase tracking-widest text-sm font-semibold">Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-transparent border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,204,0.2)]">
              <Users className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]" />
            </div>
            <div>
              <h1 className="text-3xl font-serif text-white tracking-wide text-glow">VIP Client System</h1>
              <p className="text-cyan-200/70 text-sm tracking-widest uppercase mt-1">Portfolio & Relationship Management</p>
            </div>
          </div>
          <button className="neon-button px-6 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase">
            + Add New Client
          </button>
        </div>

        <div className="glass-light-panel rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <th className="p-6 font-medium">Client Name</th>
                <th className="p-6 font-medium">Tier Status</th>
                <th className="p-6 font-medium">Total AUM</th>
                <th className="p-6 font-medium">Status</th>
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, idx) => (
                <tr
                  key={idx}
                  className="border-b border-white/5 hover:bg-cyan-900/20 hover:shadow-[inset_0_0_20px_rgba(0,255,204,0.05)] transition-all duration-300 group animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationFillMode: 'both', animationDelay: `${idx * 100}ms` }}
                >
                  <td className="p-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-cyan-400 font-serif mr-4 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,255,204,0.1)] group-hover:shadow-[0_0_15px_rgba(0,255,204,0.3)] transition-all">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium group-hover:text-glow transition-all">{client.name}</p>
                        <div className="flex space-x-2 text-cyan-200/50 mt-1">
                          <Mail className="w-3 h-3 hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(0,255,204,0.8)] transition-all cursor-pointer" />
                          <Phone className="w-3 h-3 hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(0,255,204,0.8)] transition-all cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`flex items-center text-sm ${client.tier === 'Diamond' ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.5)]' : client.tier === 'Gold' ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-slate-300'}`}>
                      <Gem className="w-3 h-3 mr-2" />
                      {client.tier}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-white font-mono group-hover:text-glow transition-all">{client.assets}</span>
                  </td>
                  <td className="p-6">
                    <span className={`text-xs px-2 py-1 rounded-full border ${client.status === 'Active' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                      client.status === 'Review' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                        'border-cyan-500/50 text-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-cyan-200/50 hover:text-cyan-400 transition-colors">
                      <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-white/5 bg-slate-950/30 text-center text-xs text-slate-500 uppercase tracking-widest">
            Showing 5 of 124 High Net Worth Individuals
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipSystem;