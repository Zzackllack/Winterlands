'use client';

import { useMemo } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperOptions } from 'swiper/types';
import 'swiper/css';

interface FeatureCarouselProps {
  features: Array<{
    title: string;
    summary: string;
    icon?: string;
  }>;
}

export default function FeatureCarousel({ features }: FeatureCarouselProps) {
  const options: SwiperOptions = useMemo(
    () => ({
      loop: true,
      autoplay: { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },
      speed: 750,
      spaceBetween: 24,
      slidesPerView: 1,
      breakpoints: {
        768: { slidesPerView: 2 },
      },
    }),
    [],
  );

  return (
    <Swiper
      {...options}
      modules={[Autoplay]}
      className="[&_.swiper-pagination-bullet-active]:bg-white/90"
    >
      {features.map((feature) => (
        <SwiperSlide key={feature.title}>
          <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">{feature.icon ?? '✽'}</p>
            <h3 className="mt-3 font-display text-2xl text-white">{feature.title}</h3>
            <p className="mt-2 text-white/70">{feature.summary}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
