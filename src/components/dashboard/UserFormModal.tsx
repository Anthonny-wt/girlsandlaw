import { useState, useEffect } from 'react';
import type { UserProfile, UserRole, UserLevel } from '@/lib/supabase';
import { X, Sparkles, User, Mail, Lock, Phone, Shield, Award } from 'lucide-react';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    id?: string;
    email: string;
    full_name: string;
    password?: string;
    role: UserRole;
    level: UserLevel;
    phone?: string;
  }) => void;
  userToEdit?: UserProfile | null;
}

export function UserFormModal({ isOpen, onClose, onSave, userToEdit }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'alumna' as UserRole,
    level: 'inicial' as UserLevel,
    phone: '',
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        email: userToEdit.email || '',
        full_name: userToEdit.full_name || '',
        password: '',
        role: userToEdit.role || 'alumna',
        level: userToEdit.level || 'inicial',
        phone: userToEdit.phone || '',
      });
    } else {
      setFormData({
        email: '',
        full_name: '',
        password: '',
        role: 'alumna',
        level: 'inicial',
        phone: '',
      });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    onSave({
      id: userToEdit?.id,
      email: formData.email,
      full_name: formData.full_name || formData.email.split('@')[0],
      password: formData.password || undefined,
      role: formData.role,
      level: formData.level,
      phone: formData.phone,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-4 sm:p-8 shadow-[0_20px_60px_rgba(227,27,109,0.18)] border border-pink-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FFF0F6] border border-pink-200 flex items-center justify-center text-[#E31B6D] shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif italic font-bold text-[#2A1828]">
                {userToEdit ? 'Editar Cuenta de Usuario' : 'Crear Nueva Cuenta'}
              </h2>
              <p className="text-[11px] sm:text-xs font-bold text-[#6A5A6D]">
                {userToEdit
                  ? 'Modifica los permisos, rol y nivel de acceso'
                  : 'Registra una alumna, profesora o administradora'}
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
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#E31B6D]" /> Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Ej. Dra. Camila Soto"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40 transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#E31B6D]" /> Correo Electrónico
            </label>
            <input
              type="email"
              required
              disabled={Boolean(userToEdit)}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alumna@estudio.com"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40 transition-all disabled:opacity-60"
            />
          </div>

          {/* Password (only if creating new or optional update) */}
          {!userToEdit && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#E31B6D]" /> Contraseña Inicial
              </label>
              <input
                type="password"
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Contraseña segura (mín. 6 caracteres)"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40 transition-all"
              />
              <p className="text-[11px] text-[#A08A9E] font-medium">
                Si se deja en blanco se asignará la contraseña por defecto: <strong className="text-[#E31B6D] font-mono select-all">GirlsAndLaw2026!</strong>
              </p>
            </div>
          )}

          {/* Role & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#E31B6D]" /> Rol en la Plataforma
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
              >
                <option value="alumna">Alumna (Estudiante)</option>
                <option value="profesora">Profesora (Docente)</option>
                <option value="coordinadora">Coordinadora Académica (Sub Admin · Privilegios completos)</option>
                <option value="admin">Administradora General (Super Admin)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#E31B6D]" /> Nivel de Acceso
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as UserLevel })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
              >
                <option value="inicial">Inicial (Básico)</option>
                <option value="pro">Pro (Acceso 4K Completo)</option>
                <option value="vip">VIP (Clínicas &amp; Mentorías)</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#E31B6D]" /> Teléfono / WhatsApp (Opcional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+56 9 1234 5678"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40 transition-all"
            />
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
              {userToEdit ? 'Guardar Cambios' : 'Crear Cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
