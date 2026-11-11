import { useState, useEffect } from 'react';
import { sileo } from 'sileo';
import {
  purchaseCourse,
  subscribeUserToPlan,
  getPaymentSettings,
  type Course,
  type Enrollment,
  type SubscriptionPlan,
  type UserLevel,
  type PaymentSettings,
} from '@/lib/supabase';
import {
  X,
  ShieldCheck,
  Sparkles,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  HelpCircle,
  Crown,
  MessageCircle,
} from 'lucide-react';

interface CourseCheckoutModalProps {
  course?: Course | null;
  plan?: SubscriptionPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: Enrollment | { plan: SubscriptionPlan; level: UserLevel }) => void;
  currentUserId: string;
}

export function CourseCheckoutModal({
  course,
  plan,
  isOpen,
  onClose,
  onSuccess,
  currentUserId,
}: CourseCheckoutModalProps) {
  if (!isOpen || (!course && !plan)) return null;

  const isSubscription = Boolean(plan);
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'card' | 'transfer'>('yape');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(getPaymentSettings());
  const [operationCode, setOperationCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPaymentSettings(getPaymentSettings());
    }
  }, [isOpen]);

  const priceInSoles = plan ? plan.price : course?.price || 50;
  const comparePrice = plan
    ? plan.compare_price || priceInSoles * 1.5
    : course?.compare_at_price || priceInSoles * 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      sileo.error({
        title: 'Sesión requerida',
        description: 'Debes iniciar sesión para completar la adquisición.',
      });
      return;
    }

    setLoading(true);
    try {
      if (isSubscription && plan) {
        const result = await subscribeUserToPlan({
          userId: currentUserId,
          planId: plan.id,
          paymentMethod,
          operationCode,
        });

        sileo.success({
          title: `¡Bienvenida a ${plan.name}!`,
          description: `Tu membresía ha sido activada con nivel ${result.level.toUpperCase()}. Tienes acceso a la plataforma.`,
        });

        onSuccess({ plan, level: result.level });
        onClose();
      } else if (course) {
        const enrollment = await purchaseCourse({
          userId: currentUserId,
          courseId: course.id,
          amountPaid: priceInSoles,
          currency: 'PEN',
          paymentMethod,
        });

        sileo.success({
          title: '¡Compra confirmada con éxito!',
          description: `Has adquirido "${course.title}". Ya está disponible en tu perfil y aula virtual.`,
        });

        onSuccess(enrollment);
        onClose();
      }
    } catch {
      sileo.error({
        title: 'Error al procesar el pago',
        description: 'No pudimos registrar la operación. Intenta de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-4 sm:my-8 bg-white rounded-3xl sm:rounded-[2rem] border border-pink-200/90 shadow-[0_24px_60px_rgba(227,27,109,0.18)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header Pill */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 bg-gradient-to-r from-[#FFF0F6] via-white to-[#FFEBF3] border-b border-pink-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-[#E31B6D] to-[#F06292] text-white flex items-center justify-center shadow-xs shrink-0">
              {isSubscription ? <Crown className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-[#E31B6D] tracking-wider">
                  {isSubscription ? 'Suscripción Segura' : 'Matrícula Segura'}
                </span>
                <span className="w-1 h-1 rounded-full bg-pink-300" />
                <span className="text-[9px] sm:text-[10px] font-bold text-[#A08A9E]">
                  {isSubscription ? 'Membresía Mensual' : 'Pago Único'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif italic font-bold text-[#2A1828]">
                {isSubscription ? `Activar ${plan?.name}` : 'Adquirir Masterclass'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-pink-100/70 border border-pink-100 flex items-center justify-center text-[#6A5A6D] hover:text-[#E31B6D] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Summary Card (Girls & Law Cushion Style) */}
          <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#FFF5F9] border border-pink-100/90 flex items-center gap-3 sm:gap-4">
            {isSubscription ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#E31B6D] to-[#F06292] text-white flex flex-col items-center justify-center shrink-0 shadow-xs p-1.5 sm:p-2 text-center">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1" />
                <span className="text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider">{plan?.badge || 'VIP'}</span>
              </div>
            ) : (
              <img
                src={course?.cover_image}
                alt={course?.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-pink-200/80 shrink-0 shadow-xs"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#FFEBF3] text-[9px] font-black uppercase text-[#E31B6D]">
                  {isSubscription ? plan?.badge : course?.category}
                </span>
                <span className="text-[10px] text-[#A08A9E] font-medium">
                  {isSubscription ? 'Acceso Continuo' : course?.duration}
                </span>
              </div>
              <h3 className="font-serif italic font-bold text-xs sm:text-sm text-[#2A1828] mt-1 line-clamp-2 leading-snug">
                {isSubscription ? plan?.name : course?.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#6A5A6D] mt-0.5 truncate">
                {isSubscription ? (
                  <strong className="text-[#E31B6D]">{plan?.tagline}</strong>
                ) : (
                  <>Docente: <strong className="text-[#E31B6D]">{course?.instructor}</strong></>
                )}
              </p>
            </div>

            <div className="text-right shrink-0">
              {comparePrice && (
                <span className="block text-[9px] sm:text-[10px] text-[#A08A9E] line-through">
                  S/. {comparePrice}
                </span>
              )}
              <span className="text-lg sm:text-2xl font-serif italic font-black text-[#E31B6D]">
                S/. {priceInSoles}
              </span>
              <span className="block text-[8.5px] sm:text-[9px] font-black uppercase text-emerald-600">
                {isSubscription ? 'Mensual' : 'Pago Único'}
              </span>
            </div>
          </div>

          {/* Payment Method Selector (Tabs) */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#A08A9E]">
              Selecciona Método de Pago
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('yape')}
                className={`p-2 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 sm:gap-1.5 ${
                  paymentMethod === 'yape'
                    ? 'bg-gradient-to-b from-[#FFF0F6] to-[#FFE4EF] border-[#E31B6D] shadow-xs'
                    : 'bg-white border-pink-100 hover:border-pink-200'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    paymentMethod === 'yape' ? 'bg-[#742284] text-white' : 'bg-purple-100 text-[#742284]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-[#2A1828]">Yape / Plin</span>
                <span className="text-[8.5px] sm:text-[9px] text-[#E31B6D] font-bold">Inmediato</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 sm:gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'bg-gradient-to-b from-[#FFF0F6] to-[#FFE4EF] border-[#E31B6D] shadow-xs'
                    : 'bg-white border-pink-100 hover:border-pink-200'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    paymentMethod === 'card' ? 'bg-[#E31B6D] text-white' : 'bg-pink-100 text-[#E31B6D]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-[#2A1828]">Tarjeta</span>
                <span className="text-[8.5px] sm:text-[9px] text-[#A08A9E] font-medium">Débito/Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-2 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 sm:gap-1.5 ${
                  paymentMethod === 'transfer'
                    ? 'bg-gradient-to-b from-[#FFF0F6] to-[#FFE4EF] border-[#E31B6D] shadow-xs'
                    : 'bg-white border-pink-100 hover:border-pink-200'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    paymentMethod === 'transfer' ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-600'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-[#2A1828]">Transferencia</span>
                <span className="text-[8.5px] sm:text-[9px] text-[#A08A9E] font-medium">BCP / BBVA</span>
              </button>
            </div>
          </div>

          {/* Tab Content: Yape / Plin */}
          {paymentMethod === 'yape' && (
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#742284]/5 via-pink-50/50 to-white border border-purple-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#742284] uppercase tracking-wider">
                    Pagar con Yape o Plin
                  </span>
                  <p className="text-[11px] text-[#6A5A6D]">
                    Transfiere el monto exacto y escribe tu número de operación:
                  </p>
                </div>
                <span className="text-sm font-black text-[#742284] bg-purple-100 px-3 py-1 rounded-full">
                  S/. {priceInSoles} PEN
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-[#A08A9E] uppercase font-bold">Número Yape / Plin</p>
                  <p className="text-base font-black text-[#2A1828] font-mono tracking-wide">
                    {paymentSettings.yape_phone || '987 654 321'}
                  </p>
                  <p className="text-[10px] text-[#742284] font-medium">
                    Titular: {paymentSettings.account_holder || 'Roxana Rivera / Girls & Law'}
                  </p>
                </div>
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-200 text-[#742284] overflow-hidden">
                  {paymentSettings.qr_image_url ? (
                    <img
                      src={paymentSettings.qr_image_url}
                      alt="QR Yape"
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <QrCode className="w-7 h-7" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2A1828] mb-1">
                  Número de Operación (6 dígitos de tu comprobante)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={operationCode}
                  onChange={(e) => setOperationCode(e.target.value)}
                  placeholder="Ej: 849201"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-pink-200 text-xs font-bold text-[#2A1828] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
                />
              </div>
            </div>
          )}

          {/* Tab Content: Tarjeta */}
          {paymentMethod === 'card' && (
            <div className="p-4 rounded-3xl bg-pink-50/50 border border-pink-200/60 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#2A1828] mb-1">
                  Nombre en la Tarjeta
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Nombre y Apellido"
                  className="w-full px-4 py-2 rounded-2xl bg-white border border-pink-200 text-xs font-bold text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2A1828] mb-1">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 •••• •••• 4242"
                  className="w-full px-4 py-2 rounded-2xl bg-white border border-pink-200 text-xs font-bold font-mono text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#2A1828] mb-1">
                    Vencimiento
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full px-4 py-2 rounded-2xl bg-white border border-pink-200 text-xs font-bold font-mono text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#2A1828] mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-4 py-2 rounded-2xl bg-white border border-pink-200 text-xs font-bold font-mono text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Transferencia Bancaria */}
          {paymentMethod === 'transfer' && (
            <div className="p-4 rounded-3xl bg-blue-50/50 border border-blue-200/60 space-y-2.5">
              <span className="text-xs font-black text-[#0039A6] uppercase tracking-wider">
                Cuentas Bancarias Oficiales
              </span>
              <div className="p-3 bg-white rounded-2xl border border-blue-100 text-xs space-y-1">
                <p className="font-bold text-[#2A1828]">{paymentSettings.bank_name || 'Banco de Crédito del Perú (BCP Soles)'}</p>
                <p className="font-mono text-xs text-[#0039A6] font-bold">{paymentSettings.account_number || '193-9823412-0-45'}</p>
                <p className="text-[10px] text-[#A08A9E] font-mono">CCI: {paymentSettings.cci || '00219300982341204518'}</p>
                <p className="text-[10px] text-[#6A5A6D]">Titular: {paymentSettings.account_holder || 'Girls & Law S.A.C.'}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2A1828] mb-1">
                  Número de Operación Bancaria
                </label>
                <input
                  type="text"
                  value={operationCode}
                  onChange={(e) => setOperationCode(e.target.value)}
                  placeholder="Ej: OP-991283"
                  className="w-full px-4 py-2 rounded-2xl bg-white border border-pink-200 text-xs font-bold text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/40"
                />
              </div>
            </div>
          )}

          {/* WhatsApp Direct Confirmation Button */}
          {paymentSettings.whatsapp_number && (
            <a
              href={`https://wa.me/${paymentSettings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
                `Hola Roxana, acabo de realizar mi matrícula en Girls & Law para "${
                  plan ? plan.name : course?.title
                }" por S/. ${priceInSoles} PEN.${
                  operationCode ? ` Mi número de operación es: ${operationCode}.` : ''
                } Por favor confirmarme el acceso.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>¿Dudas con tu pago? Enviar comprobante a Roxana por WhatsApp</span>
            </a>
          )}

          {/* Security & Guarantees */}
          <div className="flex items-center justify-between text-[11px] text-[#6A5A6D] px-1">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transacción Cifrada 256-Bit</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E31B6D]" />
              <span>Acceso Inmediato en tu Perfil</span>
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#E31B6D] via-[#EA3883] to-[#F06292] hover:brightness-105 active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-[0_12px_28px_rgba(227,27,109,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando Matrícula...</span>
                </>
              ) : (
                <>
                  <span>
                    {isSubscription
                      ? `Confirmar y Desbloquear ${plan?.name} por S/. ${priceInSoles} PEN`
                      : `Confirmar y Desbloquear por S/. ${priceInSoles} PEN`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
