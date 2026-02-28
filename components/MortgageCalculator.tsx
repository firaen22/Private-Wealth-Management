import React, { useState } from 'react';
import { ArrowLeft, Calculator, DollarSign, Percent, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MortgageCalculatorProps {
  onBack: () => void;
  loanAmount: number;
  setLoanAmount: (val: number) => void;
  interestRate: number;
  setInterestRate: (val: number) => void;
  loanTerm: number;
  setLoanTerm: (val: number) => void;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  onBack,
  loanAmount,
  setLoanAmount,
  interestRate,
  setInterestRate,
  loanTerm,
  setLoanTerm
}) => {
  // Local state removed, using props now

  const calculateMortgage = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthly: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      total: isNaN(totalPayment) ? 0 : totalPayment,
      interest: isNaN(totalInterest) ? 0 : totalInterest,
    };
  };

  const results = calculateMortgage();

  const data = [
    { name: 'Loan Principal', value: loanAmount },
    { name: 'Total Interest', value: results.interest },
  ];

  const COLORS = ['#94a3b8', '#eab308']; // Slate-400, Gold-500

  return (
    <div className="min-h-screen bg-black text-slate-200 p-6 md:p-12 animate-fade-in relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none color-dodge">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full pulse-glow" style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
      </div>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="relative z-10 flex items-center text-cyan-400 hover:text-white hover:text-glow-accent transition-all active:scale-95 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]" />
          <span className="uppercase tracking-widest text-sm font-semibold">Back to Dashboard</span>
        </button>

        <div className="relative z-10 flex items-center space-x-4 mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-transparent border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,204,0.2)]">
            <Calculator className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-white tracking-wide text-glow">Property Appreciation Solution</h1>
            <p className="text-cyan-200/70 text-sm tracking-widest uppercase mt-1">Investment & Mortgage Analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Input Section */}
          <div
            className="glass-light-panel spotlight-card shadow-2xl p-8 rounded-2xl"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
            }}
          >
            <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4 text-glow">Loan Parameters</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-cyan-200/70 mb-2">Property Value / Loan Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500 drop-shadow-[0_0_5px_rgba(0,255,204,0.5)]" />
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,255,204,0.2)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-cyan-200/70 mb-2">Interest Rate (%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500 drop-shadow-[0_0_5px_rgba(0,255,204,0.5)]" />
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,255,204,0.2)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-cyan-200/70 mb-2">Loan Term (Years)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500 drop-shadow-[0_0_5px_rgba(0,255,204,0.5)]" />
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="1"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]"
                  />
                  <div className="flex justify-between mt-2 text-sm text-cyan-200/50">
                    <span>5 Years</span>
                    <span className="text-cyan-400 font-semibold text-glow-accent">{loanTerm} Years</span>
                    <span>40 Years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div
            className="glass-light-panel spotlight-card shadow-2xl p-8 rounded-2xl flex flex-col justify-between"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
            }}
          >
            <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4 text-glow">Financial Projection</h2>

            <div className="flex-grow flex items-center justify-center min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                <p className="text-cyan-200/70 text-xs uppercase tracking-wider mb-1">Monthly Payment</p>
                <p className="text-2xl font-serif text-cyan-400 text-glow-accent">${results.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                <p className="text-cyan-200/70 text-xs uppercase tracking-wider mb-1">Total Interest</p>
                <p className="text-2xl font-serif text-white text-glow">${results.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;