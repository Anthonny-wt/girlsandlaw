import { useState, useEffect } from 'react';

interface ToastData {
  id: number;
  name: string;
  location: string;
  plan: string;
  timeAgo: string;
  tone: 'pink' | 'purple' | 'yellow' | 'mint';
}

const NOTIFICATIONS: ToastData[] = [
  {
    id: 1,
    name: 'Valentina Morales',
    location: 'Bogotá, Colombia',
    plan: 'VIP Masterclass Experience',
    timeAgo: 'hace 3 min',
    tone: 'pink',
  },
  {
    id: 2,
    name: 'Dra. Camila Soto',
    location: 'Santiago, Chile',
    plan: 'Acceso Digital Pro',
    timeAgo: 'hace 11 min',
    tone: 'mint',
  },
  {
    id: 3,
    name: 'Andrea Quintana',
    location: 'Lima, Perú',
    plan: 'VIP Masterclass Experience',
    timeAgo: 'hace 24 min',
    tone: 'yellow',
  },
  {
    id: 4,
    name: 'Lic. Mariana Rivas',
    location: 'Ciudad de México',
    plan: 'VIP Masterclass Experience',
    timeAgo: 'hace 38 min',
    tone: 'purple',
  },
];

export function PoufToast() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    // Show first toast after 4 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 3500);

    // Rotate toast every 14 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 800);
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const current = NOTIFICATIONS[currentIndex];

  const toneBg = {
    pink: 'bg-pink',
    purple: 'bg-purple',
    yellow: 'bg-yellow',
    mint: 'bg-mint',
  }[current.tone];

  return (
    <aside
      aria-label="Notificación en vivo"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-[340px] pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div
        className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-[22px] text-ink font-pouf shadow-2xl ${toneBg}`}
        style={{
          boxShadow:
            'inset 0 -9px 0 rgba(0, 0, 0, 0.05), inset 0 6px 0 rgba(255, 255, 255, 0.5), 0 14px 30px rgba(58, 46, 92, 0.18)',
        }}
      >
        {/* Raised White Disc Icon */}
        <div
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-ink text-sm font-black"
          style={{
            boxShadow:
              'inset 0 -3px 0 rgba(0, 0, 0, 0.08), inset 0 2px 0 #fff, 0 3px 6px rgba(58, 46, 92, 0.22)',
          }}
        >
          ✦
        </div>

        {/* Text Body */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-ink leading-tight truncate">
            {current.name} <span className="text-[10px] font-bold opacity-75">({current.location})</span>
          </p>
          <p className="text-[11px] font-bold text-ink/80 mt-0.5 leading-snug">
            Se unió a <strong className="font-black text-[#E31B6D]">{current.plan}</strong>
          </p>
          <span className="text-[9px] font-black uppercase tracking-wider text-ink/60 mt-1 block">
            {current.timeAgo} · Vacantes limitadas
          </span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="w-7 h-7 rounded-full bg-white/60 hover:bg-white text-ink flex items-center justify-center shrink-0 cursor-pointer transition-colors text-xs font-black"
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
