import { useState, useEffect, useRef } from 'react';
import { sileo } from 'sileo';
import {
  uploadVideoToSupabaseStorage,
  isYouTubeUrl,
  getYouTubeEmbedUrl,
  getYouTubeVideoId,
  type Course,
} from '@/lib/supabase';
import {
  X,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Clock,
  DollarSign,
  Award,
  Layers,
  Video,
  Crown,
  UploadCloud,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Loader2,
  FileVideo,
} from 'lucide-react';

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
    price: 50,
    compare_at_price: 120,
    currency: 'PEN',
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

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i)) {
      sileo.error({
        title: 'Formato no soportado',
        description: 'Por favor selecciona un archivo de video válido (MP4, MOV o WebM).',
      });
      return;
    }

    if (file.size > 1024 * 1024 * 1024) {
      sileo.error({
        title: 'Archivo demasiado pesado',
        description: 'El tamaño máximo permitido para video es de 1 GB.',
      });
      return;
    }

    setIsUploadingVideo(true);
    setUploadedFileName(file.name);
    try {
      const folder = formData.slug || formData.id || 'trailers';
      const result = await uploadVideoToSupabaseStorage(file, `courses/${folder}`);
      setFormData((prev) => ({
        ...prev,
        trailer_url: result.url,
      }));
      sileo.success({
        title: '¡Video subido con éxito!',
        description: `"${file.name}" se guardó con éxito para el curso.`,
      });
    } catch {
      sileo.error({
        title: 'Error al subir video',
        description: 'No se pudo subir el archivo. Intenta de nuevo.',
      });
    } finally {
      setIsUploadingVideo(false);
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = '';
      }
    }
  };

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
      modules:
        courseToEdit?.modules && courseToEdit.modules.length > 0
          ? courseToEdit.modules
          : [
              {
                id: `mod-${formData.id || Date.now()}-1`,
                course_id: formData.id || `course-${Date.now()}`,
                title: 'Módulo 1: Fundamentos y Estrategia Procesal',
                description: 'Lecciones clínicas, teoría del caso y jurisprudencia aplicable.',
                order_index: 1,
                lessons: [
                  {
                    id: `les-${formData.id || Date.now()}-1`,
                    module_id: `mod-${formData.id || Date.now()}-1`,
                    course_id: formData.id || `course-${Date.now()}`,
                    title: `Clase 01: Introducción a ${formData.title || 'la Masterclass'}`,
                    duration: formData.duration || '15 min',
                    video_url:
                      formData.trailer_url ||
                      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                    order_index: 1,
                    is_free_preview: true,
                    notes: 'Clase clínica introductoria con análisis procesal y descarga de matrices.',
                  },
                ],
              },
            ],
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

          {/* Plan Requerido, Categoría, Modalidad, Duración, Módulos */}
          <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-pink-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#E31B6D]" /> Plan de Membresía Requerido para este Curso
              </label>
              <span className="text-[10px] font-bold text-[#E31B6D] bg-white px-2.5 py-0.5 rounded-full border border-pink-200">
                Modelo por Suscripción
              </span>
            </div>
            <p className="text-[11px] text-[#6A5A6D] leading-relaxed">
              Las alumnas acceden a los cursos según su suscripción activa. No necesitas fijar precios individuales para cada video.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.level === 'Inicial'
                    ? 'bg-white border-[#E31B6D] ring-2 ring-[#E31B6D]/20 shadow-xs'
                    : 'bg-white/70 border-pink-100 hover:border-pink-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2A1828]">Plan Base</span>
                  <input
                    type="radio"
                    name="membership_level"
                    checked={formData.level === 'Inicial'}
                    onChange={() => setFormData({ ...formData, level: 'Inicial' })}
                    className="accent-[#E31B6D]"
                  />
                </div>
                <p className="text-[10px] text-[#A08A9E] mt-1">
                  Disponible para todas las suscriptoras desde el Plan Base.
                </p>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.level === 'Intermedio' || formData.level === 'Avanzado'
                    ? 'bg-white border-[#E31B6D] ring-2 ring-[#E31B6D]/20 shadow-xs'
                    : 'bg-white/70 border-pink-100 hover:border-pink-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2A1828]">Plan Full (Pro)</span>
                  <input
                    type="radio"
                    name="membership_level"
                    checked={formData.level === 'Intermedio' || formData.level === 'Avanzado'}
                    onChange={() => setFormData({ ...formData, level: 'Intermedio' })}
                    className="accent-[#E31B6D]"
                  />
                </div>
                <p className="text-[10px] text-[#A08A9E] mt-1">
                  Desbloqueado para Plan Full y Plan Ultra.
                </p>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.level === 'Clínico VIP'
                    ? 'bg-white border-[#E31B6D] ring-2 ring-[#E31B6D]/20 shadow-xs'
                    : 'bg-white/70 border-pink-100 hover:border-pink-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2A1828]">Plan Ultra (VIP)</span>
                  <input
                    type="radio"
                    name="membership_level"
                    checked={formData.level === 'Clínico VIP'}
                    onChange={() => setFormData({ ...formData, level: 'Clínico VIP' })}
                    className="accent-[#E31B6D]"
                  />
                </div>
                <p className="text-[10px] text-[#A08A9E] mt-1">
                  Exclusivo para suscriptoras VIP con Mentoría de Roxana.
                </p>
              </label>
            </div>
          </div>

          {/* Categoría, Modalidad, Duración, Módulos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] sm:text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1">
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
              <label className="text-[11px] sm:text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1">
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

            <div className="space-y-1.5">
              <label className="text-[11px] sm:text-xs font-black text-[#2A1828] uppercase tracking-wider">
                Duración
              </label>
              <input
                type="text"
                value={formData.duration || '8 horas'}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ej: 8 horas"
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] sm:text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1">
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

          {/* Subir Video Trailer / YouTube No Listado */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#E31B6D]" /> Video Trailer / Clase (YouTube No Listado o Enlace)
              </label>
              <span className="text-[10px] font-bold text-[#A08A9E]">
                YouTube Unlisted <strong className="text-emerald-600 font-mono">(Recomendado)</strong>
              </span>
            </div>

            {/* Input para Enlace de YouTube 'No listado' (Recomendado) */}
            <div className="p-4 rounded-2xl bg-[#FFF9FB] border border-pink-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-[#2A1828] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Enlace de YouTube en modo &apos;No listado&apos; (Recomendado)</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Gratis &amp; Sin Límite de MB
                </span>
              </div>
              <p className="text-[11px] text-[#6A5A6D] leading-relaxed">
                Pega el link de YouTube en modo &quot;No listado&quot; (ej: <code className="font-mono text-[#E31B6D]">https://youtu.be/...</code> o <code className="font-mono text-[#E31B6D]">https://www.youtube.com/watch?v=...</code>). Reproduce de inmediato en alta definición y sin límites de peso.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.trailer_url || ''}
                  onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value.trim() })}
                  placeholder="https://youtu.be/..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-[#2A1828] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
                />
                {formData.trailer_url && isYouTubeUrl(formData.trailer_url) && (
                  <span className="px-2.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
                    ✓ ID Válido
                  </span>
                )}
              </div>
            </div>

            {/* Input nativo oculto para subida de archivos opcional */}
            <input
              type="file"
              ref={videoFileInputRef}
              accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.mov,.webm,.mkv"
              onChange={handleVideoFileChange}
              className="hidden"
            />

            {/* Si ya hay un video cargado o se pegó un link de YouTube */}
            {formData.trailer_url ? (
              <div className="p-4 rounded-2xl bg-[#FFF5F9] border border-pink-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isYouTubeUrl(formData.trailer_url) ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span>YouTube &apos;No listado&apos; Configurado</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Video Guardado en la Plataforma</span>
                      </span>
                    )}
                    {uploadedFileName && (
                      <span className="text-[11px] font-mono font-bold text-[#2A1828] truncate max-w-xs">
                        {uploadedFileName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isUploadingVideo}
                      onClick={() => videoFileInputRef.current?.click()}
                      className="px-3 py-1 rounded-full bg-white hover:bg-pink-100/70 border border-pink-200 text-[#E31B6D] text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Subir MP4</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, trailer_url: '' }));
                        setUploadedFileName('');
                      }}
                      className="p-1 rounded-full text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Quitar video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reproductor de previsualización: YouTube iframe o Video HTML5 */}
                <div className="rounded-2xl overflow-hidden bg-black aspect-video relative shadow-inner">
                  {isYouTubeUrl(formData.trailer_url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(formData.trailer_url)!}
                      title="YouTube Preview"
                      className="w-full h-full aspect-video border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={formData.trailer_url}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      Tu navegador no soporta reproducción de video.
                    </video>
                  )}
                </div>

                {/* Alternar visualización de URL directa */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    className="text-[10px] font-bold text-[#6A5A6D] hover:text-[#E31B6D] underline cursor-pointer"
                  >
                    {showManualUrl ? 'Ocultar URL directa' : 'Ver / Editar URL completa'}
                  </button>
                  {showManualUrl && (
                    <input
                      type="text"
                      value={formData.trailer_url || ''}
                      onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                      placeholder="https://youtu.be/... o URL de video directa"
                      className="mt-1.5 w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-[#2A1828] text-xs font-mono"
                    />
                  )}
                </div>
              </div>
            ) : (
              /* Dropzone para subir video */
              <div
                onClick={() => !isUploadingVideo && videoFileInputRef.current?.click()}
                className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
                  isUploadingVideo
                    ? 'bg-[#FFF0F6] border-[#E31B6D]'
                    : 'bg-[#FFF9FB] border-pink-200 hover:border-[#E31B6D] hover:bg-[#FFF0F6]/50'
                }`}
              >
                {isUploadingVideo ? (
                  <>
                    <Loader2 className="w-8 h-8 text-[#E31B6D] animate-spin" />
                    <div>
                      <p className="text-xs font-bold text-[#E31B6D]">
                        Subiendo archivo de video...
                      </p>
                      <p className="text-[10px] text-[#6A5A6D]">
                        {uploadedFileName || 'Procesando archivo...'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF0F6] border border-pink-200 flex items-center justify-center text-[#E31B6D] shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#2A1828]">
                        Haz clic aquí para seleccionar y subir video desde tu equipo
                      </p>
                      <p className="text-[10px] text-[#6A5A6D] mt-0.5">
                        Formatos soportados: MP4, MOV o WebM · Hasta 1 GB · Reproducción rápida
                      </p>
                    </div>
                    <span className="mt-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white text-[11px] font-bold shadow-xs">
                      Seleccionar Archivo de Video
                    </span>
                  </>
                )}
              </div>
            )}

            {!formData.trailer_url && !isUploadingVideo && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[10px] font-bold text-[#6A5A6D] hover:text-[#E31B6D] underline cursor-pointer"
                >
                  {showManualUrl ? 'Ocultar campo de URL' : 'O pegar URL directa de video / CDN'}
                </button>
                {showManualUrl && (
                  <input
                    type="text"
                    value={formData.trailer_url || ''}
                    onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                    placeholder="https://... enlace directo a video .mp4"
                    className="mt-1.5 w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-[#2A1828] text-xs font-mono"
                  />
                )}
              </div>
            )}
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
