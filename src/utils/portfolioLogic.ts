// src/utils/portfolioLogic.ts

// 定義風險等級
export type RiskLevel = 'Low' | 'Medium' | 'High';

// 定義資產結構
export interface AssetAllocation {
    id: string;
    name: string;
    type: 'Equity' | 'Bond' | 'Cash' | 'Alternative';
    percentage: number; // 0-100
    description?: string;
}

// 這是從 proposal-genertor-v8 移植過來的核心配置邏輯
// 如果你有更詳細的 constants.ts，請將具體的基金名稱和比例貼在這裡
export const PORTFOLIO_STRATEGIES: Record<RiskLevel, AssetAllocation[]> = {
    Low: [
        { id: 'bnd_gov', name: 'Global Govt Bond', type: 'Bond', percentage: 60, description: 'High grade government bonds' },
        { id: 'bnd_corp', name: 'Inv Grade Corp Bond', type: 'Bond', percentage: 30, description: 'Stable corporate income' },
        { id: 'cash', name: 'Cash Reserves', type: 'Cash', percentage: 10, description: 'Liquidity buffer' },
    ],
    Medium: [
        { id: 'eq_global', name: 'Global Equities', type: 'Equity', percentage: 40, description: 'Blue chip global stocks' },
        { id: 'bnd_mix', name: 'Diversified Bonds', type: 'Bond', percentage: 40, description: 'Mix of gov and corp bonds' },
        { id: 'alt_reit', name: 'REITs', type: 'Alternative', percentage: 10, description: 'Real estate income' },
        { id: 'cash', name: 'Cash', type: 'Cash', percentage: 10, description: 'Buffer' },
    ],
    High: [
        { id: 'eq_growth', name: 'Growth Equities', type: 'Equity', percentage: 60, description: 'Tech and growth sectors' },
        { id: 'eq_em', name: 'Emerging Markets', type: 'Equity', percentage: 20, description: 'High growth potential' },
        { id: 'alt_crypto', name: 'Alternatives/Crypto', type: 'Alternative', percentage: 15, description: 'High risk high reward' },
        { id: 'cash', name: 'Cash', type: 'Cash', percentage: 5, description: 'Minimal buffer' },
    ]
};

// 輔助函數：根據風險等級獲取配置
export const getPortfolioByRisk = (risk: RiskLevel) => {
    return PORTFOLIO_STRATEGIES[risk];
};
