import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, User, Bot, Loader, Brain, LayoutDashboard, PieChart, TrendingUp, AlertTriangle, Settings, Check, Infinity, XCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ModelStatus {
    id: string;
    status: 'pending' | 'loading' | 'valid' | 'invalid';
    error?: string;
}

const CHECKABLE_MODELS = [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-exp-1206',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
];

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
    const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
    const [customModelId, setCustomModelId] = useState('');

    // Verification State
    const [isVerifying, setIsVerifying] = useState(false);
    const [modelStatuses, setModelStatuses] = useState<ModelStatus[]>(
        CHECKABLE_MODELS.map(id => ({ id, status: 'pending' }))
    );

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
        // Safe access to data properties
        const finalEquity = data.finalNetEquity ? Math.round(data.finalNetEquity).toLocaleString() : 'N/A';
        const roi = data.roi ? data.roi.toFixed(2) + '%' : 'N/A';

        // System Instruction & Persona
        const systemInstruction = `
    你是一個資深的 AGI 財富管理專家，負責為高淨值客戶提供 Total Solution。
    
    Current Portfolio Simulation Results:
    - Final Net Equity (Year 30): ${finalEquity}
    - Total ROI: ${roi}
    - Monthly Net Cashflow: ${data.monthlyNetCashflow ? Math.round(data.monthlyNetCashflow).toLocaleString() : 'N/A'}
    
    你需要綜合分析客戶目前的物業貸款狀況、保費融資槓桿、以及資產配置比例。
    請根據傳入的 JSON 數據提供具體的、跨產品的優化建議，例如：是否應該透過加按物業來增加保費融資的投入以對沖利率風險。
    
    Detailed Projection Data (First 5 Years & Year 30):
    ${JSON.stringify(data.projectionData ? [...data.projectionData.slice(0, 5), data.projectionData[30]] : data, null, 2)}
    `;

        return `${systemInstruction}\n\nUser Query: ${userQuery}`;
    };

    const handleVerifyKeys = async () => {
        if (!effectiveApiKey) return;

        setIsVerifying(true);
        const genAI = new GoogleGenerativeAI(effectiveApiKey);

        const newStatuses: ModelStatus[] = CHECKABLE_MODELS.map(id => ({ id, status: 'loading' }));
        setModelStatuses([...newStatuses]);

        // Process sequentially to avoid rate limits on free tier
        for (let i = 0; i < CHECKABLE_MODELS.length; i++) {
            const modelId = CHECKABLE_MODELS[i];
            try {
                const model = genAI.getGenerativeModel({ model: modelId });
                // Minimal token request to verify access
                await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: 'Test' }] }],
                    generationConfig: { maxOutputTokens: 1 }
                });

                newStatuses[i] = { id: modelId, status: 'valid' };
            } catch (error: any) {
                let errorMsg = 'Unknown Error';
                if (error.message?.includes('404')) errorMsg = 'Not Found (404)';
                else if (error.message?.includes('403')) errorMsg = 'Forbidden (403)';
                else if (error.message?.includes('429')) errorMsg = 'Quota Exceeded (429)';
                else errorMsg = 'Failed';

                newStatuses[i] = { id: modelId, status: 'invalid', error: errorMsg };
            }
            // Update state incrementally
            setModelStatuses([...newStatuses]);
        }
        setIsVerifying(false);
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
            const modelName = selectedModel === 'custom' ? customModelId : selectedModel;
            const model = genAI.getGenerativeModel({ model: modelName });
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
                            <div className="w-1/3">
                                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">AI Model</label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none appearance-none"
                                >
                                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                    <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</option>
                                    <option value="gemini-exp-1206">Gemini Exp 1206</option>
                                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                    <option value="custom">Custom Model ID...</option>
                                </select>
                            </div>
                            {selectedModel === 'custom' && (
                                <div className="w-1/3 animate-in slide-in-from-left-2">
                                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Model ID</label>
                                    <input
                                        type="text"
                                        value={customModelId}
                                        onChange={(e) => setCustomModelId(e.target.value)}
                                        placeholder="e.g. gemini-1.5-pro-latest"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            )}
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors flex items-center"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Save
                            </button>
                        </div>

                        {/* Verification Section */}
                        <div className="max-w-3xl mx-auto mt-6 pt-4 border-t border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center">
                                    <ShieldCheck className="w-4 h-4 mr-2 text-slate-500" />
                                    Model Access Verification
                                </h3>
                                <button
                                    onClick={handleVerifyKeys}
                                    disabled={isVerifying || !effectiveApiKey}
                                    className="text-xs bg-slate-800 hover:bg-slate-700 text-purple-400 px-3 py-1 rounded transition-colors disabled:opacity-50"
                                >
                                    {isVerifying ? 'Verifying...' : 'Check Access Now'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {modelStatuses.map((status) => (
                                    <div key={status.id} className="bg-slate-950/50 p-2 rounded border border-slate-800 flex items-center justify-between">
                                        <span className="text-xs text-slate-300 font-mono">{status.id}</span>
                                        <div className="flex items-center">
                                            {status.status === 'loading' && <Loader className="w-3 h-3 animate-spin text-blue-400" />}
                                            {status.status === 'valid' && (
                                                <div className="flex items-center text-emerald-400">
                                                    <span className="text-[10px] mr-1">Active</span>
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                            )}
                                            {status.status === 'invalid' && (
                                                <div className="flex items-center text-red-400" title={status.error}>
                                                    <span className="text-[10px] mr-1">{status.error}</span>
                                                    <XCircle className="w-3 h-3" />
                                                </div>
                                            )}
                                            {status.status === 'pending' && <span className="text-[10px] text-slate-600">-</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
