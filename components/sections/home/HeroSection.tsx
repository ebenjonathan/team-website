'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const TEAM_LABELS = ['TEAM Consulting', 'TEAM Wellness', 'TEAM Insights', 'TEAM RPA']

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
})

export function HeroSection() {
  const [labelIndex, setLabelIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setLabelIndex((i) => (i + 1) % TEAM_LABELS.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary-deeper">
      <div className="absolute inset-0">
        <Image
          src="/images/bg/abstract-bg-1.webp"
          alt=""
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-deeper via-primary-deeper/95 to-primary/20" />
      <div className="container mx-auto relative z-10 py-24">
        <div className="max-w-4xl">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={labelIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                >
                  {TEAM_LABELS[labelIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white leading-tight mb-6"
            {...fadeUp(0.15)}
          >
            We Are <span className="text-primary">Greater</span> Than Me
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl"
            {...fadeUp(0.28)}
          >
            TEAM Consulting is a dynamic professional services and management advisory group
            focused on helping organisations unlock full value in people, processes, and products
            to realise organisational significance.
          </motion.p>
          <motion.div className="flex flex-wrap items-center gap-4" {...fadeUp(0.4)}>
            <Link
              href="/free-diagnostic"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-base shadow-lg shadow-primary/30"
            >
              Get Free Diagnostic <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/service-offerings"
              className="inline-flex items-center gap-2 text-white border border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-base"
            >
              Explore Our Services
            </Link>
          </motion.div>

        </div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  )
}
