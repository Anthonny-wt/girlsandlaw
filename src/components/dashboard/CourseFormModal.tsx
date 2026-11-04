import { useState, useEffect } from 'react';
import type { Course } from '@/lib/supabase';
import { X, Image as ImageIcon, Sparkles, BookOpen, Clock, DollarSign, Award, Layers, Video } from 'lucide-react';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  courseToEdit?: Course | null;
}

const PRESET_COVERS = [
  {
    label: 'Sala de Tribunal Real',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Documentos & Vault Legal',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Biblioteca Jurídica Clásica',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Roxana Rivera / Abogada Líder',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  },
];

export function CourseFormModal({ isOpen, onClose, onSave, courseToEdit }: CourseFormModalProps) {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    slug: '',
    description: '',
    instructor: 'Roxana Rivera',
    price: 120,
    compare_at_price: 180,
    category: 'Litigio',
    level: 'Intermedio',
    modality: 'Asincrónico',
    duration: '8 horas',
    modules_count: 4,
    lessons_count: 14,
    students_count: 0,
    rating: 5.0,
    status: 'published',
    cover_image: PRESET_COVERS[0].url,
    trailer_url: '',
    featured: false,
  });

  useEffect(() => {
    if (courseToEdit) {
      setFormData(courseToEdit);
    } else {
      setFormData({
        id: `course-${Date.now()}`,
        title: '',
        slug: '',
        description: '',
        instructor: 'Roxana Rivera',
        price: 99,
        compare_at_price: 150,
        category: 'Litigio',
        level: 'Intermedio',
        modality: 'Asincrónico',
        duration: '8 horas',
        modules_count: 4,
        lessons_count: 12,
        students_count: 0,
        rating: 5.0,
        status: 'published',
        cover_image: PRESET_COVERS[0].url,
        trailer_url: '',
        featured: false,
      });
    }
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === undefined ? slug : prev.slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const courseToSubmit: Course = {
      id: formData.id || `course-${Date.now()}`,
      title: formData.title || 'Nuevo Curso',
      slug:
        formData.slug ||
        formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      description: formData.description || '',
      instructor: formData.instructor || 'Roxana Rivera',
      price: Number(formData.price) || 0,
      compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : undefined,
      category: (formData.category as Course['category']) || 'Litigio',
      level: (formData.level as Course['level']) || 'Intermedio',
      modality: (formData.modality as Course['modality']) || 'Asincrónico',
      duration: formData.duration || '6 horas',
      modules_count: Number(formData.modules_count) || 1,
      lessons_count: Number(formData.lessons_count) || 1,
      students_count: Number(formData.students_count) || 0,
      rating: Number(formData.rating) || 5.0,
      status: (formData.status as Course['status']) || 'published',
      cover_image: formData.cover_image || PRESET_COVERS[0].url,
      trailer_url: formData.trailer_url || '',
      featured: Boolean(formData.featured),
      created_at: formData.created_at || new Date().toISOString(),
      modules: courseToEdit?.modules || [],
    };

    onSave(courseToSubmit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(227,27,109,0.18)] border border-pink-100 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F6] border border-pink-200 flex items-center justify-center text-[#E31B6D]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif italic font-bold text-[#2A1828]">
                {courseToEdit ? 'Editar Masterclass' : 'Publicar Nuevo Curso'}
              </h2>
              <p className="text-xs font-bold text-[#6A5A6D]">
                {courseToEdit ? 'Actualiza los detalles y precio de venta' : 'Agrega una nueva masterclass al catálogo'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFF0F6] hover:bg-[#FFE0EB] text-[#2A1828] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Title & Slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider">
              Título de la Masterclass / Curso *
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej. Litigio Oral Estratégico en Juicios Civiles"
              className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider">
                Slug (URL limpia)
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="litigio-oral-estrategico"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider">
                Instructora / Docente
              </label>
              <input
                type="text"
                required
                value={formData.instructor || ''}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="Roxana Rivera"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider">
              Descripción del Curso
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Resume los beneficios clave, el enfoque y los resultados para las abogadas..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-medium text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
            />
          </div>

          {/* Category, Level, Modality */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#E31B6D]" /> Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as Course['category'] })
                }
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-xs focus:outline-none"
              >
                <option value="Litigio">Litigio</option>
                <option value="Oralidad">Oralidad</option>
                <option value="Penal">Penal</option>
                <option value="Negociación">Negociación</option>
                <option value="Marca Personal">Marca Personal</option>
                <option value="Corporativo">Corporativo</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#E31B6D]" /> Nivel
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value as Course['level'] })
                }
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-xs focus:outline-none"
              >
                <option value="Inicial">Inicial</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Clínico VIP">Clínico VIP</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#E31B6D]" /> Modalidad
              </label>
              <select
                value={formData.modality}
                onChange={(e) =>
                  setFormData({ ...formData, modality: e.target.value as Course['modality'] })
                }
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-xs focus:outline-none"
              >
                <option value="Asincrónico">Asincrónico</option>
                <option value="En Vivo">En Vivo</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
          </div>

          {/* Pricing (Venta de Cursos - Pago Único) & Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#E31B6D]" /> Precio Venta (USD)
              </label>
              <input
                type="number"
                min="0"
                value={formData.price ?? 99}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-black text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider">
                Antes (USD)
              </label>
              <input
                type="number"
                min="0"
                value={formData.compare_at_price ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, compare_at_price: Number(e.target.value) })
                }
                placeholder="150"
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-black text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider">
                Horas / Duración
              </label>
              <input
                type="text"
                value={formData.duration || '8 horas'}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#E31B6D]" /> Módulos
              </label>
              <input
                type="number"
                min="1"
                value={formData.modules_count ?? 4}
                onChange={(e) =>
                  setFormData({ ...formData, modules_count: Number(e.target.value) })
                }
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm"
              />
            </div>
          </div>

          {/* Video Trailer / Supabase Storage Video Path */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-[#E31B6D]" /> Video Trailer / URL Supabase Storage
            </label>
            <input
              type="text"
              value={formData.trailer_url || ''}
              onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
              placeholder="https://gfyqhlaytcrpbidgrijj.supabase.co/storage/v1/object/public/course-videos/... o URL mp4"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] text-xs font-mono"
            />
            <p className="text-[10px] text-[#6A5A6D]">
              Puedes pegar la URL directa de Supabase Storage o la ruta relativa dentro del bucket <code className="text-[#E31B6D] font-bold font-mono">course-videos</code>.
            </p>
          </div>

          {/* Cover Image & Presets */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#E31B6D]" /> Imagen de Portada (URL)
              </span>
              <span className="text-[10px] text-[#6A5A6D] normal-case font-bold">
                O elige una sugerida abajo
              </span>
            </label>
            <input
              type="url"
              value={formData.cover_image || ''}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] text-xs font-mono"
            />

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {PRESET_COVERS.map((preset) => (
                <button
                  type="button"
                  key={preset.url}
                  onClick={() => setFormData({ ...formData, cover_image: preset.url })}
                  className={`group relative aspect-video rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                    formData.cover_image === preset.url
                      ? 'border-[#E31B6D] ring-2 ring-[#E31B6D]/30 scale-102'
                      : 'border-pink-200/80 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-black text-white leading-tight truncate">
                      {preset.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status & Featured Toggle */}
          <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-[#FFF5F9] border border-pink-200/80 gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider">
                Estado:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'published' })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    formData.status === 'published'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-white text-[#6A5A6D] hover:text-[#2A1828]'
                  }`}
                >
                  ● Venta Activa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'draft' })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    formData.status === 'draft'
                      ? 'bg-amber-400 text-slate-900 shadow-xs'
                      : 'bg-white text-[#6A5A6D] hover:text-[#2A1828]'
                  }`}
                >
                  ○ Borrador
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(formData.featured)}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-[#E31B6D] accent-[#E31B6D] cursor-pointer"
              />
              <span className="text-xs font-bold text-[#2A1828]">Destacar en portada</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-[#6A5A6D] hover:text-[#2A1828] bg-white border border-pink-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)] transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              {courseToEdit ? 'Guardar Cambios' : 'Publicar Masterclass'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
