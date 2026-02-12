import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, User, Bot, Loader, Brain, LayoutDashboard, PieChart, TrendingUp, AlertTriangle, Settings, Check, Infinity } from 'lucide-react';

interface AgiPortfolioManagerProps {
    portfolioData: any;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
}

const AgiPortfolioManager: React.FC<AgiPortfolioManagerProps> = ({ portfolioData }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            content: '我是你的 AGI 私人財富管理顧問。我已準備好分析你的資產組合，並提供針對性的優化建議。請告訴我你想了解什麼？',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userApiKey, setUserApiKey] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Determine effective API Key
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const effectiveApiKey = userApiKey || envApiKey;

    const generatePrompt = (userQuery: string, data: any) => {
        // System Instruction & Persona
        const systemInstruction = `
    你是一個資深的 AGI 財富管理專家，負責為高淨值客戶提供 Total Solution。
    你需要綜合分析客戶目前的物業貸款狀況、保費融資槓桿、以及資產配置比例。
    請根據傳入的 JSON 數據提供具體的、跨產品的優化建議，例如：是否應該透過加按物業來增加保費融資的投入以對沖利率風險。
    
    Current Portfolio Data:
    ${JSON.stringify(data, null, 2)}
    `;

        return `${systemInstruction}\n\nUser Query: ${userQuery}`;
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        if (!effectiveApiKey) {
            setShowSettings(true);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: 'model',
                    content: 'Error: API Key is missing. Please enter your Google Gemini API Key in the settings.',
                    timestamp: new Date()
                }
            ]);
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(effectiveApiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = generatePrompt(input, portfolioData);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    content: text,
                    timestamp: new Date()
                }
            ]);
        } catch (error) {
            console.error('Error generating response:', error);
            let errorMessage = '抱歉，分析過程中發生錯誤。請稍後再試。';
            if (error instanceof Error && error.message.includes('API key')) {
                errorMessage = 'API Key 無效或已過期，請檢查設定。';
                setShowSettings(true);
            }

            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    content: errorMessage,
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
            {/* Left: Chat Interface (Main) */}
            <div className="flex-1 flex flex-col border-r border-slate-800">
                {/* Header */}
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md">
                    <div className="flex items-center">
                        <Infinity className="w-6 h-6 text-purple-500 mr-3" />
                        <div>
                            <h1 className="text-lg font-serif font-medium text-white">AGI Portfolio Manager</h1>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">AI Private Wealth Consultant</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-slate-800 text-slate-400'}`}
                        title="API Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </header>

                {/* API Key Settings Panel */}
                {showSettings && (
                    <div className="bg-slate-900/80 border-b border-slate-800 p-4 animate-in slide-in-from-top-2">
                        <div className="max-w-3xl mx-auto flex items-end space-x-4">
                            <div className="flex-1">
                                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Custom Gemini API Key</label>
                                <input
                                    type="password"
                                    value={userApiKey}
                                    onChange={(e) => setUserApiKey(e.target.value)}
                                    placeholder={envApiKey ? "Using env key (override here)" : "Enter your API Key here"}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors flex items-center"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Save
                            </button>
                        </div>
                        <div className="max-w-3xl mx-auto mt-2">
                            <span className="text-xs text-slate-500">
                                {envApiKey ? "Default: Process Env" : "No default key found"}
                            </span>
                        </div>
                    </div>
                )}

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 mx-2 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-purple-600'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Infinity className="w-4 h-4 text-white" />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-slate-800 text-white rounded-tr-none'
                                    : 'bg-purple-900/20 border border-purple-500/30 text-slate-200 rounded-tl-none'
                                    }`}>
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {msg.content}
                                    </div>
                                    <div className="text-[10px] opacity-50 mt-2 text-right">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[80%] flex-row">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mt-1 mx-2">
                                    <Infinity className="w-4 h-4 text-white" />
                                </div>
                                <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/30 text-slate-200 rounded-tl-none flex items-center">
                                    <Loader className="w-4 h-4 animate-spin mr-2 text-purple-400" />
                                    <span className="text-sm text-purple-300">Analyzing portfolio data...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask for portfolio advice..."
                            className="w-full bg-slate-800/50 text-white pl-4 pr-12 py-3 rounded-xl border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none min-h-[50px] max-h-[150px]"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 bottom-2 p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    {!effectiveApiKey && (
                        <p className="text-xs text-red-400 mt-2 flex items-center cursor-pointer hover:underline" onClick={() => setShowSettings(true)}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            API Key missing. Click to configure.
                        </p>
                    )}
                </div>
            </div>

            {/* Right: Global Asset Overview (Sidebar) */}
            <div className="w-[400px] bg-slate-900/50 border-l border-slate-800 flex flex-col hidden lg:flex">
                <header className="h-16 border-b border-slate-800 flex items-center px-6">
                    <LayoutDashboard className="w-5 h-5 text-gold-500 mr-2" />
                    <h2 className="text-sm font-serif font-medium text-white tracking-wide">Global Asset Overview</h2>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Portfolio Summary Card */}
                    <div className="bg-slate-800/40 rounded-xl p-5 mb-6 border border-slate-700">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                            <PieChart className="w-4 h-4 mr-2 text-blue-400" />
                            Asset Allocation
                        </h3>
                        {Object.keys(portfolioData).length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                No portfolio data available yet.
                                <br />
                                Use calculators to populate data.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* Placeholder for actual data visualization */}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-300">Total Assets</span>
                                    <span className="text-white font-medium font-mono">$0</span>
                                </div>
                                {/* Detailed breakdown would go here */}
                                <pre className="text-xs text-slate-500 overflow-x-auto bg-slate-950 p-2 rounded mt-2">
                                    {JSON.stringify(portfolioData, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Key Insights / Quick Stats */}
                    <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" />
                            Performance Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                <div className="text-xs text-slate-500 mb-1">Leverage Ratio</div>
                                <div className="text-lg font-mono text-white">--</div>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                <div className="text-xs text-slate-500 mb-1">Net Yield</div>
                                <div className="text-lg font-mono text-emerald-400">--</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgiPortfolioManager;
