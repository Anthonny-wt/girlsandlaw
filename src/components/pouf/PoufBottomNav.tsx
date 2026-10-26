import { useState, useEffect } from 'react';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

export function PoufBottomNav() {
  const [activeTab, setActiveTab] = useState<string>('trailer');
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].bottomNav;

  const tabs = [
    { id: 'trailer', label: t.trailer, href: '#trailer', icon: '🎬' },
    { id: 'temario', label: t.syllabus, href: '#temario', icon: '⚖️' },
    { id: 'fundadora', label: t.founder, href: '#fundadora', icon: '👑' },
    { id: 'precios', label: t.pricing, href: '#precios', icon: '💳' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['precios', 'fundadora', 'temario', 'trailer'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-white/95 backdrop-blur-md rounded-[28px] p-1.5 cushion-card border border-pink-100 grid grid-flow-col auto-cols-fr gap-1 shadow-2xl"
      aria-label="Navegación Móvil Rápida"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <a
            key={tab.id}
            href={tab.href}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-2 px-1 min-h-[50px] rounded-[20px] font-pouf text-[11px] font-black transition-all duration-150 active:translate-y-[2px] ${
              isActive
                ? 'bg-pink text-ink cushion-control-active'
                : 'text-muted hover:text-ink hover:bg-pink/20'
            }`}
          >
            <span className="text-base leading-none mb-1">{tab.icon}</span>
            <span className="leading-none">{tab.label}</span>
          </a>
        );
      })}

      <a
        href="#precios"
        onClick={() => setActiveTab('precios')}
        className="flex flex-col items-center justify-center py-2 px-1 min-h-[50px] rounded-[20px] font-pouf text-[11px] font-black bg-[#E31B6D] text-white cushion-control active:translate-y-[2px] transition-all"
      >
        <span className="text-base leading-none mb-1">✦</span>
        <span className="leading-none">{lang === 'es' ? 'Unirme' : 'Join'}</span>
      </a>
    </nav>
  );
}
