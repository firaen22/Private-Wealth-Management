// src/utils/calculations.ts

export const BASE_FACTORS: { [key: number]: number } = {
    0: 0.8000, 1: 0.8000, 2: 0.8211, 3: 0.8442, 4: 0.8734, 5: 1.0066,
    6: 1.0838, 7: 1.1862, 8: 1.2407, 9: 1.2992, 10: 1.3879,
    11: 1.4427, 12: 1.5056, 13: 1.5886, 14: 1.6558, 15: 1.7472,
    16: 1.8367, 17: 1.9223, 18: 2.0262, 19: 2.1262, 20: 2.2469,
    21: 2.3459, 22: 2.4530, 23: 2.5764, 24: 2.7080, 25: 2.8379,
    26: 2.9755, 27: 3.1255, 28: 3.2799, 29: 3.4488, 30: 3.6222
};

export const generateGuaranteed = (factors: { [key: number]: number }) => {
    const guaranteed: { [key: number]: number } = {};
    Object.keys(factors).forEach(key => {
        const k = Number(key);
        guaranteed[k] = factors[k] * (0.85 - (k * 0.005));
    });
    return guaranteed;
};

export const GUARANTEED_FACTORS = generateGuaranteed(BASE_FACTORS);

export const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(val);
};

export interface ProjectionData {
    year: number;
    surrenderValue: number;
    bondPrincipal: number;
    cumulativeBondInterest: number;
    bondFundNetValue: number;
    cashValue: number;
    totalAssets: number;
    loan: number;
    cumulativeInterest: number;
    netEquity: number;
    formattedNetEquity: string;
    formattedLoan: string;
    annualBondIncome: number;
    annualLoanInterest: number;
    annualPolicyGrowth: number;
    annualNetGain: number;
    annualRoC: number;
    cumulativePolicyGrowth: number;
    cumulativeNetGain: number;
    mortgageBalance: number;
    cumulativeMortgageCost: number;
    cumulativeMortgageInterest: number;
    annualMortgagePayment: number;
    baselineNetEquity?: number;
    ltv?: number;
}

export interface SimulationInput {
    budget: number;
    cashReserve: number;
    bondAlloc: number;
    bondYield: number;
    hibor: number;
    cofRate: number;
    interestBasis: 'hibor' | 'cof';
    spread: number;
    leverageLTV: number;
    capRate: number;
    handlingFee: number;
    fundSource: 'cash' | 'mortgage';
    unlockedCash: number;
    effectiveMortgageRate: number;
    monthlyMortgagePmt: number;
    mortgageTenor: number;
}

export interface SimulationOutput {
    pfEquity: number;
    totalPremium: number;
    bankLoan: number;
    effectiveRate: number;
    projectionData: ProjectionData[];
    finalNetEquity: number;
    roi: number;
    monthlyBondIncome: number;
    monthlyLoanInterest: number;
    monthlyNetCashflow: number;
    oneOffBondFee: number;
    netBondPrincipal: number;
    monthlyMortgagePmt: number;
}

export const calculateProjection = (input: SimulationInput): SimulationOutput => {
    const {
        budget, cashReserve, bondAlloc, bondYield, hibor, cofRate, interestBasis, spread,
        leverageLTV, capRate, handlingFee, fundSource, unlockedCash,
        effectiveMortgageRate, monthlyMortgagePmt, mortgageTenor
    } = input;

    const equity = budget - cashReserve - bondAlloc;
    const ltvDecimal = leverageLTV / 100.0;
    const currentFactors = BASE_FACTORS;
    const initialCSVFactor = currentFactors[0] || 0;

    let tPremium = 0;
    const denominator = 1 - (ltvDecimal * initialCSVFactor);
    if (denominator > 0 && equity > 0) {
        tPremium = equity / denominator;
    }

    const loan = Math.max(0, tPremium - equity);
    const baseRate = interestBasis === 'hibor' ? hibor : cofRate;
    const effRate = Math.min(baseRate + spread, capRate);

    const oneOffFee = bondAlloc * (handlingFee / 100);
    const netBondAlloc = bondAlloc - oneOffFee;

    const mBondIncome = (netBondAlloc * (bondYield / 100)) / 12;
    const mLoanInterest = (loan * (effRate / 100)) / 12;
    const mMortgageCost = fundSource === 'mortgage' ? monthlyMortgagePmt : 0;
    const mNetCashflow = mBondIncome - mLoanInterest - mMortgageCost;

    const data: ProjectionData[] = [];
    // Year 0 initialization
    const yr0Factor = currentFactors[0];
    const yr0Surrender = tPremium * yr0Factor;
    const yr0Assets = yr0Surrender + netBondAlloc + cashReserve;
    const yr0Liabilities = loan;
    const yr0MortgageBal = fundSource === 'mortgage' ? unlockedCash : 0;
    const yr0NetEquity = yr0Assets - yr0Liabilities - yr0MortgageBal;

    data.push({
        year: 0,
        surrenderValue: yr0Surrender,
        bondPrincipal: netBondAlloc,
        cumulativeBondInterest: 0,
        bondFundNetValue: netBondAlloc,
        cashValue: cashReserve,
        totalAssets: yr0Assets,
        loan: yr0Liabilities,
        cumulativeInterest: 0,
        netEquity: yr0NetEquity,
        formattedNetEquity: formatCurrency(yr0NetEquity),
        formattedLoan: formatCurrency(yr0Liabilities),
        annualBondIncome: 0,
        annualLoanInterest: 0,
        annualPolicyGrowth: 0,
        annualNetGain: 0,
        annualRoC: 0,
        cumulativePolicyGrowth: 0,
        cumulativeNetGain: 0,
        mortgageBalance: yr0MortgageBal,
        cumulativeMortgageCost: 0,
        cumulativeMortgageInterest: 0,
        annualMortgagePayment: 0
    });

    for (let yr = 1; yr <= 30; yr++) {
        const factor = currentFactors[yr] || currentFactors[30];
        const surrenderValue = tPremium * factor;
        const cumulativeBondInterest = netBondAlloc * (bondYield / 100) * yr;
        const bondFundNetValue = netBondAlloc + cumulativeBondInterest;
        const cumulativeInterest = loan * (effRate / 100) * yr;
        const currentAssets = surrenderValue + bondFundNetValue + cashReserve;
        const currentLiabilities = loan;

        // Simplified mortgage logic for projection (assuming flat for extraction simplicity, or you can add full amortization logic if needed)
        // For now, this core logic is sufficient for the AI to get the net equity numbers.

        let netEquity = currentAssets - currentLiabilities - cumulativeInterest;

        const prev = data[yr - 1];
        const annualBondIncome = cumulativeBondInterest - prev.cumulativeBondInterest;
        const annualLoanInterest = cumulativeInterest - prev.cumulativeInterest;
        const annualPolicyGrowth = surrenderValue - prev.surrenderValue;
        const annualNetGain = (annualBondIncome + annualPolicyGrowth) - annualLoanInterest;

        data.push({
            year: yr,
            surrenderValue,
            bondPrincipal: netBondAlloc,
            cumulativeBondInterest,
            bondFundNetValue,
            cashValue: cashReserve,
            totalAssets: currentAssets,
            loan: currentLiabilities,
            cumulativeInterest,
            netEquity,
            formattedNetEquity: formatCurrency(netEquity),
            formattedLoan: formatCurrency(currentLiabilities),
            annualBondIncome,
            annualLoanInterest,
            annualPolicyGrowth,
            annualNetGain,
            annualRoC: 0, // Simplified
            cumulativePolicyGrowth: surrenderValue - (tPremium * yr0Factor),
            cumulativeNetGain: netEquity - yr0NetEquity,
            mortgageBalance: 0,
            cumulativeMortgageCost: 0,
            cumulativeMortgageInterest: 0,
            annualMortgagePayment: 0
        });
    }

    const final = data[30].netEquity;
    const totalGain = data[30].cumulativeNetGain;
    const roiVal = (totalGain / budget) * 100;

    return {
        pfEquity: equity,
        totalPremium: tPremium,
        bankLoan: loan,
        effectiveRate: effRate,
        projectionData: data,
        finalNetEquity: final,
        roi: roiVal,
        monthlyBondIncome: mBondIncome,
        monthlyLoanInterest: mLoanInterest,
        monthlyNetCashflow: mNetCashflow,
        oneOffBondFee: oneOffFee,
        netBondPrincipal: netBondAlloc,
        monthlyMortgagePmt: mMortgageCost
    };
};
