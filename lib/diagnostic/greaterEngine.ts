export type GreaterPillarId =
  | 'growth'
  | 'revenue'
  | 'efficiency'
  | 'alignment'
  | 'talent'
  | 'execution'
  | 'resilience'

export type YesNoAnswer = 'yes' | 'not_sure' | 'no'

export interface AnswerItem {
  id: string
  pillar: GreaterPillarId
  value: YesNoAnswer
}

export interface DiagnosticInput {
  name: string
  email: string
  businessName: string
  businessType: string
  teamSize: number
  monthlyRevenue: number
  hourlyCost: number
  manualHoursPerWeek: number
  answers: AnswerItem[]
  submittedAt?: string
}

export interface CriticalFinding {
  title: string
  severity: 'Critical' | 'High' | 'Medium'
  estimatedFinancialImpact: number
  recommendation: string
}

export interface DiagnosticOutput {
  score: number
  category: 'Critical' | 'Unstable' | 'Growing' | 'Structured' | 'Optimized'
  sectionScores: Record<GreaterPillarId, number>
  financialImpact: {
    monthlyLoss: number
    annualLoss: number
    hoursLost: number
  }
  insights: string[]
  criticalFindings: CriticalFinding[]
  quickWin: string
  industry: string
  generatedAt: string
  revenueLeakageEstimate: number
  timeWasteEstimateHours: number
}

export const PILLAR_WEIGHTS: Record<GreaterPillarId, number> = {
  growth: 0.15,
  revenue: 0.15,
  efficiency: 0.15,
  alignment: 0.2,
  talent: 0.1,
  execution: 0.1,
  resilience: 0.15,
}

const ANSWER_SCORE: Record<YesNoAnswer, number> = {
  yes: 10,
  not_sure: 5,
  no: 0,
}

const PILLAR_LABELS: Record<GreaterPillarId, string> = {
  growth: 'Growth',
  revenue: 'Revenue',
  efficiency: 'Efficiency',
  alignment: 'Alignment',
  talent: 'Talent',
  execution: 'Execution',
  resilience: 'Resilience',
}

const RECOMMENDATIONS: Record<GreaterPillarId, string> = {
  growth: 'Prioritize customer segmentation and tighten demand validation before scaling acquisition spend.',
  revenue: 'Install a weekly revenue cadence for pricing, conversion, and cash collection visibility.',
  efficiency: 'Map your top manual bottlenecks and automate the first three high-friction workflows.',
  alignment: 'Translate strategy into a 90-day execution plan with owners, milestones, and measurable outcomes.',
  talent: 'Define role scorecards and implement capability plans for all mission-critical positions.',
  execution: 'Adopt a consistent operating rhythm with weekly progress reviews and blocker escalation.',
  resilience: 'Strengthen risk monitoring and scenario planning to improve continuity under disruption.',
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function classify(score: number): DiagnosticOutput['category'] {
  if (score < 35) return 'Critical'
  if (score < 50) return 'Unstable'
  if (score < 65) return 'Growing'
  if (score < 80) return 'Structured'
  return 'Optimized'
}

function detectIndustry(businessType: string): string {
  const t = businessType.toLowerCase()
  if (t.includes('fin')) return 'Financial Services'
  if (t.includes('manufact')) return 'Manufacturing'
  if (t.includes('health')) return 'Health and Pharma'
  if (t.includes('retail')) return 'Retail and Consumer'
  if (t.includes('tech') || t.includes('software')) return 'Technology'
  if (t.includes('public') || t.includes('government')) return 'Public Sector'
  return 'Cross-sector Professional Services'
}

function severityFor(score: number): CriticalFinding['severity'] {
  if (score < 35) return 'Critical'
  if (score < 60) return 'High'
  return 'Medium'
}

export function computeGreaterDiagnostic(input: DiagnosticInput): DiagnosticOutput {
  const grouped: Record<GreaterPillarId, number[]> = {
    growth: [],
    revenue: [],
    efficiency: [],
    alignment: [],
    talent: [],
    execution: [],
    resilience: [],
  }

  for (const a of input.answers) {
    grouped[a.pillar].push(ANSWER_SCORE[a.value])
  }

  const sectionScores = Object.keys(grouped).reduce((acc, k) => {
    const pillar = k as GreaterPillarId
    const values = grouped[pillar]
    const max = Math.max(values.length * 10, 10)
    const sum = values.reduce((s, v) => s + v, 0)
    acc[pillar] = Math.round((sum / max) * 100)
    return acc
  }, {} as Record<GreaterPillarId, number>)

  const weightedTotal = (Object.keys(sectionScores) as GreaterPillarId[]).reduce((sum, pillar) => {
    return sum + sectionScores[pillar] * PILLAR_WEIGHTS[pillar]
  }, 0)

  const finalScore = Math.round(clamp(weightedTotal, 0, 100))

  const teamSize = clamp(input.teamSize || 1, 1, 100000)
  const manualHours = clamp(input.manualHoursPerWeek || 0, 0, 80)
  const hourlyCost = clamp(input.hourlyCost || 0, 0, 10000)
  const monthlyRevenue = clamp(input.monthlyRevenue || 0, 0, 1000000000)

  const maturityGap = (100 - finalScore) / 100
  const hoursLost = Math.round(teamSize * manualHours * 4.33 * (0.35 + maturityGap * 0.65))
  const monthlyLoss = Math.round(hoursLost * hourlyCost)
  const revenueLeakageEstimate = Math.round(monthlyRevenue * (0.03 + maturityGap * 0.12))
  const annualLoss = (monthlyLoss + revenueLeakageEstimate) * 12

  const ordered = (Object.keys(sectionScores) as GreaterPillarId[])
    .map((pillar) => ({ pillar, score: sectionScores[pillar] }))
    .sort((a, b) => a.score - b.score)

  const weakest = ordered[0]
  const insights = [
    `The lowest-performing GREATER pillar is ${PILLAR_LABELS[weakest.pillar]} (${weakest.score}%).`,
    `Current operating maturity suggests measurable value leakage in execution quality and commercial throughput. Prioritizing ${PILLAR_LABELS[weakest.pillar]} should unlock the fastest performance lift.`,
  ]

  const criticalFindings = ordered.slice(0, 5).map((item) => ({
    title: PILLAR_LABELS[item.pillar],
    severity: severityFor(item.score),
    estimatedFinancialImpact: Math.round(annualLoss * PILLAR_WEIGHTS[item.pillar] * ((100 - item.score) / 100)),
    recommendation: RECOMMENDATIONS[item.pillar],
  }))

  return {
    score: finalScore,
    category: classify(finalScore),
    sectionScores,
    financialImpact: {
      monthlyLoss,
      annualLoss,
      hoursLost,
    },
    insights,
    criticalFindings,
    quickWin: RECOMMENDATIONS[weakest.pillar],
    industry: detectIndustry(input.businessType),
    generatedAt: new Date().toISOString(),
    revenueLeakageEstimate,
    timeWasteEstimateHours: hoursLost,
  }
}
