import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, Quote } from 'lucide-react';
import Button from '@/components/ui/Button';
import HeritageCard from './HeritageCard';

export default function HeroSection() {
  return (
    <section id="inicio" className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#FCE7F1]/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FFF0F5]/80 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Tag / Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FCE7F1] border border-[#F8BBD0] text-xs font-bold uppercase tracking-wider text-[#9B004F]">
              <Sparkles className="w-3.5 h-3.5 text-[#E31B6D]" />
              <span>Comunidad Legal Femenina · Latam</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#16121E] leading-[1.12] tracking-tight">
              Comunidad de mujeres{' '}
              <span className="text-[#E31B6D] relative inline-block">
                multifacéticas
                <svg
                  className="absolute -bottom-1 left-0 w-full h-2 text-[#E31B6D]/30"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M1 5.5C40 2 160 2 199 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              en el derecho
            </h1>

            {/* Descriptive Body Text */}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Redefiniendo el ejercicio jurídico desde la autenticidad, la excelencia
              académica y la sororidad. Rompemos el estereotipo tradicional porque
              tu rigor profesional nunca ha estado peleado con tu estilo, tus pasiones y tu propia voz.
            </p>

            {/* Highlight Quote Box */}
            <div className="relative rounded-2xl bg-gradient-to-r from-[#FDF1F5] via-[#FFF5F8] to-white p-5 border border-[#F8BBD0] shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#E31B6D]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Quote className="w-4 h-4 text-[#E31B6D]" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif italic text-base sm:text-lg font-semibold text-[#16121E]">
                    &ldquo;Una girl multifacética no se rinde.&rdquo;
                  </p>
                  <p className="text-xs font-medium text-gray-500 tracking-wide uppercase">
                    — Manifiesto Girls &amp; Law
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons (Primary + Secondary) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="bg-[#E31B6D] hover:bg-[#C2185B] text-white shadow-lg shadow-[#E31B6D]/35 font-bold flex items-center justify-center gap-2 group"
              >
                <span>Únete al Movimiento</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Link
                href="#manifiesto"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-[#16121E]/15 hover:border-[#E31B6D] text-[#16121E] hover:text-[#E31B6D] font-bold text-sm transition-all duration-200 bg-white/70"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Manifiesto</span>
              </Link>
            </div>

            {/* Community Metrics Preview */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-8">
              <div>
                <p className="font-serif font-bold text-xl sm:text-2xl text-[#16121E]">
                  +5,000
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Abogadas y estudiantes
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="font-serif font-bold text-xl sm:text-2xl text-[#16121E]">
                  12+
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Embajadas universitarias
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="font-serif font-bold text-xl sm:text-2xl text-[#16121E]">
                  100%
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Sororidad y vocación
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Heritage Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <HeritageCard />
          </div>
        </div>
      </div>
    </section>
  );
}
