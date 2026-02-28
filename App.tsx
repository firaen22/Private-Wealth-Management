import React, { useState, useMemo } from 'react';
import {
  Building2,
  FileText,
  Users,
  ArrowRight,
  LineChart,
  ShieldCheck,
  Globe,
  Ticket,
  Calculator,
  Zap,
  Briefcase,
  Activity,
  Award,
  BarChart3,
  Layers
} from 'lucide-react';
import MortgageCalculator from './components/MortgageCalculator';
import ProposalGenerator from './components/ProposalGenerator';
import VipSystem from './components/VipSystem';
import { calculateProjection, SimulationOutput } from './src/utils/calculations';


type ViewState = 'dashboard' | 'calculator' | 'proposal' | 'vip';


// ...

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  // ... (Real-time calculation state & hook)
  // Real-time calculation state - Default to 0 to avoid AI hallucination
  const [budget, setBudget] = useState(0);
  const [cashReserve, setCashReserve] = useState(0);
  const [bondAlloc, setBondAlloc] = useState(0);
  const [bondYield, setBondYield] = useState(5.5);
  const [hibor, setHibor] = useState(4.15);
  const [spread, setSpread] = useState(1.3);
  const [leverageLTV, setLeverageLTV] = useState(90);
  const [handlingFee, setHandlingFee] = useState(1.0);

  // Property State - Default to 0
  const [propertyValue, setPropertyValue] = useState(0);
  const [mortgageRate, setMortgageRate] = useState(3.5);
  const [mortgageTenure, setMortgageTenure] = useState(25);

  // Real-time calculation hook
  const pfResult: SimulationOutput = useMemo(() => {
    return calculateProjection({
      budget,
      cashReserve,
      bondAlloc,
      bondYield,
      hibor,
      cofRate: 5.0,
      interestBasis: 'hibor',
      spread,
      leverageLTV,
      capRate: 9.0,
      handlingFee,
      fundSource: 'cash', // Simplified default
      unlockedCash: 0,
      effectiveMortgageRate: 0,
      monthlyMortgagePmt: 0,
      mortgageTenor: 30
    });
  }, [budget, cashReserve, bondAlloc, bondYield, hibor, spread, leverageLTV, handlingFee]);

  const renderView = () => {
    switch (currentView) {
      case 'calculator':
        return (
          <MortgageCalculator
            onBack={() => setCurrentView('dashboard')}
            loanAmount={propertyValue}
            setLoanAmount={setPropertyValue}
            interestRate={mortgageRate}
            setInterestRate={setMortgageRate}
            loanTerm={mortgageTenure}
            setLoanTerm={setMortgageTenure}
          />
        );
      case 'proposal':
        return (
          <ProposalGenerator
            onBack={() => setCurrentView('dashboard')}
          />
        );
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

interface DashboardProps {
  onViewChange: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {

  const menuItems = [

    {
      id: 'property',
      label: '物業保值及收息倉方案',
      subLabel: 'Property Appreciation Solution & Funds',
      description: 'Advanced mortgage calculators and fund appreciation projection tools for real estate assets.',
      icon: Building2,
      action: () => window.location.href = 'https://firaen22.github.io/TMP2-mortgage-with-report/',
      iconColor: 'text-white',
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-blue-600',
      shadowColor: 'shadow-cyan-500/20',
      external: true,
      buttonText: 'Access Tool',
      size: 'large' // Spans 2 columns on lg
    },
    {
      id: 'proposal',
      label: '私人財富建議書系統',
      subLabel: 'Proposal Generator',
      description: 'Generate bespoke investment strategies and PDF proposals tailored to client risk profiles.',
      icon: Briefcase,
      action: () => window.location.href = 'https://proposal-genertor-v8.vercel.app/',
      iconColor: 'text-slate-900',
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-500',
      shadowColor: 'shadow-amber-500/20',
      external: true,
      buttonText: 'Generate Now',
      className: 'border-t border-amber-500/20',
      size: 'normal'
    },
    {
      id: 'crs',
      label: '共同匯報標準方案',
      subLabel: 'CRS solutions',
      description: 'Common Reporting Standard compliance tools and automated proposal generation for global entities.',
      icon: Globe,
      action: () => window.location.href = 'https://firaen22.github.io/CRS-proposal-generator/',
      iconColor: 'text-white',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-600',
      shadowColor: 'shadow-emerald-500/20',
      external: true,
      buttonText: 'Access Portal',
      size: 'normal'
    },
    {
      id: 'fund-chart',
      label: '基金圖表構建器',
      subLabel: 'Fund Chart Builder',
      description: 'Visualize fund performance and generate comparison charts for investment analysis.',
      icon: Activity,
      action: () => window.open('https://fund-chart-builder.vercel.app/', '_blank'),
      iconColor: 'text-white',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-indigo-600',
      shadowColor: 'shadow-purple-500/20',
      external: true,
      buttonText: 'View Charts',
      size: 'large' // Spans 2 columns on lg
    },
    {
      id: 'voucher',
      label: '保費現金券計算機',
      subLabel: 'Premium Voucher Calculator',
      description: 'Calculate premium vouchers and optimize payment strategies for insurance plans.',
      icon: Award,
      action: () => window.open('https://firaen22.github.io/premium-planner/', '_blank'),
      iconColor: 'text-white',
      gradientFrom: 'from-rose-400',
      gradientTo: 'to-pink-600',
      shadowColor: 'shadow-rose-500/20',
      external: true,
      buttonText: 'Calculate Now',
      size: 'normal'
    },
    {
      id: 'financing',
      label: '保費融資計算機',
      subLabel: 'Premium Financing Calculator',
      description: 'Calculate premium financing details and optimize leverage strategies.',
      icon: Zap,
      action: () => window.open('https://premium-financing-calculator.vercel.app/', '_blank'),
      iconColor: 'text-white',
      gradientFrom: 'from-sky-400',
      gradientTo: 'to-blue-500',
      shadowColor: 'shadow-cyan-500/20',
      external: true,
      buttonText: 'Calculate Now',
      size: 'normal'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-slate-200">
      {/* Background Ambience */}
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none color-dodge">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/15 rounded-full pulse-glow" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center min-h-screen">


        {/* Top Right Portal Access */}
        <div className="absolute top-8 right-8 z-20">
          <button
            onClick={() => window.location.href = 'https://insureflow-lite.vercel.app/'}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-400/20 hover:border-yellow-400 hover:text-white shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] transition-all duration-300 group"
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400 group-hover:bg-white animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]"></div>
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">VIP Portal Login</span>
          </button>
        </div>

        {/* Header Section */}
        <header className="text-center mb-20 animate-fade-in-up relative z-10 flex flex-col items-center">
          {/* Holographic Logo Mark */}
          <div className="relative mb-10 group cursor-default">
            {/* Core Glow */}
            <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full group-hover:bg-cyan-400/40 transition-colors duration-700"></div>
            <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full translate-y-2 group-hover:translate-y-4 transition-transform duration-700 delay-100"></div>

            {/* Holographic Cube Logo (Reference Img Style) */}
            <svg
              className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_20px_rgba(0,180,255,0.4)] transform group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(0,180,255,0.7)] transition-all duration-700"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Cube Top - Cyan/Teal */}
                <linearGradient id="cube-top" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" /> {/* Teal 400 */}
                  <stop offset="100%" stopColor="#0ea5e9" /> {/* Sky 500 */}
                </linearGradient>
                {/* Cube Left - Blueish */}
                <linearGradient id="cube-left" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" /> {/* Sky 600 */}
                  <stop offset="100%" stopColor="#1e3a8a" /> {/* Blue 900 */}
                </linearGradient>
                {/* Cube Right - Darker Blue */}
                <linearGradient id="cube-right" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0369a1" /> {/* Sky 700 */}
                  <stop offset="100%" stopColor="#172554" /> {/* Blue 950 */}
                </linearGradient>
              </defs>

              {/* Background Ambient Hexagon Glow */}
              <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" fill="rgba(0,180,255,0.05)" className="animate-[pulse_3s_ease-in-out_infinite]" />

              {/* Outer Hexagon Outline */}
              <path d="M50 8 L87 29 L87 71 L50 92 L13 71 L13 29 Z" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" className="mix-blend-screen" />

              {/* Dotted Inner Connectors */}
              <path d="M50 8 L50 35 M13 29 L35 45 M87 29 L65 45 M13 71 L35 55 M87 71 L65 55 M50 92 L50 65" stroke="#38bdf8" strokeWidth="1" strokeDasharray="1 3" strokeLinecap="round" className="opacity-50" />

              {/* 3D Core Cube */}
              <g className="drop-shadow-[0_0_15px_rgba(0,150,255,0.6)]">
                {/* Top Face */}
                <path d="M50 35 L68 45 L50 55 L32 45 Z" fill="url(#cube-top)" className="mix-blend-screen opacity-90" />
                {/* Left Face */}
                <path d="M32 45 L50 55 L50 75 L32 65 Z" fill="url(#cube-left)" className="opacity-95" />
                {/* Right Face */}
                <path d="M50 55 L68 45 L68 65 L50 75 Z" fill="url(#cube-right)" className="opacity-95" />
              </g>

              {/* Core Hotspot (The white dot at the top vertex) */}
              <circle cx="50" cy="45" r="2.5" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]" />
              <circle cx="50" cy="45" r="4" fill="#ffffff" fillOpacity="0.3" className="animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-medium text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight text-glow filter drop-shadow-md">
            私人財富管理
          </h1>

          <div className="flex items-center justify-center space-x-6 mt-6 w-full max-w-sm">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-cyan-500/50 to-cyan-400/80"></div>
            <h2 className="text-xs md:text-sm text-cyan-200/90 tracking-[0.4em] font-light uppercase shrink-0 drop-shadow-[0_0_8px_rgba(0,255,204,0.3)]">
              Private Wealth <span className="text-white font-medium">Management</span>
            </h2>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-cyan-500/50 to-cyan-400/80"></div>
          </div>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl auto-rows-[300px]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`group relative text-left p-8 glass-light-panel spotlight-card rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,255,204,0.15)] active:scale-[0.98] flex flex-col justify-between overflow-hidden ${item.size === 'large' ? 'lg:col-span-2' : ''} ${item.className || ''}`}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradientFrom}/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl`}></div>

              {/* Optional: Add a subtle animated grain or mesh to the background of cards */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay rounded-3xl pointer-events-none"></div>

              <div className="relative z-10 mix-blend-screen h-full flex flex-col">
                {/* Advanced Holographic Circular Card Logo */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">

                  {/* Hexagonal/Circular Base Glow */}
                  <div className={`absolute inset-0 bg-gradient-radial ${item.gradientFrom.replace('from-', 'from-').replace(/-\d+/, '-500/50')} to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700`}></div>

                  {/* Outer Tech Ring (Dashed) */}
                  <div className={`absolute inset-[-8px] rounded-full border border-dashed border-${item.gradientFrom.replace('from-', '')}/40 animate-[spin_20s_linear_infinite] group-hover:border-${item.gradientFrom.replace('from-', '')}/80 transition-colors duration-500`}></div>

                  {/* Inner Tech Ring (Solid) */}
                  <div className={`absolute inset-1 rounded-full border border-${item.gradientTo.replace('to-', '')}/30 animate-[spin_15s_linear_infinite_reverse] group-hover:border-${item.gradientTo.replace('to-', '')}/60 transition-colors duration-500`}></div>

                  {/* Core Circular Orb */}
                  <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-tr ${item.gradientFrom} ${item.gradientTo} flex items-center justify-center shadow-[inset_0_-4px_10px_rgba(0,0,0,0.5),inset_0_4px_10px_rgba(255,255,255,0.6),0_0_20px_${item.shadowColor.replace('shadow-', '').replace('/20', '')}/60] group-hover:shadow-[inset_0_-4px_10px_rgba(0,0,0,0.6),inset_0_4px_15px_rgba(255,255,255,0.8),0_0_35px_${item.shadowColor.replace('shadow-', '').replace('/20', '')}/90] transition-all duration-500`}>

                    {/* Pulsing Core Hotspot */}
                    <div className="absolute inset-2 bg-white/20 rounded-full blur-[2px] animate-[pulse_2s_ease-in-out_infinite]"></div>

                    {/* The Icon Itself */}
                    <item.icon className="relative z-10 w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-300" />
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className={`font-serif text-white mb-2 whitespace-nowrap text-glow ${item.size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{item.label}</h3>
                  <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-widest uppercase mb-3 leading-relaxed group-hover:text-cyan-200 transition-colors">
                    {item.subLabel}
                  </p>
                  <p className={`text-sm text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 group-hover:text-slate-200 ${item.size === 'large' ? 'max-w-md' : ''}`}>
                    {item.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-end text-cyan-400 group-hover:text-white group-hover:text-glow-accent text-xs font-semibold tracking-wider uppercase transition-all duration-300">
                  <span className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">{item.buttonText || 'Enter'}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Indicators */}
        <div className="mt-20 flex space-x-12 text-slate-500 text-xs tracking-widest uppercase z-10">
          <div className="flex items-center group cursor-default">
            <ShieldCheck className="w-4 h-4 mr-2 text-cyan-500 group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(0,255,204,0.5)]" />
            <span className="group-hover:text-slate-300 transition-colors">Bank Grade Security</span>
          </div>
          <div className="flex items-center group cursor-default">
            <LineChart className="w-4 h-4 mr-2 text-cyan-500 group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(0,255,204,0.5)]" />
            <span className="group-hover:text-slate-300 transition-colors">Real-time Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;