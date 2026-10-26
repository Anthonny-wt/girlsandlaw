interface LogoProps {
  className?: string;
  variant?: 'navbar' | 'footer';
}

export default function Logo({ className = '', variant = 'navbar' }: LogoProps) {
  return (
    <a href="/" className={`flex items-center gap-3 group shrink-0 ${className}`}>
      {/* Official Girls & Law Logo in WebP (No Background) */}
      <img
        src="/logogirlsandlaw-nobg.webp"
        alt="Logo Girls & Law"
        width="48"
        height="48"
        className="w-12 h-12 object-contain filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
        loading="eager"
      />

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
    </a>
  );
}
