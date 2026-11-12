import { useState, useEffect } from 'react';
import { getCourses, SEED_COURSES, type Course } from '@/lib/supabase';
import {
  BookOpen,
  Clock,
  Award,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  FileText,
  Users,
  Play,
  Layers,
  GraduationCap,
} from 'lucide-react';

// Habilidades / Tags predefinidas por categoría estilo Coursera
const COURSE_SKILLS: Record<string, string[]> = {
  Litigio: ['Teoría del Caso', 'Alegato de Apertura', 'Alegato de Clausura', 'Matrices Probatorias'],
  Oralidad: ['Técnica de Interrogatorio', 'Objeciones en 0.5s', 'Control de Testigos Hostiles', 'Presencia Escénica'],
  Redacción: ['Modelos Word Editables', 'Diseño Visual de Demandas', 'Síntesis Ejecutiva', 'Estrategia Fáctica'],
  'Marca & Negocio': ['Negociación de Honorarios', 'Captación de Clientes Premium', 'Posicionamiento LinkedIn', 'Propuestas de Servicios'],
  default: ['Metodología Clínica', 'Casos Reales', 'Plantillas Word', 'Certificación Oficial'],
};

export function PoufCoursesCatalog() {
  const [courses, setCourses] = useState<Course[]>(SEED_COURSES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const loaded = await getCourses();
        if (loaded && loaded.length > 0) {
          setCourses(loaded);
        }
      } catch {
        // fallback to seed courses
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Categorías dinámicas basadas en los cursos disponibles
  const categories = [
    { id: 'all', label: 'Todos los Cursos' },
    { id: 'Litigio', label: 'Litigio & Teoría del Caso' },
    { id: 'Oralidad', label: 'Oralidad & Audiencias' },
    { id: 'Redacción', label: 'Redacción Procesal' },
    { id: 'Marca & Negocio', label: 'Marca & Honorarios' },
  ];

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory === 'all') return true;
    const cat = c.category?.toLowerCase() || '';
    const target = selectedCategory.toLowerCase();
    return cat.includes(target) || target.includes(cat);
  });

  const getSkills = (course: Course): string[] => {
    const key = Object.keys(COURSE_SKILLS).find(
      (k) => course.category?.toLowerCase().includes(k.toLowerCase())
    );
    return key ? COURSE_SKILLS[key] : COURSE_SKILLS.default;
  };

  const handleEnrollClick = (courseId: string) => {
    window.location.href = `/dashboard?course=${encodeURIComponent(courseId)}`;
  };

  return (
    <section id="cursos" className="mt-14 sm:mt-20 scroll-mt-24">
      {/* Header Estilo Coursera con Identidad Girls & Law */}
      <div className="text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0F6] border border-pink-200/90 text-[#E31B6D] text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-2xs mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-[#E31B6D]" />
          <span>Catálogo Oficial de Formaciones Jurídicas</span>
        </div>
        <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-[#2A1828] leading-tight">
          Explora Nuestras Masterclasses &amp; Especializaciones
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6A5A6D] font-medium max-w-2xl mx-auto leading-relaxed">
          Cursos clínicos con casos reales, plantillas procesales en Word descargables y acompañamiento de alto nivel para juristas que buscan destacar con autoridad y autenticidad.
        </p>
      </div>

      {/* Barra de Filtros / Pestañas de Categoría (Pills estilo Coursera) */}
      <div className="mt-8 flex items-center justify-center gap-2 flex-wrap px-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count =
            cat.id === 'all'
              ? courses.length
              : courses.filter((c) =>
                  c.category?.toLowerCase().includes(cat.id.toLowerCase()) ||
                  cat.id.toLowerCase().includes(c.category?.toLowerCase() || '')
                ).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer select-none flex items-center gap-1.5 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-md shadow-[#E31B6D]/20 scale-105'
                  : 'bg-white hover:bg-[#FFF0F6] text-[#6A5A6D] hover:text-[#E31B6D] border border-pink-100 shadow-2xs'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/30 text-white' : 'bg-pink-100 text-[#E31B6D]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid de Cursos estilo Coursera */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
        {filteredCourses.map((course) => {
          const skills = getSkills(course);
          const price = course.price || 50;
          const comparePrice = course.compare_at_price || price * 1.6;
          const discountPct = Math.round(((comparePrice - price) / comparePrice) * 100);

          return (
            <div
              key={course.id}
              className="group bg-white rounded-3xl sm:rounded-[32px] border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] hover:shadow-[0_20px_48px_rgba(227,27,109,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden relative"
            >
              {/* Cover Image con Badges */}
              <div className="relative aspect-[16/9.5] w-full overflow-hidden bg-gradient-to-br from-[#FFF0F6] to-[#FFE2ED]">
                <img
                  src={course.cover_image || '/roxana.png'}
                  alt={course.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Gradient Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none" />

                {/* Badge Top Left: Categoría */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#E31B6D] text-[10px] font-black uppercase tracking-wider shadow-xs border border-pink-100">
                  {course.category || 'Masterclass'}
                </span>

                {/* Badge Top Right: Nivel */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1 border border-white/10">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{course.level || 'Clínico VIP'}</span>
                </span>

                {/* Discount Badge Bottom Right */}
                {discountPct > 0 && (
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-[#E31B6D] text-white text-[10px] font-black tracking-wide shadow-md">
                    -{discountPct}% DCTO
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Provider / Instructor Bar (Estilo Coursera: "Universidad / Empresa") */}
                  <div className="flex items-center gap-2">
                    <img
                      src="/logogirlsandlaw-nobg.webp"
                      alt="Girls & Law"
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-[11px] font-bold text-[#6A5A6D]">
                      Girls &amp; Law · <strong className="text-[#2A1828]">{course.instructor || 'Roxana Rivera'}</strong>
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3
                    onClick={() => setPreviewCourse(course)}
                    className="font-serif italic font-bold text-base sm:text-lg text-[#2A1828] line-clamp-2 leading-snug group-hover:text-[#E31B6D] transition-colors cursor-pointer"
                    title={course.title}
                  >
                    {course.title}
                  </h3>

                  {/* Course Description */}
                  <p className="text-xs text-[#6A5A6D] line-clamp-2 leading-relaxed font-normal">
                    {course.description ||
                      'Formación clínica especializada con lecciones en video HD y plantillas procesales en Word descargables.'}
                  </p>

                  {/* Coursera Skills Tags (Habilidades que desarrollarás) */}
                  <div className="pt-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#A08A9E] mb-1.5">
                      Habilidades clave:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-[#FFF5F9] border border-pink-100 text-[#E31B6D] text-[10px] font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Course Metadata Stats Row */}
                <div className="pt-3 border-t border-pink-100/80 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-[#6A5A6D]">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      <span>
                        <strong className="text-[#2A1828]">{course.rating || 4.9}</strong> ({course.students_count || 240}+)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Clock className="w-3.5 h-3.5 text-[#E31B6D] shrink-0" />
                      <span>{course.duration || '12 horas'}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{course.modules_count || 4} Módulos</span>
                    </div>
                  </div>

                  {/* Price & Action Button Bar */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <div>
                      {comparePrice > price && (
                        <span className="block text-[10px] text-[#A08A9E] line-through">
                          S/. {comparePrice} PEN
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif italic font-black text-xl sm:text-2xl text-[#E31B6D]">
                          S/. {price}
                        </span>
                        <span className="text-[10px] font-bold text-[#6A5A6D]">PEN</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewCourse(course)}
                        className="px-3 py-2 rounded-full border border-pink-200 hover:border-[#E31B6D] bg-white hover:bg-[#FFF0F6] text-[#2A1828] hover:text-[#E31B6D] text-xs font-bold transition-all cursor-pointer"
                      >
                        Temario
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEnrollClick(course.id)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:brightness-105 active:scale-95 text-white text-xs font-bold shadow-md shadow-[#E31B6D]/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <span>Inscribirme</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL INTERACTIVO DE DETALLES Y TEMARIO DEL CURSO */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[32px] border border-pink-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header con Portada */}
            <div className="relative aspect-[16/6] w-full bg-gradient-to-r from-[#2A1828] to-[#451B38] overflow-hidden">
              <img
                src={previewCourse.cover_image || '/roxana.png'}
                alt={previewCourse.title}
                className="w-full h-full object-cover opacity-35 object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setPreviewCourse(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#2A1828] backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E31B6D] text-[10px] font-black uppercase tracking-wider">
                  {previewCourse.category} · {previewCourse.level}
                </span>
                <h3 className="font-serif italic font-bold text-lg sm:text-2xl mt-1 line-clamp-2">
                  {previewCourse.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 flex-1">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#A08A9E]">
                  Descripción del Curso
                </h4>
                <p className="text-xs sm:text-sm text-[#2A1828] mt-1 leading-relaxed">
                  {previewCourse.description}
                </p>
              </div>

              {/* Qué incluye este curso */}
              <div className="p-4 rounded-2xl bg-[#FFF5F9] border border-pink-100 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#E31B6D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E31B6D]" />
                  <span>Lo que incluye esta formación</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2A1828]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#E31B6D]">✓</span> Acceso de por vida en el Campus
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E31B6D]">✓</span> Lecciones en video streaming HD
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E31B6D]">✓</span> Modelos y plantillas en Word
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E31B6D]">✓</span> Certificado acreditado Girls &amp; Law
                  </div>
                </div>
              </div>

              {/* Temario y Módulos */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#A08A9E] flex items-center justify-between">
                  <span>Estructura de Módulos &amp; Lecciones</span>
                  <span className="text-[#E31B6D] font-bold">
                    {previewCourse.modules?.length || previewCourse.modules_count || 3} Módulos
                  </span>
                </h4>

                <div className="space-y-2.5">
                  {(previewCourse.modules && previewCourse.modules.length > 0
                    ? previewCourse.modules
                    : [
                        {
                          id: 'm1',
                          title: 'Módulo 1: Fundamentos y Estrategia Procesal',
                          lessons: [
                            { id: 'l1', title: 'Clase 01: El Hecho Relevante', duration: '18 min' },
                            { id: 'l2', title: 'Clase 02: Matriz Fáctico-Jurídica en Word', duration: '24 min' },
                          ],
                        },
                        {
                          id: 'm2',
                          title: 'Módulo 2: Técnicas de Audiencia & Argumentación',
                          lessons: [
                            { id: 'l3', title: 'Clase 03: Estructura del Alegato', duration: '22 min' },
                            { id: 'l4', title: 'Clase 04: Preguntas Asertivas', duration: '25 min' },
                          ],
                        },
                      ]
                  ).map((mod, mIdx) => (
                    <div
                      key={mod.id || mIdx}
                      className="p-3.5 rounded-2xl bg-white border border-pink-100 shadow-2xs space-y-2"
                    >
                      <p className="text-xs font-bold text-[#2A1828] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FFF0F6] text-[#E31B6D] text-[10px] font-black flex items-center justify-center shrink-0">
                          {mIdx + 1}
                        </span>
                        <span>{mod.title}</span>
                      </p>
                      {mod.lessons && mod.lessons.length > 0 && (
                        <div className="pl-7 space-y-1">
                          {mod.lessons.map((les, lIdx) => (
                            <div
                              key={les.id || lIdx}
                              className="flex items-center justify-between text-[11px] text-[#6A5A6D]"
                            >
                              <span className="truncate pr-2">↳ {les.title}</span>
                              <span className="font-mono text-[10px] text-[#A08A9E] shrink-0">
                                {les.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer con Precio y CTA */}
            <div className="p-4 sm:p-5 bg-[#FFF9FB] border-t border-pink-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#A08A9E] uppercase font-bold block">
                  Precio de Acceso Total
                </span>
                <span className="font-serif italic font-black text-2xl text-[#E31B6D]">
                  S/. {previewCourse.price} PEN
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleEnrollClick(previewCourse.id)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#E31B6D]/20 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Inscribirme en esta Masterclass</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
