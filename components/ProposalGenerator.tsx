import React, { useState, useRef } from 'react';
import { ArrowLeft, FileText, Send, User, Shield, TrendingUp, CheckCircle, Loader2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { RiskLevel } from '../src/utils/portfolioLogic';

interface ProposalGeneratorProps {
  onBack: () => void;
  initialValues?: {
    riskLevel: RiskLevel;
    budget: number;
    description?: string;
  } | null;
}

const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({ onBack, initialValues }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    risk: 'Balanced',
    amount: '',
    goals: ''
  });

  // Map AI RiskLevel to Form Risk
  const mapRiskLevel = (level: RiskLevel): string => {
    switch (level) {
      case 'Low': return 'Conservative';
      case 'Medium': return 'Balanced';
      case 'High': return 'Aggressive';
      default: return 'Balanced';
    }
  };

  // Auto-populate form when initialValues change
  React.useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        risk: mapRiskLevel(initialValues.riskLevel),
        amount: initialValues.budget.toString(),
        goals: initialValues.description || prev.goals
      }));
    }
  }, [initialValues]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API delay
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617' // Match bg-slate-950
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Proposal_${formData.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-gold-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-sm font-semibold">Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-4 mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-gold-500/20 to-transparent border border-gold-500/20">
            <FileText className="w-8 h-8 text-gold-400" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-white tracking-wide">Proposal Generator</h1>
            <p className="text-slate-400 text-sm tracking-widest uppercase mt-1">AI-Powered Wealth Strategy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Side */}
          <div className="md:col-span-1 glass-card bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-fit">
            <h3 className="text-lg font-serif text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-gold-500" />
              Client Profile
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Client Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Investment Amount (USD)</label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Risk Appetite</label>
                <select
                  value={formData.risk}
                  onChange={e => setFormData({ ...formData, risk: e.target.value })}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500/50 focus:outline-none"
                >
                  <option>Conservative</option>
                  <option>Balanced</option>
                  <option>Aggressive</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-4 bg-gradient-to-r from-gold-600 to-gold-500 text-slate-950 font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] active:scale-[0.98] hover:-translate-y-0.5 transition-all flex justify-center items-center"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'GENERATE PROPOSAL'}
              </button>
            </div>
          </div>

          {/* Preview Side */}
          <div className="md:col-span-2 space-y-6">
            {!generated && !isGenerating && (
              <div className="h-full min-h-[400px] glass-card bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-500 border-dashed border-2 border-slate-800">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Fill in client details to generate a strategy</p>
              </div>
            )}

            {isGenerating && (
              <div className="h-full min-h-[400px] glass-card bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center justify-center text-gold-500 animate-in fade-in duration-500">
                <Loader2 className="w-16 h-16 mb-6 animate-spin" />
                <p className="font-serif text-xl animate-pulse duration-1000">Analyzing Market Data...</p>
                <p className="text-slate-500 text-sm mt-2 animate-pulse duration-1000 delay-150">Constructing portfolio allocation</p>
              </div>
            )}

            {generated && !isGenerating && (
              <div className="animate-fade-in space-y-6">
                <div ref={reportRef} className="glass-card bg-slate-900/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FileText className="w-32 h-32 text-white" />
                  </div>

                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-serif text-white mb-1">Wealth Management Strategy</h2>
                      <p className="text-gold-500 text-sm tracking-widest uppercase">Prepared for {formData.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase">Date</p>
                      <p className="text-white">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-950/30 p-4 rounded-lg border border-white/5">
                      <div className="flex items-center mb-2">
                        <Shield className="w-4 h-4 text-gold-500 mr-2" />
                        <span className="text-xs text-slate-300 uppercase">Allocation Strategy</span>
                      </div>
                      <p className="text-white">Multi-Asset Global Diversification</p>
                    </div>
                    <div className="bg-slate-950/30 p-4 rounded-lg border border-white/5">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-4 h-4 text-gold-500 mr-2" />
                        <span className="text-xs text-slate-300 uppercase">Est. Annual Yield</span>
                      </div>
                      <p className="text-white text-lg font-serif">7.5% - 9.2%</p>
                    </div>
                  </div>

                  <h4 className="text-white font-serif mb-4 border-b border-white/10 pb-2">Recommended Portfolio</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm p-3 bg-white/5 rounded hover:bg-white/10 transition-colors">
                      <span className="text-slate-200">Global Tech Equity Fund</span>
                      <span className="text-gold-400 font-mono">40%</span>
                    </li>
                    <li className="flex justify-between items-center text-sm p-3 bg-white/5 rounded hover:bg-white/10 transition-colors">
                      <span className="text-slate-200">US Treasury Bonds (10Y)</span>
                      <span className="text-gold-400 font-mono">30%</span>
                    </li>
                    <li className="flex justify-between items-center text-sm p-3 bg-white/5 rounded hover:bg-white/10 transition-colors">
                      <span className="text-slate-200">Emerging Markets ETF</span>
                      <span className="text-gold-400 font-mono">20%</span>
                    </li>
                    <li className="flex justify-between items-center text-sm p-3 bg-white/5 rounded hover:bg-white/10 transition-colors">
                      <span className="text-slate-200">Gold & Commodities</span>
                      <span className="text-gold-400 font-mono">10%</span>
                    </li>
                  </ul>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="flex items-center px-6 py-2 bg-white text-slate-900 rounded-full font-semibold text-sm hover:bg-slate-200 active:scale-[0.98] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                      {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                      {isExporting ? 'Exporting...' : 'Export PDF'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;
