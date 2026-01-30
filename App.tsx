import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Users,
  ArrowRight,
  LineChart,
  ShieldCheck,
  ChevronRight,
  Globe
} from 'lucide-react';
import MortgageCalculator from './components/MortgageCalculator';
import ProposalGenerator from './components/ProposalGenerator';
import VipSystem from './components/VipSystem';

type ViewState = 'dashboard' | 'calculator' | 'proposal' | 'vip';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'calculator':
        return <MortgageCalculator onBack={() => setCurrentView('dashboard')} />;
      case 'proposal':
        return <ProposalGenerator onBack={() => setCurrentView('dashboard')} />;
      case 'vip':
        return <VipSystem onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="antialiased text-slate-200">
      {renderView()}
    </div>
  );
};

// Dashboard Component extracted for cleaner structure within App.tsx if preferred, 
// or could be a separate file. Keeping it here for single-file focus on App logic + Dashboard.
interface DashboardProps {
  onViewChange: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center min-h-screen">

        {/* Top Right Portal Access */}
        <div className="absolute top-8 right-8 z-20">
          <button
            onClick={() => onViewChange('vip')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full border border-gold-500/30 bg-gold-500/5 hover:bg-gold-500/10 transition-all group backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></div>
            <Users className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 group-hover:text-gold-300 transition-colors">VIP Portal Login</span>
          </button>
        </div>

        {/* Header Section */}
        <header className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-serif font-medium text-white mb-2 tracking-tight">
            私人財富管理
          </h1>
          <h2 className="text-sm md:text-lg text-slate-400 tracking-[0.3em] font-light uppercase border-t border-slate-800 pt-4 mt-4 inline-block">
            Private Wealth Management
          </h2>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">

          {/* Card 1: Property */}
          <button
            onClick={() => window.location.href = 'https://firaen22.github.io/TMP2-mortgage-with-report/'}
            className="group relative h-[400px] text-left p-8 glass-card rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2 whitespace-nowrap">物業保值及收息倉方案</h3>
              <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mb-4 leading-relaxed">
                Property Appreciation<br />Solution & Funds
              </p>
              <p className="text-sm text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                Advanced mortgage calculators and fund appreciation projection tools for real estate assets.
              </p>
            </div>

            <div className="relative z-10 flex items-center text-gold-400 text-sm font-semibold tracking-wider uppercase">
              <span>Access Tool</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          {/* Card 2: Proposal */}
          <button
            onClick={() => window.location.href = 'https://firaen22.github.io/proposal-genertor-v8/'}
            className="group relative h-[400px] text-left p-8 glass-card rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between border-t border-gold-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-6 shadow-lg shadow-gold-500/20 group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2 whitespace-nowrap">私人財富建議書系統</h3>
              <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mb-4 leading-relaxed">
                Proposal Generator
              </p>
              <p className="text-sm text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                Generate bespoke investment strategies and PDF proposals tailored to client risk profiles.
              </p>
            </div>

            <div className="relative z-10 flex items-center text-gold-400 text-sm font-semibold tracking-wider uppercase">
              <span>Generate Now</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          {/* Card 4: CRS */}
          <button
            onClick={() => window.location.href = 'https://firaen22.github.io/CRS-proposal-generator/'}
            className="group relative h-[400px] text-left p-8 glass-card rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2 whitespace-nowrap">共同匯報標準方案</h3>
              <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mb-4 leading-relaxed">
                CRS solutions
              </p>
              <p className="text-sm text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                Common Reporting Standard compliance tools and automated proposal generation for global entities.
              </p>
            </div>

            <div className="relative z-10 flex items-center text-gold-400 text-sm font-semibold tracking-wider uppercase">
              <span>Access Portal</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

        </div>

        {/* Footer Indicators */}
        <div className="mt-20 flex space-x-12 text-slate-500 text-xs tracking-widest uppercase">
          <div className="flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-gold-500" />
            Bank Grade Security
          </div>
          <div className="flex items-center">
            <LineChart className="w-4 h-4 mr-2 text-gold-500" />
            Real-time Analytics
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;