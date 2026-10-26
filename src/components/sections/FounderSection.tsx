import { InstagramIcon } from '@/components/ui/SocialIcons';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

export function FounderSection() {
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].founderSection;

  return (
    <section id="fundadora" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Pouf Cushion Card */}
      <div className="bg-white rounded-card p-6 sm:p-10 lg:p-14 border border-pink-200/80 cushion-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Phone Mockup White/Pink Card with POUF cushion */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[320px] rounded-[36px] bg-gradient-to-b from-[#FFF5F9] via-[#FFFFFF] to-[#FFF0F6] border-2 border-pink-200/80 p-5 cushion-card relative overflow-hidden flex flex-col justify-between min-h-[480px]">
              {/* Phone Top Notch / Speaker Detail */}
              <div className="flex justify-center mb-3">
                <div className="w-20 h-1.5 bg-pink/40 rounded-full"></div>
              </div>

              {/* Avatar Character Illustration */}
              <div className="flex-1 flex items-center justify-center my-4">
                <div className="relative w-44 h-56 mx-auto flex items-end justify-center">
                  <div className="absolute inset-0 bg-pink/20 rounded-full blur-2xl transform scale-90"></div>
                  <svg
                    viewBox="0 0 200 240"
                    className="w-full h-full relative z-10 drop-shadow-xl"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Hair - Back layer */}
                    <path
                      d="M60 90C60 48 80 32 100 32C120 32 140 48 140 90C140 120 135 130 130 135C125 125 122 110 122 100C122 80 115 50 100 50C85 50 78 80 78 100C78 110 75 125 70 135C65 130 60 120 60 90Z"
                      fill="#231F20"
                    />
                    {/* Neck */}
                    <rect x="91" y="110" width="18" height="25" rx="4" fill="#F4BA9D" />
                    {/* Head / Face */}
                    <ellipse cx="100" cy="85" rx="28" ry="32" fill="#F8CBB0" />
                    {/* Front Hair Bob Style with Parting */}
                    <path
                      d="M72 82C72 50 82 42 100 42C118 42 128 50 128 82C128 95 125 106 122 108C120 95 116 74 100 74C86 74 80 95 78 108C75 106 72 95 72 82Z"
                      fill="#1C1819"
                    />
                    {/* Pearl Earrings */}
                    <circle cx="73" cy="92" r="3.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                    <circle cx="127" cy="92" r="3.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                    {/* Eyebrows */}
                    <path d="M84 76C87 74 92 75 94 77" stroke="#2D1C1B" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M106 77C108 75 113 74 116 76" stroke="#2D1C1B" strokeWidth="2.2" strokeLinecap="round" />
                    {/* Eyes */}
                    <circle cx="89" cy="84" r="3.2" fill="#241B18" />
                    <circle cx="111" cy="84" r="3.2" fill="#241B18" />
                    <circle cx="88" cy="83" r="1" fill="#FFFFFF" />
                    <circle cx="110" cy="83" r="1" fill="#FFFFFF" />
                    {/* Nose */}
                    <path d="M100 85v6c1 1 2 0 2 0" stroke="#E29F7C" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Smiling Lips */}
                    <path
                      d="M93 99C96 103 104 103 107 99"
                      stroke="#D84A6E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Lawyer Judicial Robe */}
                    <path
                      d="M48 230C50 170 65 145 78 135L92 142L100 148L108 142L122 135C135 145 150 170 152 230H48Z"
                      fill="#2D1E42"
                    />
                    {/* Scalloped White Lace Collar */}
                    <path
                      d="M80 134C82 145 88 152 92 152C96 152 98 146 100 148C102 146 104 152 108 152C112 152 118 145 120 134L114 130C108 138 104 140 100 140C96 140 92 138 86 130L80 134Z"
                      fill="#FFFFFF"
                    />
                    <circle cx="94" cy="144" r="1.5" fill="#E2E8F0" />
                    <circle cx="100" cy="144" r="1.5" fill="#E2E8F0" />
                    <circle cx="106" cy="144" r="1.5" fill="#E2E8F0" />
                    {/* Gavel in hand */}
                    <path
                      d="M136 170C142 165 148 160 152 155"
                      stroke="#F8CBB0"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    <circle cx="152" cy="154" r="5" fill="#F8CBB0" />
                    <line
                      x1="148"
                      y1="168"
                      x2="158"
                      y2="135"
                      stroke="#854D27"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <g transform="rotate(22 160 135)">
                      <rect x="150" y="128" width="18" height="10" rx="2" fill="#583115" />
                      <rect x="148" y="126" width="3" height="14" rx="1" fill="#C99458" />
                      <rect x="167" y="126" width="3" height="14" rx="1" fill="#C99458" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Bottom Founder Identity */}
              <div className="pt-2 text-left">
                <span className="inline-block px-3 py-1 rounded-pill text-[10px] font-black uppercase tracking-widest bg-pink text-ink cushion-control">
                  {t.badgeRole}
                </span>
                <h3 className="font-serif text-2xl font-black text-ink mt-2 leading-tight tracking-tight">
                  {t.name}
                </h3>
                <p className="text-[#E31B6D] text-xs mt-0.5 font-bold">
                  @roxanamriverag
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Leadership Quote & Vision */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#E31B6D]">
                {t.badge}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.15]">
              {t.title}
            </h2>

            <div className="border-l-4 border-pink pl-5 sm:pl-7 py-1">
              <blockquote className="font-serif text-base sm:text-lg lg:text-xl text-ink/90 italic leading-relaxed">
                {t.quote}
              </blockquote>
            </div>

            <div className="space-y-0.5 pt-1">
              <h4 className="font-black text-base text-ink font-pouf">
                {t.name}
              </h4>
              <p className="text-xs sm:text-sm text-muted font-bold font-pouf">
                {t.role}
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://instagram.com/roxanamriverag"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-control text-sm font-black bg-pink text-ink cushion-control active:cushion-control-active transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>{t.cta}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
