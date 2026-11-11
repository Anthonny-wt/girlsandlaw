import { useState, useEffect } from 'react';
import { sileo } from 'sileo';
import type { Student, Course, Enrollment, UserLevel, UserRole } from '@/lib/supabase';
import {
  X,
  User,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Trash2,
  Plus,
  Shield,
  Crown,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Layers,
} from 'lucide-react';

interface StudentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  courses: Course[];
  userEnrollments: Enrollment[];
  onEnrollInCourse: (userId: string, courseId: string) => Promise<void>;
  onRevokeEnrollment: (enrollmentId: string) => Promise<void>;
  onUpdateProfile: (
    userId: string,
    data: { level: UserLevel; role: UserRole; full_name?: string; phone?: string }
  ) => Promise<void>;
}

export function StudentSettingsModal({
  isOpen,
  onClose,
  student,
  courses,
  userEnrollments,
  onEnrollInCourse,
  onRevokeEnrollment,
  onUpdateProfile,
}: StudentSettingsModalProps) {
  if (!isOpen || !student) return null;

  const studentUserId = student.user_id || student.id;
  const studentEnrollments = userEnrollments.filter((e) => e.user_id === studentUserId);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [level, setLevel] = useState<UserLevel>(student.level || 'inicial');
  const [role, setRole] = useState<UserRole>(student.role || 'alumna');
  const [fullName, setFullName] = useState(student.name || '');
  const [phone, setPhone] = useState(student.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setLevel(student.level || 'inicial');
      setRole(student.role || 'alumna');
      setFullName(student.name || '');
      setPhone(student.phone || '');
      setSelectedCourseId('');
    }
  }, [student, isOpen]);

  // Cursos disponibles para asignar (que la alumna no tenga ya)
  const enrolledCourseIds = new Set(studentEnrollments.map((e) => e.course_id));
  const availableCourses = courses.filter((c) => !enrolledCourseIds.has(c.id));

  const handleAssignCourse = async () => {
    if (!selectedCourseId) {
      sileo.warning({ title: 'Selecciona un curso', description: 'Elige un curso del catálogo para asignar.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await onEnrollInCourse(studentUserId, selectedCourseId);
      sileo.success({
        title: 'Curso Asignado',
        description: `Se otorgó acceso inmediato a la masterclass a ${student.name}.`,
      });
      setSelectedCourseId('');
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo asignar el curso.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (enrollmentId: string, courseTitle: string) => {
    if (!confirm(`¿Estás segura de revocar el acceso a "${courseTitle}" para esta alumna?`)) return;
    setIsSubmitting(true);
    try {
      await onRevokeEnrollment(enrollmentId);
      sileo.info({
        title: 'Acceso Revocado',
        description: `Se retiró el acceso a la masterclass.`,
      });
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo revocar la matrícula.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateProfile(studentUserId, {
        level,
        role,
        full_name: fullName,
        phone,
      });
      sileo.success({
        title: 'Ajustes Guardados',
        description: `La configuración de ${fullName} se actualizó correctamente.`,
      });
      onClose();
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo guardar la configuración.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-8 shadow-[0_20px_60px_rgba(227,27,109,0.18)] border border-pink-100 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-[#E31B6D] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-md shadow-pink-500/20">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif italic font-bold text-[#2A1828]">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#E31B6D] text-[10px] font-black uppercase">
                  {role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  Nivel {level}
                </span>
              </div>
              <p className="text-xs text-[#6A5A6D] flex items-center gap-2 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[#A08A9E]" />
                <span>{student.email}</span>
                {student.enrolled_at && (
                  <>
                    <span>·</span>
                    <Calendar className="w-3.5 h-3.5 text-[#A08A9E]" />
                    <span>Registrada: {student.enrolled_at}</span>
                  </>
                )}
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

        {/* Section 1: Gestión de Cursos y Accesos de la Alumna */}
        <div className="p-5 rounded-3xl bg-[#FFF9FB] border border-pink-100/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#E31B6D]" />
              <h3 className="font-serif italic font-bold text-base text-[#2A1828]">
                Masterclasses Asignadas
              </h3>
            </div>
            <span className="text-xs font-bold text-[#E31B6D] bg-pink-100/80 px-3 py-1 rounded-full">
              {studentEnrollments.length} {studentEnrollments.length === 1 ? 'Curso' : 'Cursos'}
            </span>
          </div>

          {/* List of current enrollments */}
          <div className="space-y-2.5">
            {studentEnrollments.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white border border-pink-100 text-center">
                <p className="text-xs text-[#A08A9E] italic">
                  Esta alumna no tiene cursos asignados todavía. Asigna uno abajo.
                </p>
              </div>
            ) : (
              studentEnrollments.map((enr) => {
                const course = courses.find((c) => c.id === enr.course_id);
                return (
                  <div
                    key={enr.id}
                    className="p-3.5 rounded-2xl bg-white border border-pink-100 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#E31B6D] shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif italic font-bold text-xs text-[#2A1828] truncate">
                          {course?.title || `Curso ID: ${enr.course_id}`}
                        </p>
                        <p className="text-[10px] text-[#A08A9E]">
                          Método: <strong className="uppercase">{enr.payment_method}</strong> · Pago: S/. {enr.amount_paid} PEN · Progreso: {enr.progress_percent}%
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRevoke(enr.id, course?.title || 'este curso')}
                      className="px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      title="Revocar acceso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Revocar</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Assign Course Dropdown */}
          <div className="pt-2 border-t border-pink-100/80">
            <label className="block text-[11px] font-black uppercase text-[#E31B6D] tracking-wider mb-2">
              + Asignar / Desbloquear Nueva Masterclass
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                disabled={isSubmitting || availableCourses.length === 0}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-pink-200 text-xs font-medium text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
              >
                <option value="">
                  {availableCourses.length === 0
                    ? 'La alumna ya tiene todos los cursos asignados'
                    : '-- Selecciona una masterclass para asignar --'}
                </option>
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} (S/. {c.price} PEN)
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAssignCourse}
                disabled={!selectedCourseId || isSubmitting}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white text-xs font-bold shadow-xs hover:brightness-105 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Asignar Acceso</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Configuración de Nivel, Rol y Datos de la Alumna */}
        <form onSubmit={handleSaveProfileSettings} className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-pink-100">
            <Shield className="w-4 h-4 text-[#E31B6D]" />
            <h3 className="font-serif italic font-bold text-base text-[#2A1828]">
              Settings de Cuenta &amp; Privilegios
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2A1828] mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-xs font-medium text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1828] mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+51 987654321"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-xs font-medium text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1828] mb-1">
                Nivel de Membresía
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as UserLevel)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-xs font-medium text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
              >
                <option value="inicial">Inicial (Acceso individual a compras)</option>
                <option value="pro">Pro (Plan Full - Cursos + Meet)</option>
                <option value="vip">VIP (Acceso Total a todo el catálogo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1828] mb-1">
                Rol en la Plataforma
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-xs font-medium text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
              >
                <option value="alumna">Alumna (Estudiante)</option>
                <option value="sub_admin">Sub Admin (Coordinadora)</option>
                <option value="profesora">Profesora (Docente)</option>
                <option value="admin">Administrador General</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-pink-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-[#6A5A6D] hover:bg-pink-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)] transition-all cursor-pointer disabled:opacity-50"
            >
              Guardar Settings de Alumna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
