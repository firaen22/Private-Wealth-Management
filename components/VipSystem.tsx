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
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-gold-400 transition-all active:scale-95 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-sm font-semibold">Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-gold-500/20 to-transparent border border-gold-500/20">
              <Users className="w-8 h-8 text-gold-400" />
            </div>
            <div>
              <h1 className="text-3xl font-serif text-white tracking-wide">VIP Client System</h1>
              <p className="text-slate-400 text-sm tracking-widest uppercase mt-1">Portfolio & Relationship Management</p>
            </div>
          </div>
          <button className="bg-gold-500 text-slate-900 px-6 py-2 rounded-lg font-bold text-sm hover:bg-gold-400 transition-all active:scale-95">
            + Add New Client
          </button>
        </div>

        <div className="glass-card bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
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
                  className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200 group animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationFillMode: 'both', animationDelay: `${idx * 100}ms` }}
                >
                  <td className="p-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gold-500 font-serif mr-4 border border-white/10">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{client.name}</p>
                        <div className="flex space-x-2 text-slate-500 mt-1">
                          <Mail className="w-3 h-3 hover:text-gold-400 cursor-pointer" />
                          <Phone className="w-3 h-3 hover:text-gold-400 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`flex items-center text-sm ${client.tier === 'Diamond' ? 'text-cyan-300' : client.tier === 'Gold' ? 'text-gold-400' : 'text-slate-300'}`}>
                      <Gem className="w-3 h-3 mr-2" />
                      {client.tier}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-white font-mono">{client.assets}</span>
                  </td>
                  <td className="p-6">
                    <span className={`text-xs px-2 py-1 rounded-full border ${client.status === 'Active' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                        client.status === 'Review' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                          'border-blue-500/30 text-blue-400 bg-blue-500/10'
                      }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
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