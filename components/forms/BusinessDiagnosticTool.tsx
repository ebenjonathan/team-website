'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  computeDiagnosticResults,
  diagnosticSections,
  type BinaryAnswer,
  type DiagnosticProfileInput,
  type DiagnosticResults,
  type SectionId,
  type SectionResponses,
} from '@/lib/diagnostic/engine'

const binaryOptions: { key: BinaryAnswer; label: string }[] = [
  { key: 'yes', label: 'Yes' },
  { key: 'no', label: 'No' },
  { key: 'not_sure', label: 'Not Sure' },
]

const sectionLabelClass = (score: number) => {
  if (score < 35) return 'text-rose-700 bg-rose-50 border-rose-200'
  if (score < 60) return 'text-amber-700 bg-amber-50 border-amber-200'
  return 'text-emerald-700 bg-emerald-50 border-emerald-200'
}

function AnimatedPercent({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const target = Math.round(value)
    let frame = 0
    const totalFrames = 36

    const timer = setInterval(() => {
      frame += 1
      const next = Math.round((target * frame) / totalFrames)
      setDisplay(next)
      if (frame >= totalFrames) {
        clearInterval(timer)
      }
    }, 18)

    return () => clearInterval(timer)
  }, [value])

  return <>{display}%</>
}

function createInitialResponses(): Record<SectionId, SectionResponses> {
  return diagnosticSections.reduce((acc, section) => {
    acc[section.id] = {
      binaryAnswers: {},
      multiAnswers: {},
      painPointIds: [],
    }
    return acc
  }, {} as Record<SectionId, SectionResponses>)
}

export function BusinessDiagnosticTool() {
  const [stepIndex, setStepIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [apiMode, setApiMode] = useState('local-fallback')

  const [profile, setProfile] = useState<DiagnosticProfileInput>({
    fullName: '',
    email: '',
    organisation: '',
    country: '',
    teamSize: 15,
    manualHoursPerPersonPerWeek: 4,
    averageHourlyRateUsd: 25,
    emailReport: true,
  })

  const [responses, setResponses] = useState<Record<SectionId, SectionResponses>>(createInitialResponses)

  const totalSteps = 1 + diagnosticSections.length
  const isProfileStep = stepIndex === 0
  const activeSection = diagnosticSections[Math.max(0, stepIndex - 1)]
  const progress = Math.round((stepIndex / (totalSteps - 1)) * 100)

  const results: DiagnosticResults = useMemo(() => {
    return computeDiagnosticResults({ profile, responses })
  }, [profile, responses])

  function isProfileComplete() {
    return (
      profile.fullName.trim().length >= 2
      && profile.email.includes('@')
      && profile.organisation.trim().length >= 2
      && profile.country.trim().length >= 2
      && profile.teamSize >= 1
      && profile.manualHoursPerPersonPerWeek >= 0
      && profile.averageHourlyRateUsd >= 0
    )
  }

  function isSectionComplete(sectionId: SectionId) {
    const section = diagnosticSections.find((item) => item.id === sectionId)
    if (!section) return false

    const sectionResponse = responses[sectionId]
    const hasBinary = section.binaryQuestions.every((q) => Boolean(sectionResponse.binaryAnswers[q.id]))
    const hasMulti = section.multiQuestions.every((q) => Boolean(sectionResponse.multiAnswers[q.id]))

    return hasBinary && hasMulti
  }

  function canContinueCurrentStep() {
    if (isProfileStep) {
      return isProfileComplete()
    }

    if (!activeSection) return false
    return isSectionComplete(activeSection.id)
  }

  async function submitDiagnostic() {
    setIsLoading(true)
    setFormError('')

    setStatusMessage('Normalizing binary, multi-choice, and pain-point signals...')
    await new Promise((resolve) => setTimeout(resolve, 700))

    setStatusMessage('Computing weighted GREATER score and classification...')
    await new Promise((resolve) => setTimeout(resolve, 800))

    setStatusMessage('Building findings, insight, and financial impact model...')
    await new Promise((resolve) => setTimeout(resolve, 900))

    try {
      const payload = {
        profile,
        responses,
        result: results,
      }

      const response = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      const data = await response.json()
      setApiMode(data.mode ?? 'local-fallback')
      setSubmitted(true)
    } catch {
      setFormError('Unable to store diagnostic results. Please try again in a few seconds.')
    } finally {
      setIsLoading(false)
      setStatusMessage('')
    }
  }

  const weakestFinding = results.criticalFindings[0]

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-700">TEAM Business Diagnostic (GREATER)</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {submitted ? 'Completed' : `Step ${stepIndex + 1} / ${totalSteps}`}
          </p>
        </div>

        {!submitted && (
          <>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {diagnosticSections.map((section, index) => {
                const active = index === stepIndex - 1
                const complete = index < stepIndex && isSectionComplete(section.id)

                return (
                  <span
                    key={section.id}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                      complete
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : active
                          ? 'border-primary/30 bg-primary-light text-primary-deeper'
                          : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    {section.code} - {section.title}
                  </span>
                )
              })}
            </div>
          </>
        )}
      </div>

      <div className="px-6 py-7 md:px-8">
        <AnimatePresence mode="wait">
          {!submitted && !isLoading && isProfileStep && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-2xl font-bold text-primary-deeper">Organisation Inputs</h3>
                <p className="mt-2 text-slate-600">
                  These inputs drive deterministic scoring and the financial impact model.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Full Name</span>
                  <input
                    value={profile.fullName}
                    onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Organisation</span>
                  <input
                    value={profile.organisation}
                    onChange={(e) => setProfile((prev) => ({ ...prev, organisation: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Country</span>
                  <input
                    value={profile.country}
                    onChange={(e) => setProfile((prev) => ({ ...prev, country: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Team Size</span>
                  <input
                    type="number"
                    min={1}
                    value={profile.teamSize}
                    onChange={(e) => setProfile((prev) => ({ ...prev, teamSize: Number(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Manual Task Hours / Person / Week</span>
                  <input
                    type="number"
                    min={0}
                    value={profile.manualHoursPerPersonPerWeek}
                    onChange={(e) => setProfile((prev) => ({ ...prev, manualHoursPerPersonPerWeek: Number(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Average Hourly Cost (USD)</span>
                  <input
                    type="number"
                    min={0}
                    value={profile.averageHourlyRateUsd}
                    onChange={(e) => setProfile((prev) => ({ ...prev, averageHourlyRateUsd: Number(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={profile.emailReport}
                  onChange={(e) => setProfile((prev) => ({ ...prev, emailReport: e.target.checked }))}
                  className="h-4 w-4 accent-primary"
                />
                <Mail className="h-4 w-4 text-primary" />
                Request emailed full report
              </label>
            </motion.div>
          )}

          {!submitted && !isLoading && !isProfileStep && activeSection && (
            <motion.div
              key={activeSection.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <p className="inline-flex rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-deeper">
                  {activeSection.code} - {activeSection.title} ({Math.round(activeSection.weight * 100)}%)
                </p>
                <h3 className="mt-3 text-2xl font-bold text-primary-deeper">Section Assessment</h3>
                <p className="mt-2 text-slate-600">
                  Answer binary and multi-choice prompts, then select applicable pain points.
                </p>
              </div>

              <div className="space-y-4">
                {activeSection.binaryQuestions.map((question, index) => (
                  <div key={question.id} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-800">{index + 1}. {question.prompt}</p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {binaryOptions.map((option) => {
                        const selected = responses[activeSection.id].binaryAnswers[question.id] === option.key
                        return (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() => {
                              setResponses((prev) => ({
                                ...prev,
                                [activeSection.id]: {
                                  ...prev[activeSection.id],
                                  binaryAnswers: {
                                    ...prev[activeSection.id].binaryAnswers,
                                    [question.id]: option.key,
                                  },
                                },
                              }))
                            }}
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                              selected
                                ? 'border-primary bg-primary text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-primary/30'
                            }`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {activeSection.multiQuestions.map((question, index) => (
                  <div key={question.id} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {activeSection.binaryQuestions.length + index + 1}. {question.prompt}
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {question.options.map((option) => {
                        const selected = responses[activeSection.id].multiAnswers[question.id] === option.id
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setResponses((prev) => ({
                                ...prev,
                                [activeSection.id]: {
                                  ...prev[activeSection.id],
                                  multiAnswers: {
                                    ...prev[activeSection.id].multiAnswers,
                                    [question.id]: option.id,
                                  },
                                },
                              }))
                            }}
                            className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                              selected
                                ? 'border-primary bg-primary text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-primary/30'
                            }`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-800">Pain points (penalty applied, max -0.5 per section)</p>
                  <div className="mt-3 space-y-2">
                    {activeSection.painPoints.map((pain) => {
                      const checked = responses[activeSection.id].painPointIds.includes(pain.id)

                      return (
                        <label key={pain.id} className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setResponses((prev) => {
                                const current = prev[activeSection.id].painPointIds
                                const next = e.target.checked
                                  ? [...current, pain.id]
                                  : current.filter((id) => id !== pain.id)

                                return {
                                  ...prev,
                                  [activeSection.id]: {
                                    ...prev[activeSection.id],
                                    painPointIds: next,
                                  },
                                }
                              })
                            }}
                            className="h-4 w-4 accent-primary"
                          />
                          <span>{pain.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center"
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <h3 className="text-xl font-bold text-primary-deeper">Generating Results Engine Output</h3>
              <p className="max-w-lg text-sm text-slate-600">{statusMessage}</p>
            </motion.div>
          )}

          {submitted && !isLoading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <CheckCircle2 className="h-5 w-5" /> Diagnostic completed successfully
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Storage mode: {apiMode}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Final Score</p>
                  <p className="mt-2 text-4xl font-bold text-primary-deeper"><AnimatedPercent value={results.score} /></p>
                  <p className="mt-1 text-sm text-slate-600">Category: {results.category}</p>
                </article>
                <article className="rounded-xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Loss</p>
                  <p className="mt-2 text-3xl font-bold text-primary-deeper">${results.financialImpact.monthlyLoss.toLocaleString()}</p>
                  <p className="mt-1 text-sm text-slate-600">Annual: ${results.financialImpact.annualLoss.toLocaleString()}</p>
                </article>
                <article className="rounded-xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hours Lost / Month</p>
                  <p className="mt-2 text-3xl font-bold text-primary-deeper">{results.financialImpact.hoursLost.toLocaleString()}</p>
                  <p className="mt-1 text-sm text-slate-600">Based on team size and manual workload inputs</p>
                </article>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-xl border border-slate-200 p-5">
                  <h4 className="text-lg font-bold text-primary-deeper">Section Breakdown</h4>
                  <div className="mt-4 space-y-3">
                    {diagnosticSections.map((section) => {
                      const score = results.sectionScores[section.id].score
                      return (
                        <div key={section.id} className={`rounded-lg border px-3 py-2 ${sectionLabelClass(score)}`}>
                          <div className="flex items-center justify-between text-sm font-semibold">
                            <span>{section.code} - {section.title}</span>
                            <span>{Math.round(score)}%</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
                            <div className="h-full rounded-full bg-current" style={{ width: `${Math.round(score)}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </article>

                <article className="rounded-xl border border-slate-200 p-5">
                  <h4 className="text-lg font-bold text-primary-deeper">Insights</h4>
                  <div className="mt-4 rounded-lg border border-primary/20 bg-primary-light p-4">
                    <div className="flex items-center gap-2 text-primary-deeper">
                      <TrendingUp className="h-4 w-4" />
                      <p className="text-sm font-semibold">Main Insight</p>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{results.insights[0]}</p>
                    <p className="mt-2 text-sm text-slate-700">{results.insights[1]}</p>
                  </div>

                  <h5 className="mt-5 text-sm font-bold uppercase tracking-wider text-slate-600">Quick Win</h5>
                  <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    {results.quickWin}
                  </p>
                </article>
              </div>

              <article className="rounded-xl border border-slate-200 p-5">
                <h4 className="text-lg font-bold text-primary-deeper">Top 3 Critical Findings</h4>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {results.criticalFindings.map((item) => (
                    <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-rose-700">{item.severity}</p>
                      <p className="mt-2 text-sm text-slate-700">Impact: ${item.estimatedFinancialImpact.toLocaleString()} / year</p>
                      <p className="mt-2 text-sm text-slate-600">{item.recommendation}</p>
                    </div>
                  ))}
                </div>
              </article>

              <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
                <Link
                  href="/contact-us?topic=diagnostic#enquiry"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-dark"
                >
                  Book Strategy Call
                </Link>
                <a
                  href={`mailto:info@team.co.zw?subject=TEAM%20Diagnostic%20Report%20Request&body=${encodeURIComponent(`Please send my full diagnostic report.\n\nOrganisation: ${profile.organisation}\nFinal Score: ${results.score}%\nCategory: ${results.category}\nTop Priority: ${weakestFinding?.title ?? 'N/A'}`)}`}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
                >
                  Email Full Report
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {formError && (
          <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        )}

        {!submitted && !isLoading && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {stepIndex < totalSteps - 1 ? (
              <Button
                type="button"
                className="inline-flex items-center gap-2"
                onClick={() => {
                  if (!canContinueCurrentStep()) {
                    setFormError('Please complete required answers before continuing.')
                    return
                  }
                  setFormError('')
                  setStepIndex((prev) => Math.min(totalSteps - 1, prev + 1))
                }}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                className="inline-flex items-center gap-2"
                onClick={() => {
                  if (!canContinueCurrentStep()) {
                    setFormError('Please complete required answers before generating results.')
                    return
                  }
                  submitDiagnostic()
                }}
              >
                Generate Results
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
