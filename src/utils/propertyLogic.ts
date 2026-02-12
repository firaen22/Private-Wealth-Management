// src/utils/propertyLogic.ts

// 定義模擬輸入
export interface PropertySimulationInput {
    propertyValue: number;
    mortgageLTV: number;
    mortgageRate: number;
    mortgageTenure: number;
    ownCash: number;
    reserveCashPercent: number;
    allocationIncome: number; // 分配到收息倉的比例
    incomeYield: number;      // 收息倉收益率
    hedgeYield: number;       // 對沖倉收益率
}

// 核心計算函數 (從 tmp2-mortgage 移植)
export const calculatePropertyStrategy = (input: PropertySimulationInput) => {
    const {
        propertyValue, mortgageLTV, mortgageRate, mortgageTenure,
        ownCash, reserveCashPercent, allocationIncome, incomeYield, hedgeYield
    } = input;

    // 1. 按揭基礎計算
    const loanAmount = propertyValue * (mortgageLTV / 100);
    const monthlyRate = (mortgageRate / 100) / 12;
    const numPayments = mortgageTenure * 12;

    let monthlyMortgage = 0;
    if (loanAmount > 0 && numPayments > 0) {
        monthlyMortgage = monthlyRate > 0
            ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
            : loanAmount / numPayments;
    }

    // 2. 投資分配
    const totalCapital = loanAmount + ownCash;
    const reserveCash = totalCapital * (reserveCashPercent / 100);
    const investedAmount = totalCapital - reserveCash;

    const initialIncomeAV = investedAmount * (allocationIncome / 100);
    const monthlyDividend = (initialIncomeAV * (incomeYield / 100)) / 12;

    // 3. 淨現金流 (每月的被動收入 - 按揭供款)
    const netMonthlyCashFlow = monthlyDividend - monthlyMortgage;

    return {
        loanAmount,
        investedAmount,
        reserveCash,
        monthlyMortgage,
        monthlyDividend,
        netMonthlyCashFlow,
        unlockedCapital: loanAmount // 套現金額
    };
};
