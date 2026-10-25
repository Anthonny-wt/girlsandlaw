import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'navbar' | 'footer';
}

export default function Logo({ className = '', variant = 'navbar' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group shrink-0 ${className}`}>
      {/* Emblem with double circular ring and scales of justice */}
      <div className="relative w-11 h-11 rounded-full p-0.5 border border-girls-pink/40 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <div className="w-full h-full rounded-full border border-girls-pink/70 flex items-center justify-center bg-white shadow-xs">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-girls-pink stroke-[2]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Center Pillar */}
            <path d="M12 3v17" />
            <path d="M7 21h10" />
            <path d="M12 3l-7 4" />
            <path d="M12 3l7 4" />
            {/* Left Pan */}
            <path d="M2.5 11l2.5-4 2.5 4a2.5 2.5 0 0 1-5 0z" />
            {/* Right Pan */}
            <path d="M16.5 11l2.5-4 2.5 4a2.5 2.5 0 0 1-5 0z" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-bold text-lg leading-tight tracking-tight ${
            variant === 'footer' ? 'text-white' : 'text-girls-dark'
          }`}
        >
          Girls <span className="text-girls-pink italic">&amp;</span> Law
        </span>
        <span className="text-[9px] font-bold tracking-[0.22em] text-girls-pink uppercase leading-none mt-0.5">
          Comunidad Legal
        </span>
      </div>
    </Link>
  );
}
