import { useState } from 'react';
import { sileo } from 'sileo';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface AuthCardProps {
  onSuccess: (user: User) => void;
}

export function AuthCard({ onSuccess }: AuthCardProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session && data.user) {
          sileo.success({
            title: '¡Cuenta creada con éxito!',
            description: 'Bienvenida al Campus de Girls & Law',
          });
          onSuccess(data.user);
        } else {
          const msg =
            '¡Registro recibido! Revisa tu bandeja de entrada o spam para verificar tu cuenta antes de iniciar sesión.';
          setInfoMessage(msg);
          sileo.info({
            title: 'Registro recibido',
            description: 'Revisa tu bandeja para confirmar tu correo',
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          sileo.success({
            title: '¡Bienvenida!',
            description: 'Acceso verificado en el Campus Virtual',
          });
          onSuccess(data.user);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al autenticar';
      const formatted =
        msg === 'Invalid login credentials'
          ? 'Credenciales incorrectas. Verifica tu correo y contraseña registrados.'
          : msg;
      setErrorMessage(formatted);
      sileo.error({
        title: 'Error de acceso',
        description: formatted,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    setLoading(true);

    sileo.info({
      title: 'Conectando con Google',
      description: 'Redirigiendo a la pantalla de acceso seguro...',
    });

    try {
      const redirectOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectOrigin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con Google';
      const formatted = msg.includes('provider is not enabled')
        ? 'El acceso con Google no está habilitado actualmente. Por favor ingresa con tu correo y contraseña.'
        : msg;
      setErrorMessage(formatted);
      sileo.error({
        title: 'Error con Google',
        description: formatted,
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="rounded-3xl sm:rounded-[36px] bg-white p-5 sm:p-9 cushion-card border border-pink-100 shadow-2xl relative overflow-hidden"
        style={{
          boxShadow:
            'inset 0 -10px 0 rgba(255, 179, 209, 0.35), inset 0 6px 0 rgba(255, 255, 255, 0.95), 0 25px 50px -12px rgba(45, 30, 66, 0.15)',
        }}
      >
        {/* Brand Header */}
        <div className="text-center pb-6 border-b border-pink-100">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FFF0F6] border border-pink-200 mb-3 shadow-xs">
            <img
              src="/logogirlsandlaw-nobg.webp"
              alt="Logo Girls & Law"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h1 className="font-serif font-black text-2xl text-[#2A1828] leading-tight">
            Girls <span className="text-[#E31B6D] italic">&amp;</span> Law
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#E31B6D] mt-0.5">
            Campus Virtual &amp; Panel
          </p>
          <p className="text-xs font-bold text-[#6A5A6D] mt-2">
            {isRegister
              ? 'Regístrate para comprar tus cursos y acceder al aula virtual'
              : 'Ingresa para administrar o estudiar tus masterclasses'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 my-5 rounded-full bg-[#FFF5F9] border border-pink-100">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              !isRegister
                ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-xs'
                : 'text-[#6A5A6D] hover:text-[#2A1828]'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              isRegister
                ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-xs'
                : 'text-[#6A5A6D] hover:text-[#2A1828]'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{errorMessage}</div>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2 animate-in fade-in duration-150">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1 leading-snug">{infoMessage}</div>
          </div>
        )}

        {/* Google OAuth Login Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-5 rounded-full bg-white hover:bg-[#FFF5F9] text-[#2A1828] border border-pink-200/90 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-[0_4px_12px_rgba(227,27,109,0.06)] hover:shadow-md cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-pink-100" />
            <span className="absolute px-3 bg-white text-[11px] font-bold text-[#A08A9E] uppercase tracking-wider">
              o con tu correo
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E31B6D]" /> Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2A1828] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#E31B6D]" /> Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FB] border border-pink-200 text-[#2A1828] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-6 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span className="animate-pulse">Iniciando sesión segura...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Crear Cuenta' : 'Entrar al Campus'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security status footer */}
        <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-center gap-2 text-[10px] font-bold text-[#A08A9E]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Acceso Seguro y Cifrado · Girls &amp; Law</span>
        </div>

        {/* Back to landing page link */}
        <div className="mt-3 text-center">
          <a
            href="/"
            className="text-[11px] font-bold text-[#A08A9E] hover:text-[#E31B6D] transition-colors"
          >
            ← Volver a la página principal
          </a>
        </div>
      </div>
    </div>
  );
}
