'use client';

import { useState } from 'react';
import { Sparkles, Bookmark, Award, ChevronRight } from 'lucide-react';

interface Pioneer {
  id: string;
  name: string;
  category: 'pop' | 'history';
  subtitle: string;
  highlight: string;
  avatarBg: string;
  initials: string;
}

const PIONEERS: Pioneer[] = [
  // Cultura Pop & Iconos
  {
    id: 'elle',
    name: 'Elle Woods',
    category: 'pop',
    subtitle: 'Harvard Law School',
    highlight: 'Demostró que la pasión por la moda y la brillantez jurídica conviven en total armonía.',
    avatarBg: 'bg-gradient-to-tr from-pink-500 to-rose-300 text-white',
    initials: 'EW',
  },
  {
    id: 'amal',
    name: 'Amal Clooney',
    category: 'pop',
    subtitle: 'Derecho Internacional & DDHH',
    highlight: 'Defensa implacable de libertades civiles en los tribunales más exigentes del mundo.',
    avatarBg: 'bg-gradient-to-tr from-purple-600 to-indigo-400 text-white',
    initials: 'AC',
  },
  {
    id: 'kim',
    name: 'Kim Wexler',
    category: 'pop',
    subtitle: 'Litigio & Estrategia Procesal',
    highlight: 'Rigor procesal incansable, autonomía y maestría en la argumentación técnica.',
    avatarBg: 'bg-gradient-to-tr from-amber-500 to-rose-400 text-white',
    initials: 'KW',
  },
  // Raíces & Primeras Pioneras Históricas
  {
    id: 'rbg',
    name: 'Ruth Bader Ginsburg',
    category: 'history',
    subtitle: 'Corte Suprema de los EE.UU.',
    highlight: 'Arquitecta legal de la igualdad de género y defensora de la disidencia constructiva.',
    avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white',
    initials: 'RB',
  },
  {
    id: 'mte',
    name: 'María Trinidad Enríquez',
    category: 'history',
    subtitle: 'Perú, 1878 · Primera jurista de Sudamérica',
    highlight: 'Abrió camino en la universidad y en las cortes cuando el derecho era exclusivo de hombres.',
    avatarBg: 'bg-gradient-to-tr from-fuchsia-600 to-pink-500 text-white',
    initials: 'MT',
  },
  {
    id: 'clara',
    name: 'Clara Campoamor',
    category: 'history',
    subtitle: 'España, 1931 · Sufragio & Constitución',
    highlight: 'Líder en los debates parlamentarios que consagraron el sufragio universal e igualitario.',
    avatarBg: 'bg-gradient-to-tr from-violet-600 to-purple-400 text-white',
    initials: 'CC',
  },
];

export default function HeritageCard() {
  const [activePioneer, setActivePioneer] = useState<Pioneer>(PIONEERS[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'pop' | 'history'>('all');

  const filteredPioneers =
    activeTab === 'all'
      ? PIONEERS
      : PIONEERS.filter((p) => p.category === activeTab);

  const popIcons = PIONEERS.filter((p) => p.category === 'pop');
  const historyPioneers = PIONEERS.filter((p) => p.category === 'history');

  return (
    <div className="w-full max-w-lg mx-auto rounded-[2.5rem] bg-[#191122] text-white p-6 sm:p-8 shadow-2xl border border-pink-500/20 relative overflow-hidden backdrop-blur-md">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Sparkles className="w-3 h-3 text-pink-400" />
              Girls &amp; Law Heritage
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold mt-2 tracking-tight text-white">
            Archivo de Inspiración
          </h3>
          <p className="text-xs text-pink-200/70 mt-1">
            Pioneras, juristas e iconos que marcaron precedentes
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <Bookmark className="w-4 h-4 text-pink-400" />
        </div>
      </div>

      {/* Active Feature Showcase */}
      <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-black/30 border border-pink-500/25 transition-all">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${activePioneer.avatarBg}`}
          >
            {activePioneer.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white truncate">
                {activePioneer.name}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-pink-200 shrink-0">
                {activePioneer.category === 'pop' ? 'Cultura Pop' : 'Pionera'}
              </span>
            </div>
            <p className="text-xs text-pink-300/80 truncate">
              {activePioneer.subtitle}
            </p>
          </div>
        </div>
        <p className="text-xs text-white/80 mt-2.5 italic leading-relaxed pl-1 border-l-2 border-pink-500">
          &ldquo;{activePioneer.highlight}&rdquo;
        </p>
      </div>

      {/* Group 1: Cultura Pop & Iconos */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-bold uppercase tracking-wider text-pink-300/90 text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            Cultura Pop &amp; Iconos
          </span>
          <span className="text-[10px] text-white/40">Ficción &amp; Contemporáneo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {popIcons.map((p) => {
            const isSelected = activePioneer.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePioneer(p)}
                className={`flex items-center sm:flex-col sm:items-center text-left sm:text-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pink-600/25 border-pink-400 text-white shadow-xs'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${p.avatarBg}`}
                >
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-tight truncate">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-pink-200/60 truncate mt-0.5">
                    {p.id === 'elle' ? 'Harvard Law' : p.id === 'amal' ? 'Int. Law' : 'Civil Lit.'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Group 2: Raíces & Primeras Pioneras Históricas */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-bold uppercase tracking-wider text-purple-300/90 text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Raíces &amp; Primeras Pioneras Históricas
          </span>
          <span className="text-[10px] text-white/40">Legado Real</span>
        </div>

        <div className="space-y-2">
          {historyPioneers.map((p) => {
            const isSelected = activePioneer.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePioneer(p)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-900/40 border-pink-400 text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${p.avatarBg}`}
                  >
                    {p.initials}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold leading-tight text-white">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-pink-200/60 mt-0.5">
                      {p.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-pink-400 translate-x-1' : 'text-white/30'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-pink-400" />
          Comunidad Activa en Latam
        </span>
        <span className="text-pink-300 font-medium">Girls &amp; Law 2026</span>
      </div>
    </div>
  );
}
