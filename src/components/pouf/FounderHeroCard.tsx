import { useState } from 'react';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

interface FounderHeroCardProps {
  photoSrc?: string;
  name?: string;
  role?: string;
  bio?: string;
  className?: string;
}

export function FounderHeroCard({
  photoSrc = '/roxana.png',
  name = 'Roxana Rivera',
  role,
  bio,
  className = '',
}: FounderHeroCardProps) {
  const [liked, setLiked] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<number>(18420);
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].founderCard;

  const currentRole = role || t.role;
  const currentBio = bio || t.bio;

  const toggleLike = () => {
    setLiked(!liked);
    setFollowersCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div
      className={`relative w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[370px] mx-auto rounded-[30px] sm:rounded-[38px] bg-white cushion-card border border-pink-100 overflow-hidden transition-all duration-300 hover:translate-y-[-4px] select-none shadow-xl sm:shadow-2xl ${className}`}
    >
      {/* Top Photo Frame */}
      <div className="relative aspect-[4/4.2] sm:aspect-[4/4.6] w-full bg-gradient-to-b from-[#FFF0F6] to-[#FFE2ED] overflow-hidden">
        <img
          id="founder-photo"
          src={photoSrc}
          alt={`Foto de ${name}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
          loading="eager"
        />

        {/* Script Text on Top-Left */}
        <div className="absolute top-4 sm:top-5 left-4 sm:left-5 z-10 leading-tight">
          <p className="font-serif italic text-sm sm:text-base font-bold text-ink drop-shadow-xs">
            Good Law
          </p>
          <p className="font-serif italic text-xs sm:text-sm text-ink/90 drop-shadow-xs">
            Brighter Women
          </p>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-pill bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-[#E31B6D] border border-white/60 shadow-2xs">
            ✦ {t.tag}
          </span>
        </div>

        {/* Top-Right Floating Heart Button (interactive like count) */}
        <button
          type="button"
          onClick={toggleLike}
          aria-label={liked ? 'Quitar me gusta' : 'Dar me gusta'}
          className={`absolute top-4 sm:top-5 right-4 sm:right-5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
            liked
              ? 'bg-[#E31B6D] text-white scale-110'
              : 'bg-white/90 backdrop-blur-md text-[#E31B6D] hover:bg-white hover:scale-105'
          }`}
        >
          <svg className="w-4 h-4 fill-current transition-transform duration-200" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* EXACT ORGANIC WAVE BORDER: High rounded shoulder on left, gentle slope on right */}
        <div className="absolute -bottom-1 inset-x-0 pointer-events-none z-10 leading-none">
          <svg
            viewBox="0 0 360 85"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[60px] sm:h-[82px] text-white fill-current block"
          >
            <path d="M 0,52 C 0,20 28,0 65,0 C 135,0 230,36 360,55 L 360,85 L 0,85 Z" />
          </svg>
        </div>
      </div>

      {/* Bottom Card Body (White area with information) */}
      <div className="p-3.5 sm:p-6 pt-1 space-y-2.5 sm:space-y-4 text-left bg-white relative z-20">
        {/* Name with Verified Checkmark */}
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-serif font-black text-2xl text-ink leading-tight">
              {name}
            </h3>
            {/* Green Verified Badge */}
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shrink-0 shadow-2xs"
              title="Cuenta Verificada Oficial"
            >
              <svg className="w-3 h-3 fill-current stroke-current stroke-1" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>

          {/* Subtitle / Role */}
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E31B6D] mt-0.5 font-pouf">
            {currentRole}
          </p>
        </div>

        {/* Bio Copy */}
        <p className="text-xs font-bold text-muted leading-relaxed font-pouf">
          {currentBio}
        </p>

        {/* Stats Row with 3 Columns (+17K Seguidoras · 14+ Países · ★ 5.0) */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-2.5 sm:pt-3 pb-1.5 sm:pb-2 border-t border-pink-100 text-center font-pouf">
          <div>
            <p className="text-xs sm:text-sm font-black text-ink">
              +17K
            </p>
            <p className="text-[9.5px] sm:text-[10px] font-bold text-muted mt-0.5">{t.followers}</p>
          </div>
          <div className="border-x border-pink-100">
            <p className="text-xs sm:text-sm font-black text-ink">14+</p>
            <p className="text-[9.5px] sm:text-[10px] font-bold text-muted mt-0.5">{t.clinical}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black text-ink flex items-center justify-center gap-0.5">
              <span className="text-amber-400">★</span> 5.0
            </p>
            <p className="text-[9.5px] sm:text-[10px] font-bold text-muted mt-0.5">{t.rating}</p>
          </div>
        </div>

        {/* Follow / Connect CTA Button */}
        <div className="pt-0.5">
          <a
            href="https://instagram.com/roxanamriverag"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-pill bg-[#2D1E42] hover:bg-[#E31B6D] text-white font-pouf font-black text-xs flex items-center justify-center gap-2 transition-all duration-200 cushion-control active:cushion-control-active active:translate-y-[1px] group cursor-pointer"
          >
            <span>{t.cta}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1 font-mono">
              ⟶
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
