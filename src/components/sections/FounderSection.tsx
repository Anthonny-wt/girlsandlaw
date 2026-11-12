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

              {/* Avatar Character Photo */}
              <div className="flex-1 flex items-center justify-center my-4">
                <div className="relative w-52 h-68 mx-auto flex items-end justify-center">
                  <div className="absolute inset-0 bg-pink/25 rounded-full blur-2xl transform scale-95"></div>
                  <img
                    src="/roxana.png"
                    alt="Roxana Rivera"
                    className="w-full h-full object-contain relative z-10 drop-shadow-xl select-none"
                    loading="lazy"
                  />
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
