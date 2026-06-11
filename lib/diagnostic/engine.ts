export type SectionId =
  | 'growth'
  | 'revenue'
  | 'execution'
  | 'automation'
  | 'talent'
  | 'experience'
  | 'strategy'

export type BinaryAnswer = 'yes' | 'no' | 'not_sure'

export interface BinaryQuestion {
  id: string
  prompt: string
}

export interface MultiOption {
  id: string
  label: string
  score: number
}

export interface MultiQuestion {
  id: string
  prompt: string
  options: MultiOption[]
}

export interface PainPoint {
  id: string
  label: string
  penalty: number
}

export interface DiagnosticSectionDefinition {
  id: SectionId
  code: string
  title: string
  weight: number
  binaryQuestions: BinaryQuestion[]
  multiQuestions: MultiQuestion[]
  painPoints: PainPoint[]
}

export interface SectionResponses {
  binaryAnswers: Record<string, BinaryAnswer>
  multiAnswers: Record<string, string>
  painPointIds: string[]
}

export interface DiagnosticProfileInput {
  fullName: string
  email: string
  organisation: string
  country: string
  teamSize: number
  manualHoursPerPersonPerWeek: number
  averageHourlyRateUsd: number
  emailReport: boolean
}

export interface SectionScoreOutput {
  score: number
  weight: number
  weightedContribution: number
  penaltyApplied: number
}

export interface CriticalFinding {
  title: string
  severity: 'Critical' | 'High' | 'Medium'
  estimatedFinancialImpact: number
  recommendation: string
}

export interface DiagnosticResults {
  score: number
  category: 'Critical' | 'Unstable' | 'Growing' | 'Structured' | 'Optimized'
  sectionScores: Record<SectionId, SectionScoreOutput>
  financialImpact: {
    monthlyLoss: number
    annualLoss: number
    hoursLost: number
  }
  insights: string[]
  criticalFindings: CriticalFinding[]
  quickWin: string
}

const BINARY_SCORE: Record<BinaryAnswer, number> = {
  yes: 1,
  no: 0,
  not_sure: 0.5,
}

export const diagnosticSections: DiagnosticSectionDefinition[] = [
  {
    id: 'growth',
    code: 'G',
    title: 'Growth',
    weight: 0.15,
    binaryQuestions: [
      { id: 'g_b1', prompt: 'Do you have documented growth targets for the next 12 months?' },
      { id: 'g_b2', prompt: 'Do teams review growth KPIs at least monthly?' },
    ],
    multiQuestions: [
      {
        id: 'g_m1',
        prompt: 'How mature is your opportunity pipeline?' ,
        options: [
          { id: 'ad-hoc', label: 'Ad-hoc and unpredictable', score: 0.2 },
          { id: 'basic', label: 'Basic tracking', score: 0.45 },
          { id: 'managed', label: 'Managed with conversion visibility', score: 0.75 },
          { id: 'optimized', label: 'Optimized with forecasting discipline', score: 1 },
        ],
      },
      {
        id: 'g_m2',
        prompt: 'How strong is your market expansion strategy?',
        options: [
          { id: 'none', label: 'No clear expansion strategy', score: 0.15 },
          { id: 'reactive', label: 'Reactive opportunities only', score: 0.4 },
          { id: 'planned', label: 'Planned and partially executed', score: 0.7 },
          { id: 'scalable', label: 'Scalable and data-driven', score: 1 },
        ],
      },
    ],
    painPoints: [
      { id: 'g_p1', label: 'Inconsistent pipeline quality', penalty: 0.18 },
      { id: 'g_p2', label: 'Low conversion rates', penalty: 0.16 },
      { id: 'g_p3', label: 'Unclear growth ownership', penalty: 0.2 },
    ],
  },
  {
    id: 'revenue',
    code: 'R',
    title: 'Revenue',
    weight: 0.15,
    binaryQuestions: [
      { id: 'r_b1', prompt: 'Do you track margin by service/product line?' },
      { id: 'r_b2', prompt: 'Is pricing reviewed against value delivered?' },
    ],
    multiQuestions: [
      {
        id: 'r_m1',
        prompt: 'Revenue mix resilience level',
        options: [
          { id: 'fragile', label: 'Highly concentrated', score: 0.2 },
          { id: 'limited', label: 'Limited diversification', score: 0.45 },
          { id: 'balanced', label: 'Balanced mix', score: 0.75 },
          { id: 'resilient', label: 'Highly resilient and diversified', score: 1 },
        ],
      },
      {
        id: 'r_m2',
        prompt: 'Cash collection effectiveness',
        options: [
          { id: 'poor', label: 'Frequent collection delays', score: 0.2 },
          { id: 'fair', label: 'Moderate delays', score: 0.5 },
          { id: 'good', label: 'Mostly on time', score: 0.8 },
          { id: 'strong', label: 'Highly disciplined collection', score: 1 },
        ],
      },
    ],
    painPoints: [
      { id: 'r_p1', label: 'Margin erosion from discounting', penalty: 0.18 },
      { id: 'r_p2', label: 'Slow receivables turnaround', penalty: 0.2 },
      { id: 'r_p3', label: 'Overdependence on one client segment', penalty: 0.16 },
    ],
  },
  {
    id: 'execution',
    code: 'E',
    title: 'Execution',
    weight: 0.15,
    binaryQuestions: [
      { id: 'e_b1', prompt: 'Do strategic priorities have clear owners?' },
      { id: 'e_b2', prompt: 'Do teams use standard delivery routines?' },
    ],
    multiQuestions: [
      {
        id: 'e_m1',
        prompt: 'Operational discipline level',
        options: [
          { id: 'chaotic', label: 'Chaotic and reactive', score: 0.15 },
          { id: 'emerging', label: 'Emerging discipline', score: 0.45 },
          { id: 'stable', label: 'Stable and measured', score: 0.75 },
          { id: 'elite', label: 'High-performance execution cadence', score: 1 },
        ],
      },
      {
        id: 'e_m2',
        prompt: 'Cross-functional coordination quality',
        options: [
          { id: 'siloed', label: 'Mostly siloed', score: 0.2 },
          { id: 'limited', label: 'Occasional collaboration', score: 0.45 },
          { id: 'connected', label: 'Consistent coordination', score: 0.75 },
          { id: 'integrated', label: 'Fully integrated execution', score: 1 },
        ],
      },
    ],
    painPoints: [
      { id: 'e_p1', label: 'Frequent delivery slippage', penalty: 0.2 },
      { id: 'e_p2', label: 'No escalation rhythm', penalty: 0.15 },
      { id: 'e_p3', label: 'Execution blocked by unclear dependencies', penalty: 0.18 },
    ],
  },
  {
    id: 'automation',
    code: 'A',
    title: 'Automation',
    weight: 0.2,
    binaryQuestions: [
      { id: 'a_b1', prompt: 'Are mission-critical workflows digitized?' },
      { id: 'a_b2', prompt: 'Do you monitor process performance through dashboards?' },
    ],
    multiQuestions: [
      {
        id: 'a_m1',
        prompt: 'Automation maturity level',
        options: [
          { id: 'manual', label: 'Mostly manual processes', score: 0.1 },
          { id: 'basic', label: 'Basic tooling with limited automation', score: 0.4 },
          { id: 'scaled', label: 'Scaled automation in core functions', score: 0.75 },
          { id: 'advanced', label: 'Advanced automation with optimization loops', score: 1 },
        ],
      },
      {
        id: 'a_m2',
        prompt: 'System integration quality',
        options: [
          { id: 'fragmented', label: 'Fragmented systems', score: 0.15 },
          { id: 'partial', label: 'Partial integrations', score: 0.45 },
          { id: 'connected', label: 'Mostly connected systems', score: 0.75 },
          { id: 'unified', label: 'Unified data and process architecture', score: 1 },
        ],
      },
    ],
    painPoints: [
      { id: 'a_p1', label: 'Heavy manual rework', penalty: 0.2 },
      { id: 'a_p2', label: 'Duplicate data entry across systems', penalty: 0.18 },
      { id: 'a_p3', label: 'Automation ROI not tracked', penalty: 0.16 },
    ],
  },
  {
    id: 'talent',
    code: 'T',
    title: 'Talent',
    weight: 0.1,
    binaryQuestions: [
      { id: 't_b1', prompt: 'Do key roles have clear competency profiles?' },
      { id: 't_b2', prompt: 'Do you run formal performance reviews?' },
    ],
    multiQuestions: [
      {
        id: 't_m1',
        prompt: 'Talent pipeline maturity',
        options: [
          { id: 'weak', label: 'Weak talent pipeline', score: 0.2 },
          { id: 'basic', label: 'Basic recruiting and onboarding', score: 0.45 },
          { id: 'developing', label: 'Developing internal pipeline', score: 0.75 },
          { id: 'strong', label: 'Strong succession and capability model', score: 1 },
        ],
      },
      {
        id: 't_m2',
        prompt: 'Learning and growth enablement',
        options: [
          { id: 'minimal', label: 'Minimal structured learning', score: 0.2 },
          { id: 'occasional', label: 'Occasional learning interventions', score: 0.45 },
          { id: 'regular', label: 'Regular role-based development', score: 0.75 },
          { id: 'embedded', label: 'Embedded learning culture', score: 1 },
        ],
      },
    ],
    painPoints: [
      { id: 't_p1', label: 'High attrition in key roles', penalty: 0.2 },
      { id: 't_p2', label: 'Limited leadership bench strength', penalty: 0.18 },
      { id: 't_p3', label: 'Capability gaps in critical teams', penalty: 0.16 },
    ],
  },
  {
    id: 'experience',
    code: 'E',
    title: 'Experience',
    weight: 0.1,
    binaryQuestions: [
      { id: 'x_b1', prompt: 'Do you measure customer satisfaction consistently?' },
      { id: 'x_b2', prompt: 'Do you measure employee experience indicators?' },
    ],
    multiQuestions: [
      {
        id: 'x_m1',
        prompt: 'Customer journey maturity',
        options: [
          { id: 'opaque', label: 'Unclear journey and touchpoints', score: 0.15 },
          { id: 'visible', label: 'Journey visible but inconsistently managed', score: 0.45 },
          { id: 'managed', label: 'Managed and improving', score: 0.75 },
          { id: 'delight', label: 'Consistently differentiated experience', score: 1 },
        ],
      },
      {
        id: 'x_m2',
        prompt: 'Response speed to pain signals',
        options: [
          { id: 'slow', label: 'Slow and inconsistent', score: 0.2 },
          { id: 'reactive', label: 'Reactive but improving', score: 0.45 },
          { id: 'timely', label: 'Timely and structured', score: 0.75 },
          { id: 'proactive', label: 'Proactive and predictive', score: 1 },
        ],
      },
    ],
    painPoints: [
      { id: 'x_p1', label: 'Recurring customer complaints', penalty: 0.2 },
      { id: 'x_p2', label: 'Internal friction harming service quality', penalty: 0.16 },
      { id: 'x_p3', label: 'Low employee engagement', penalty: 0.18 },
    ],
  },
  {
    id: 'strategy',
    code: 'R',
    title: 'Strategy',
    weight: 0.15,
    binaryQuestions: [
      { id: 's_b1', prompt: 'Is strategy clearly translated into measurable objectives?' },
      { id: 's_b2', prompt: 'Do you run structured strategy review cycles?' },
    ],
    multiQuestions: [
      {
        id: 's_m1',
        prompt: 'Strategic clarity level',
        options: [
          { id: 'unclear', label: 'Unclear direction', score: 0.15 },
          { id: 'basic', label: 'Basic strategic direction', score: 0.45 },
          { id: 'clear', label: 'Clear and actionable strategy', score: 0.75 },
          { id: 'adaptive', label: 'Adaptive strategy with scenario planning', score: 1 },
        ],
      },
      {
        id: 's_m2',
        prompt: 'Decision quality based on strategic data',
        options: [
          { id: 'limited', label: 'Limited data usage', score: 0.2 },
          { id: 'partial', label: 'Partial evidence-based decisions', score: 0.45 },
          { id: 'strong', label: 'Strong data-informed decisions', score: 0.75 },
          { id: 'advanced', label: 'Advanced strategic intelligence', score: 1 },
        ],
      },
    ],
    painPoints: [
      { id: 's_p1', label: 'Strategy not linked to execution plans', penalty: 0.2 },
      { id: 's_p2', label: 'Delayed strategic pivots', penalty: 0.16 },
      { id: 's_p3', label: 'Poor risk visibility', penalty: 0.18 },
    ],
  },
]

const recommendationBySection: Record<SectionId, string> = {
  growth: 'Run a 90-day growth sprint with explicit pipeline, conversion, and market expansion KPIs.',
  revenue: 'Introduce margin-by-line tracking and tighten pricing-governance and collections discipline.',
  execution: 'Implement a weekly execution rhythm with milestone owners and blocker escalation rules.',
  automation: 'Automate the top 3 manual workflows causing the greatest time leakage in operations.',
  talent: 'Create role-based capability plans and strengthen performance accountability for key teams.',
  experience: 'Map critical journeys and resolve the highest-friction customer and employee touchpoints first.',
  strategy: 'Establish quarterly strategy scenario reviews tied to measurable strategic outcomes.',
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function classifyScore(score: number): DiagnosticResults['category'] {
  if (score < 35) return 'Critical'
  if (score < 50) return 'Unstable'
  if (score < 65) return 'Growing'
  if (score < 80) return 'Structured'
  return 'Optimized'
}

function severityForSectionScore(score: number): CriticalFinding['severity'] {
  if (score < 35) return 'Critical'
  if (score < 60) return 'High'
  return 'Medium'
}

function sectionScore(definition: DiagnosticSectionDefinition, response?: SectionResponses): SectionScoreOutput {
  const safeResponse: SectionResponses = response ?? {
    binaryAnswers: {},
    multiAnswers: {},
    painPointIds: [],
  }

  const binaryTotal = definition.binaryQuestions.reduce((sum, question) => {
    const answer = safeResponse.binaryAnswers[question.id]
    return sum + (answer ? BINARY_SCORE[answer] : 0)
  }, 0)

  const multiTotal = definition.multiQuestions.reduce((sum, question) => {
    const optionId = safeResponse.multiAnswers[question.id]
    const matchedOption = question.options.find((option) => option.id === optionId)
    return sum + (matchedOption?.score ?? 0)
  }, 0)

  const maxPossible = definition.binaryQuestions.length + definition.multiQuestions.length
  const rawScore = maxPossible > 0 ? ((binaryTotal + multiTotal) / maxPossible) * 100 : 0

  const painPenalty = safeResponse.painPointIds.reduce((sum, painId) => {
    const painPoint = definition.painPoints.find((item) => item.id === painId)
    return sum + (painPoint?.penalty ?? 0)
  }, 0)

  const penaltyApplied = clamp(painPenalty, 0, 0.5) * 100
  const score = clamp(rawScore - penaltyApplied, 0, 100)
  const weightedContribution = score * definition.weight

  return {
    score: Math.round(score * 100) / 100,
    weight: definition.weight,
    weightedContribution: Math.round(weightedContribution * 100) / 100,
    penaltyApplied: Math.round(penaltyApplied * 100) / 100,
  }
}

interface ComputeInput {
  profile: DiagnosticProfileInput
  responses: Record<SectionId, SectionResponses>
}

export function computeDiagnosticResults(input: ComputeInput): DiagnosticResults {
  const computedSectionScores = diagnosticSections.reduce<Record<SectionId, SectionScoreOutput>>((acc, section) => {
    acc[section.id] = sectionScore(section, input.responses[section.id])
    return acc
  }, {} as Record<SectionId, SectionScoreOutput>)

  const weightedScore = diagnosticSections.reduce((total, section) => {
    return total + computedSectionScores[section.id].weightedContribution
  }, 0)

  const finalScore = Math.round(clamp(weightedScore, 0, 100) * 100) / 100
  const category = classifyScore(finalScore)

  const teamSize = clamp(Number(input.profile.teamSize) || 1, 1, 10000)
  const manualHours = clamp(Number(input.profile.manualHoursPerPersonPerWeek) || 0, 0, 80)
  const hourlyRate = clamp(Number(input.profile.averageHourlyRateUsd) || 0, 0, 10000)

  const maturityLossFactor = (100 - finalScore) / 100
  const baselineHoursPerMonth = teamSize * manualHours * 4.33
  const hoursLost = Math.round(baselineHoursPerMonth * (0.25 + 0.75 * maturityLossFactor))
  const monthlyLoss = Math.round(hoursLost * hourlyRate)
  const annualLoss = monthlyLoss * 12

  const sortedSections = [...diagnosticSections].sort((a, b) => {
    return computedSectionScores[a.id].score - computedSectionScores[b.id].score
  })

  const weakest = sortedSections[0]
  const weakestScore = computedSectionScores[weakest.id].score

  const mainInsight = `Primary drag is ${weakest.title} (${Math.round(weakestScore)}%).`
  const insightExplanation = `${weakest.title} is the lowest-performing GREATER pillar and is likely limiting overall performance. Improving this pillar first should create the fastest cross-functional lift in score, execution quality, and financial outcomes.`

  const criticalFindings: CriticalFinding[] = sortedSections.slice(0, 3).map((section) => {
    const sectionOutput = computedSectionScores[section.id]
    const impactShare = annualLoss * section.weight * ((100 - sectionOutput.score) / 100)

    return {
      title: `${section.code} - ${section.title}`,
      severity: severityForSectionScore(sectionOutput.score),
      estimatedFinancialImpact: Math.round(impactShare),
      recommendation: recommendationBySection[section.id],
    }
  })

  return {
    score: finalScore,
    category,
    sectionScores: computedSectionScores,
    financialImpact: {
      monthlyLoss,
      annualLoss,
      hoursLost,
    },
    insights: [mainInsight, insightExplanation],
    criticalFindings,
    quickWin: recommendationBySection[weakest.id],
  }
}
