"use client"

import { FormEvent, useEffect, useMemo, useState } from 'react'

type Pillar = 'growth' | 'revenue' | 'efficiency' | 'alignment' | 'talent' | 'execution' | 'resilience'
type AnswerValue = 'yes' | 'not_sure' | 'no'

type Question = {
  id: string
  pillar: Pillar
  prompt: string
}

type FormData = {
  name: string
  email: string
  businessName: string
  businessType: string
  teamSize: number
  monthlyRevenue: number
  hourlyCost: number
  manualHoursPerWeek: number
  emailReport: boolean
}

type Result = {
  score: number
  category: 'Critical' | 'Unstable' | 'Growing' | 'Structured' | 'Optimized'
  sectionScores: Record<Pillar, number>
  financialImpact: {
    monthlyLoss: number
    annualLoss: number
    hoursLost: number
  }
  insights: string[]
  criticalFindings: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium'
    estimatedFinancialImpact: number
    recommendation: string
  }>
  quickWin: string
  industry: string
  generatedAt: string
  revenueLeakageEstimate: number
  timeWasteEstimateHours: number
}

const STORAGE_KEY = 'greater-diagnostic-state-v1'

const stepTitles = [
  'Step 1: Business Profile',
  'Step 2: Market Validation',
  'Step 3: Operations and Strategy',
  'Step 4: People and Systems',
  'Step 5: Results',
]

const marketQuestions: Question[] = [
  { id: 'q_growth_1', pillar: 'growth', prompt: 'Do you have a clearly defined growth strategy for the next 12 months?' },
  { id: 'q_growth_2', pillar: 'growth', prompt: 'Are customer acquisition channels predictable and measurable?' },
  { id: 'q_revenue_1', pillar: 'revenue', prompt: 'Is your pricing model reviewed and optimized at least quarterly?' },
  { id: 'q_revenue_2', pillar: 'revenue', prompt: 'Do you track sales conversion rates and deal velocity consistently?' },
]

const operationsQuestions: Question[] = [
  { id: 'q_efficiency_1', pillar: 'efficiency', prompt: 'Are key operational workflows standardized across teams?' },
  { id: 'q_efficiency_2', pillar: 'efficiency', prompt: 'Have you automated repetitive tasks that consume significant hours?' },
  { id: 'q_alignment_1', pillar: 'alignment', prompt: 'Does every department align its goals with a single business strategy?' },
  { id: 'q_alignment_2', pillar: 'alignment', prompt: 'Are performance KPIs transparent and reviewed with ownership?' },
]

const peopleQuestions: Question[] = [
  { id: 'q_talent_1', pillar: 'talent', prompt: 'Do you have the right leadership depth for current growth demands?' },
  { id: 'q_talent_2', pillar: 'talent', prompt: 'Are role expectations and accountability clearly documented?' },
  { id: 'q_execution_1', pillar: 'execution', prompt: 'Are strategic initiatives executed on schedule with minimal delays?' },
  { id: 'q_execution_2', pillar: 'execution', prompt: 'Do teams resolve blockers quickly through a defined escalation process?' },
  { id: 'q_resilience_1', pillar: 'resilience', prompt: 'Do you have active risk mitigation and continuity plans in place?' },
  { id: 'q_resilience_2', pillar: 'resilience', prompt: 'Can your systems maintain operations during disruptions?' },
]

const allQuestions = [...marketQuestions, ...operationsQuestions, ...peopleQuestions]

const initialForm: FormData = {
  name: '',
  email: '',
  businessName: '',
  businessType: '',
  teamSize: 10,
  monthlyRevenue: 50000,
  hourlyCost: 25,
  manualHoursPerWeek: 8,
  emailReport: true,
}

function currency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export default function DiagnosticWizard() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initialForm)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [result, setResult] = useState<Result | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInactiveWarning, setShowInactiveWarning] = useState(false)

  const dirty = useMemo(() => {
    const hasProfile = Boolean(form.name || form.email || form.businessName || form.businessType)
    return hasProfile || Object.keys(answers).length > 0
  }, [form, answers])

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as { step: number; form: FormData; answers: Record<string, AnswerValue>; result: Result | null }
      setStep(parsed.step ?? 1)
      setForm(parsed.form ?? initialForm)
      setAnswers(parsed.answers ?? {})
      setResult(parsed.result ?? null)
    } catch {
      // Ignore malformed local data.
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step,
        form,
        answers,
        result,
      })
    )
  }, [step, form, answers, result])

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty || result) return
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty, result])

  useEffect(() => {
    if (result) return

    let timer = window.setTimeout(() => {
      if (dirty) {
        setShowInactiveWarning(true)
      }
    }, 60000)

    const resetTimer = () => {
      window.clearTimeout(timer)
      setShowInactiveWarning(false)
      timer = window.setTimeout(() => {
        if (dirty) {
          setShowInactiveWarning(true)
        }
      }, 60000)
    }

    const events: Array<keyof WindowEventMap> = ['mousemove', 'keydown', 'click', 'scroll']
    events.forEach((event) => window.addEventListener(event, resetTimer))

    return () => {
      window.clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [dirty, result])

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function validateStep(targetStep: number): string | null {
    if (targetStep === 1) {
      if (!form.name || !form.email || !form.businessName || !form.businessType) {
        return 'Complete all profile fields before continuing.'
      }
    }

    if (targetStep === 2 && marketQuestions.some((q) => !answers[q.id])) {
      return 'Answer all Market Validation questions.'
    }

    if (targetStep === 3 && operationsQuestions.some((q) => !answers[q.id])) {
      return 'Answer all Operations and Strategy questions.'
    }

    if (targetStep === 4 && peopleQuestions.some((q) => !answers[q.id])) {
      return 'Answer all People and Systems questions.'
    }

    return null
  }

  function next() {
    const msg = validateStep(step)
    if (msg) {
      setError(msg)
      return
    }
    setError(null)
    setStep((s) => Math.min(4, s + 1))
  }

  function prev() {
    setError(null)
    setStep((s) => Math.max(1, s - 1))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const msg = validateStep(4)
    if (msg) {
      setError(msg)
      return
    }

    const payload = {
      ...form,
      answers: allQuestions.map((q) => ({
        id: q.id,
        pillar: q.pillar,
        value: answers[q.id],
      })),
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/diagnostic/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error('Submission failed')
      }

      setResult(json.result as Result)
      setStep(5)
      setShowInactiveWarning(false)
    } catch {
      setError('Submission failed. Please retry in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  function clearSession() {
    sessionStorage.removeItem(STORAGE_KEY)
    setStep(1)
    setForm(initialForm)
    setAnswers({})
    setResult(null)
    setError(null)
  }

  const progress = Math.round(((step - 1) / 4) * 100)

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#1f3f35,_#0f172a_45%,_#020617_75%)] px-4 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-5xl">
        <header className="rounded-2xl border border-emerald-400/30 bg-slate-900/70 p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.12)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.26em] text-emerald-300">GREATER Business Diagnostic</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">AI-Powered Operational Autopsy</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Complete the 5-step assessment to identify score gaps, quantify financial leakage, and receive immediate strategic recommendations.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>{stepTitles[step - 1]}</span>
              <span>{progress}% complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>

        <form onSubmit={submit} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur">
          {step === 1 && (
            <section className="grid gap-4 md:grid-cols-2">
              <Field label="Your Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
              <Field label="Business Name" value={form.businessName} onChange={(v) => setForm((f) => ({ ...f, businessName: v }))} />
              <Field label="Business Type" value={form.businessType} onChange={(v) => setForm((f) => ({ ...f, businessType: v }))} />
              <Field
                label="Team Size"
                type="number"
                value={String(form.teamSize)}
                onChange={(v) => setForm((f) => ({ ...f, teamSize: Number(v || 0) }))}
              />
              <Field
                label="Monthly Revenue (USD)"
                type="number"
                value={String(form.monthlyRevenue)}
                onChange={(v) => setForm((f) => ({ ...f, monthlyRevenue: Number(v || 0) }))}
              />
              <Field
                label="Average Hourly Staff Cost (USD)"
                type="number"
                value={String(form.hourlyCost)}
                onChange={(v) => setForm((f) => ({ ...f, hourlyCost: Number(v || 0) }))}
              />
              <Field
                label="Manual Hours Per Person / Week"
                type="number"
                value={String(form.manualHoursPerWeek)}
                onChange={(v) => setForm((f) => ({ ...f, manualHoursPerWeek: Number(v || 0) }))}
              />

              <label className="md:col-span-2 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={form.emailReport}
                  onChange={(e) => setForm((f) => ({ ...f, emailReport: e.target.checked }))}
                />
                Email my diagnostic summary report
              </label>
            </section>
          )}

          {step === 2 && <QuestionGroup title="Market Validation" questions={marketQuestions} answers={answers} onSelect={setAnswer} />}
          {step === 3 && <QuestionGroup title="Operations and Strategy" questions={operationsQuestions} answers={answers} onSelect={setAnswer} />}
          {step === 4 && <QuestionGroup title="People and Systems" questions={peopleQuestions} answers={answers} onSelect={setAnswer} />}

          {step === 5 && result && (
            <section className="space-y-6">
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">GREATER Diagnostic Report</p>
                <h2 className="mt-2 text-3xl font-semibold">{result.score}% - {result.category}</h2>
                <p className="mt-2 text-slate-300">Industry Context: {result.industry}</p>
                <p className="mt-1 text-slate-400">Generated: {new Date(result.generatedAt).toLocaleString()}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <KpiCard label="Time Waste Estimate" value={`${result.timeWasteEstimateHours.toLocaleString()} hrs / month`} />
                <KpiCard label="Monthly Loss Estimate" value={currency(result.financialImpact.monthlyLoss)} />
                <KpiCard label="Revenue Leakage" value={currency(result.revenueLeakageEstimate)} />
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <h3 className="text-lg font-semibold">Category Breakdown</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {Object.entries(result.sectionScores).map(([name, value]) => (
                    <div key={name} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                      <p className="text-sm capitalize text-slate-300">{name}</p>
                      <p className="mt-1 text-xl font-semibold text-emerald-300">{value}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <h3 className="text-lg font-semibold">Summary Insight</h3>
                <p className="mt-3 text-slate-300">{result.insights[0]}</p>
                <p className="mt-2 text-slate-400">{result.insights[1]}</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <h3 className="text-lg font-semibold">Critical Findings</h3>
                <div className="mt-4 space-y-3">
                  {result.criticalFindings.map((f) => (
                    <article key={f.title} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-medium">{f.title}</h4>
                        <span className="rounded-full border border-rose-500/40 bg-rose-950/30 px-2 py-0.5 text-xs text-rose-200">{f.severity}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{f.recommendation}</p>
                      <p className="mt-2 text-sm text-amber-300">Estimated Annual Impact: {currency(f.estimatedFinancialImpact)}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-slate-900 p-5">
                <h3 className="text-lg font-semibold">Quick Wins</h3>
                <p className="mt-2 text-slate-300">{result.quickWin}</p>
                <h3 className="mt-5 text-lg font-semibold">Automation Opportunities</h3>
                <p className="mt-2 text-slate-300">Focus first on the lowest-scoring pillar and automate the highest-frequency manual workflow tied to that pillar.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="/contact-us?topic=diagnostic#enquiry" className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500">
                    Book Strategy Call
                  </a>
                  <a
                    href={`mailto:${form.email}?subject=GREATER%20Diagnostic%20Report&body=${encodeURIComponent(`Business: ${form.businessName}\nScore: ${result.score}%\nCategory: ${result.category}\nIndustry: ${result.industry}\nQuick Win: ${result.quickWin}`)}`}
                    className="rounded-lg border border-emerald-500 px-4 py-2 font-medium text-emerald-200 hover:bg-emerald-900/20"
                  >
                    Email Report
                  </a>
                  <button type="button" className="rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800" onClick={clearSession}>
                    Start New Diagnostic
                  </button>
                </div>
              </div>
            </section>
          )}

          {error && <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-sm text-rose-100">{error}</p>}

          {step < 5 && (
            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={prev} disabled={step === 1} className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-40">
                Previous
              </button>

              {step < 4 ? (
                <button type="button" onClick={next} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Generate Results'}
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      {showInactiveWarning && step < 5 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold text-amber-300">Are you sure you want to leave?</h3>
            <p className="mt-2 text-sm text-slate-300">Progress will not be saved.</p>
            <div className="mt-4 flex gap-3">
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500" onClick={() => setShowInactiveWarning(false)}>
                Stay and Continue
              </button>
              <button
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
                onClick={() => {
                  clearSession()
                  window.location.href = '/'
                }}
              >
                Exit Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: 'text' | 'email' | 'number'
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-emerald-400/40 transition focus:ring"
      />
    </label>
  )
}

function QuestionGroup({
  title,
  questions,
  answers,
  onSelect,
}: {
  title: string
  questions: Question[]
  answers: Record<string, AnswerValue>
  onSelect: (id: string, value: AnswerValue) => void
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">
        {questions.map((q) => (
          <article key={q.id} className="rounded-xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-sm text-slate-100">{q.prompt}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['yes', 'not_sure', 'no'] as const).map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => onSelect(q.id, option)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    answers[q.id] === option
                      ? 'border-emerald-300 bg-emerald-500/20 text-emerald-200'
                      : 'border-slate-700 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {option === 'not_sure' ? 'Not sure' : option === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-emerald-300">{value}</p>
    </div>
  )
}
