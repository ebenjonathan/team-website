'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TestimonialCard } from '@/components/cards/TestimonialCard'
import { testimonials } from '@/lib/data/testimonials'

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-primary-light overflow-hidden">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="Testimonials"
          title="What Our Clients Say"
          subtitle="Real stories from real clients about the impact of our partnership."
        />
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
