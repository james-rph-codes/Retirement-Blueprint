const RETIREMENT_CONFIG = {
  // Core educational steps pulled straight from your blueprints
  strategySteps: [
    {
      id: "step-1",
      title: "1. Emergency Fund",
      priority: "Priority #1",
      details: "3-6 months of expenses (conservatively) or 12 months for safety. Goal is stability and liquidity using HYSAs, Money Market Funds, or state tax-exempt Treasury Bills. Never compromise this before investing.",
      source: "Retirement Blueprint"
    },
    {
      id: "step-2",
      title: "2. Max out Roth 457 Space",
      priority: "Tax Advantage #1",
      details: "Capped at $24,500 (2026 base limit). Crucial: Exempt from the 10% early withdrawal penalty. You can access these funds immediately upon leaving your employer at any age before 59.5. Do NOT roll into a traditional IRA early.",
      source: "Retirement Blueprint"
    },
    {
      id: "step-3",
      title: "3. Secure Stable Pension (NYCERS Tier 4 / Tier 6)",
      priority: "Guaranteed Income",
      details: "Acts as a bedrock unaffected by stock market corrections. You can vest after 5 years of service. Understand your target retirement timeline (Age 57 for Tier 4, Age 63 for Tier 6) to plan your bridging funds safely.",
      source: "Tier 4 & Tier 6 Guides"
    },
    {
      id: "step-4",
      title: "4. Leverage the Spread & Step-Up Basis ('Buy, Borrow, Die')",
      priority: "Advanced Strategy",
      details: "Accumulate appreciating core assets like VOO. Borrow against your assets using low-interest margins or your NYCERS pension balance (up to 75% or $50k at ~7%) if it creates a positive spread over expected S&P returns. Pass on wealth with a tax-free step-up in basis.",
      source: "Retirement Blueprint"
    }
  ],
  
  // Default values for your custom compounding engine
  calculatorDefaults: {
    initialInvestment: 10000,
    monthlyContribution: 1000,
    yearsToGrow: 25,
    nominalRate: 10.0, // Historical VOO average
    inflationRate: 3.0 // Average long-term inflation drag
  }
};