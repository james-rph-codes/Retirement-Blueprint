const RETIREMENT_CONFIG = {
  metadata: {
    title: "Personal Retirement Blueprint & Strategy Dashboard",
    authorVibe: "Vibe Coding Architecture"
  },
  
  // Clean text/strings decoupled from UI HTML markup
  strings: {
    emergencyFundNote: "Priority #1: Stability & Liquidity. Avoid early CD withdrawals that wipe out gains. Prefer state tax-exempt MMFs or T-Bills.",
    roth457Note: "Exempt from 10% early withdrawal penalty upon leaving job. DO NOT rollover to an IRA before 59.5!",
    megaBackdoorNote: "Requires a plan allowing both after-tax contributions and in-plan conversions.",
    marginNote: "Interactive Brokers (IBKR) maintains lower spreads (~5%) over SOFR compared to standard brokers (~10-11%).",
    tier4Timeline: "Tier 4 (57/5): 5 years to vest, full payout at 57. Use traditional 457 to bridge gap from retirement to 57.",
    tier6Timeline: "Tier 6 (63/5): 5 years to vest, full payout at 63. Use traditional 457 to bridge gap from retirement to 59.5."
  },

  // Limits based strictly on your document data
  constants: {
    irsLimits2026: {
      fourOOneK_fourOThreeB: 24500,
      fourOOneK_catchUp_50_59: 32500,
      fourOOneK_catchUp_60_63: 35750,
      fourFiveSevenB: 24500,
      fourFiveSevenB_catchUp_50_59: 32500,
      fourFiveSevenB_catchUp_60_63: 35750,
      fourFiveSevenB_DAR: 49000, // Deferral Acceleration for Retirement
      ira: 7500,
      ira_catchUp_50_plus: 8600,
      megaBackdoorTotalLimit: 72000,
      megaBackdoorTotalLimit_50_59: 80000,
      megaBackdoorTotalLimit_60_63: 83250
    },
    leverage: {
      fourOThreeBLoanMaxPercent: 0.50,
      fourOThreeBLoanMaxCap: 50000,
      nycersLoanMaxPercent: 0.75,
      nycersLoanMaxCap: 50000,
      nycers2026InterestRate: 0.07
    },
    // Capital gains brackets from your document
    capitalGainsBracketsSingle: [
      { rate: 0.00, min: 0, max: 49450 },
      { rate: 0.15, min: 49451, max: 545500 },
      { rate: 0.20, min: 545501, max: Infinity }
    ],
    // Social Security table from your document
    socialSecurityModifications: [
      { age: 62, impact: "-30.0%", label: "Earliest Possible" },
      { age: 63, impact: "-25.0%", label: "Early" },
      { age: 64, impact: "-20.0%", label: "Early" },
      { age: 65, impact: "-13.3%", label: "Early" },
      { age: 66, impact: "-6.7%", label: "Early" },
      { age: 67, impact: "0.0%", label: "Full Retirement Age" },
      { age: 68, impact: "+8.0%", label: "Delayed Credit" },
      { age: 69, impact: "+16.0%", label: "Delayed Credit" },
      { age: 70, impact: "+24.0%", label: "Max Delayed Credit" }
    ]
  },

  // Logic isolation layer
  formulas: {
// Computes Solo 401(k) / 1099 After-Tax space providing maximum Roth flexibility
    calculateSolo401kMax: (age, w2ElectiveContribution, netSideIncome, chooseToTakeProfitSharing = false) => {
      // 2026 Absolute Limit per unrelated employer plan
      let singlePlanMaxSpace = RETIREMENT_CONFIG.constants.irsLimits2026.megaBackdoorTotalLimit; // $72,000
      let catchUp = 0;
// Calculate base employer room, capped by the 2026 IRS compensation limit
const maxEligibleIncome = Math.min(netSideIncome, 360000); 
const rawEmployerContribution = chooseToTakeProfitSharing ? (maxEligibleIncome * 0.20) : 0;

// Then, clip it so it never individually exceeds the absolute plan cap
const employerContribution = Math.min(rawEmployerContribution, absolutePlanCap);

      // Adjust for age catch-ups if applicable
      if (age >= 50 && age <= 59) {
        catchUp = RETIREMENT_CONFIG.constants.irsLimits2026.fourOOneK_catchUp_50_59 - RETIREMENT_CONFIG.constants.irsLimits2026.fourOOneK_fourOThreeB; // $8,000
      } else if (age >= 60 && age <= 63) {
        catchUp = RETIREMENT_CONFIG.constants.irsLimits2026.fourOOneK_catchUp_60_63 - RETIREMENT_CONFIG.constants.irsLimits2026.fourOOneK_fourOThreeB; // $11,250
      }

      // 1. Employee Deferral Space Left on 1099 side (Shared cross-plan)
      const baseEmployeeLimit = RETIREMENT_CONFIG.constants.irsLimits2026.fourOOneK_fourOThreeB;
      const employeeSpaceLeft = Math.max(0, baseEmployeeLimit - w2ElectiveContribution);

      // 2. Employer Profit Sharing Space (Discretionary: Only calculated if explicitly turned on)
      const employerContribution = chooseToTakeProfitSharing ? (netSideIncome * 0.20) : 0;

      // 3. Voluntary After-Tax Space (Mega Backdoor Roth Component)
      // The total additions in this single plan cannot exceed $72,000 (+ catch up) OR 100% of income
      const absolutePlanCap = singlePlanMaxSpace + catchUp;
      const maximumAllowedByIncome = Math.min(absolutePlanCap, netSideIncome);

      // After-tax space is the income-capped limit minus standard components used in this plan
      const afterTaxSpaceLeft = Math.max(0, maximumAllowedByIncome - employeeSpaceLeft - employerContribution);

      return {
        employeeSpaceLeft,
        employerContribution,
        afterTaxSpaceLeft,
        totalSolo401kAllowed: employeeSpaceLeft + employerContribution + afterTaxSpaceLeft
      };
    },
    
    // Calculates Capital Gains Tax Band Rate
    getCentalGainsRate: (income) => {
      const match = RETIREMENT_CONFIG.constants.capitalGainsBracketsSingle.find(b => income >= b.min && income <= b.max);
      return match ? match.rate : 0.20;
    }
  }
};