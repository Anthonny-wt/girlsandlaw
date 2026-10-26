import { useState, useEffect } from 'react';

interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

const TABS: TabItem[] = [
  { id: 'trailer', label: 'Trailer', href: '#trailer', icon: '🎬' },
  { id: 'temario', label: 'Temario', href: '#temario', icon: '⚖️' },
  { id: 'fundadora', label: 'Roxana', href: '#fundadora', icon: '👑' },
  { id: 'precios', label: 'Precios', href: '#precios', icon: '💳' },
];

export function PoufBottomNav() {
  const [activeTab, setActiveTab] = useState<string>('trailer');

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
      {TABS.map((tab) => {
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
        <span className="leading-none">Unirme</span>
      </a>
    </nav>
  );
}
