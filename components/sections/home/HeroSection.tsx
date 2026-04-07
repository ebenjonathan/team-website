'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
})

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary-deeper">
      <div className="absolute inset-0">
        <Image
          src="/images/bg/abstract-bg-1.webp"
          alt=""
          fill
          className="object-cover opacity-15"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-deeper via-primary-deeper/90 to-primary/30" />

      <div className="container mx-auto relative z-10 py-24">
        <div className="max-w-3xl">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-6 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Strategic Business Solutions
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white leading-tight mb-6"
            {...fadeUp(0.1)}
          >
            Transforming Ideas Into{' '}
            <span className="text-primary">Strategic Business</span> Solutions
          </motion.h1>

          <motion.p
            className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl"
            {...fadeUp(0.2)}
          >
            We partner with forward-thinking organisations to design, build, and scale digital
            experiences that drive measurable impact and lasting growth across Africa and beyond.
          </motion.p>

          <motion.div className="flex flex-wrap items-center gap-4" {...fadeUp(0.3)}>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-base"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/ideas-at-work"
              className="inline-flex items-center gap-2 text-white border border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-base"
            >
              <Play className="w-5 h-5" /> View Our Work
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '500+', label: 'Clients Served' },
              { value: '1,200+', label: 'Projects Delivered' },
              { value: '89%', label: 'Client Retention' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold font-heading text-primary">{stat.value}</p>
                <p className="text-sm text-white/60 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
