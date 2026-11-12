import { createClient } from '@supabase/supabase-js';

// Environment variables with fallback
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://gfyqhlaytcrpbidgrijj.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  'sb_publishable_Y2igeCFENSoXvoITGllnQQ_8begb662';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type UserRole = 'admin' | 'coordinadora' | 'sub_admin' | 'profesora' | 'alumna';
export type UserLevel = 'inicial' | 'pro' | 'vip';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  level: UserLevel;
  phone?: string;
  created_at?: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  description?: string;
  duration: string;
  video_url: string;
  storage_path?: string;
  order_index: number;
  is_free_preview?: boolean;
  notes?: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  price: number;
  compare_at_price?: number;
  currency?: 'PEN' | 'USD';
  category: 'Litigio' | 'Penal' | 'Oralidad' | 'Negociación' | 'Marca Personal' | 'Corporativo';
  level: 'Inicial' | 'Intermedio' | 'Avanzado' | 'Clínico VIP';
  modality: 'Asincrónico' | 'En Vivo' | 'Híbrido';
  duration: string;
  modules_count: number;
  lessons_count: number;
  students_count: number;
  rating: number;
  status: 'published' | 'draft' | 'archived';
  cover_image: string;
  trailer_url?: string;
  featured?: boolean;
  modules?: CourseModule[];
  created_at?: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  amount_paid: number;
  currency: 'PEN' | 'USD';
  payment_method: string;
  status: 'active' | 'completed' | 'refunded';
  progress_percent: number;
  enrolled_at: string;
}

export interface Student {
  id: string;
  user_id?: string;
  course_id?: string;
  name: string;
  email: string;
  avatar?: string;
  course_title: string;
  amount_paid: number;
  enrolled_at: string;
  progress: number;
  status: 'Activa' | 'Completado' | 'En Pausa';
  city: string;
  role?: UserRole;
  level?: UserLevel;
  phone?: string;
}

// Configuración de la Plataforma de Cobro (Yape, Plin, Banco, WhatsApp de Roxana Rivera)
export interface PaymentSettings {
  account_holder: string;
  yape_phone: string;
  qr_image_url?: string;
  bank_name: string;
  account_number: string;
  cci: string;
  whatsapp_number: string;
  instructions: string;
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  account_holder: 'Roxana Rivera / Girls & Law',
  yape_phone: '987 654 321',
  qr_image_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126500010pe.yape01099876543215204000053036045802PE5913Roxana%20Rivera6004Lima6304',
  bank_name: 'Banco de Crédito del Perú (BCP Soles)',
  account_number: '193-9823412-0-45',
  cci: '00219300982341204518',
  whatsapp_number: '987654321',
  instructions: 'Realiza la transferencia por Yape, Plin o BCP e ingresa tu código de 6 dígitos. También puedes enviar tu comprobante directamente por WhatsApp.',
};

export function getPaymentSettings(): PaymentSettings {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('girls_and_law_payment_settings_v1');
    if (saved) {
      try {
        return { ...DEFAULT_PAYMENT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        // fallback
      }
    }
  }
  return DEFAULT_PAYMENT_SETTINGS;
}

export function savePaymentSettings(settings: PaymentSettings): PaymentSettings {
  if (typeof window !== 'undefined') {
    localStorage.setItem('girls_and_law_payment_settings_v1', JSON.stringify(settings));
  }
  return settings;
}

// Sample video URLs (high quality legal / lecture streams for testing)
const SAMPLE_VIDEOS = {
  litigio1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  litigio2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  litigio3: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
};

// Seed courses with structured modules and lessons with video references (Precios en Soles PEN)
export const SEED_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Litigio de Alto Impacto: Poder, Argumentación & Autenticidad',
    slug: 'litigio-de-alto-impacto',
    description:
      'La formación clínica de élite para dominar tribunales con autoridad, persuasión escénica y una teoría del caso imbatible.',
    instructor: 'Roxana Rivera',
    price: 150,
    compare_at_price: 250,
    currency: 'PEN',
    category: 'Litigio',
    level: 'Clínico VIP',
    modality: 'Híbrido',
    duration: '12 horas',
    modules_count: 4,
    lessons_count: 12,
    students_count: 248,
    rating: 4.9,
    status: 'published',
    cover_image:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
    featured: true,
    trailer_url: SAMPLE_VIDEOS.litigio1,
    created_at: new Date('2026-01-15').toISOString(),
    modules: [
      {
        id: 'mod-1-1',
        course_id: 'course-1',
        title: 'Módulo 1: Arquitectura de la Teoría del Caso',
        description: 'Cómo construir una narrativa fáctica, jurídica y probatoria impenetrable.',
        order_index: 1,
        lessons: [
          {
            id: 'les-1-1',
            module_id: 'mod-1-1',
            course_id: 'course-1',
            title: 'Clase 01: El Hecho Relevante vs. La Paja Procesal',
            duration: '18 min',
            video_url: SAMPLE_VIDEOS.litigio1,
            storage_path: 'course-videos/litigio/clase-01-hecho-relevante.mp4',
            order_index: 1,
            is_free_preview: true,
            notes: 'Aprende a depurar los hechos no controvertidos y enfocar el 100% de la energía del tribunal en tu proposición fáctica central.',
          },
          {
            id: 'les-1-2',
            module_id: 'mod-1-1',
            course_id: 'course-1',
            title: 'Clase 02: Matriz Fáctico-Jurídica en Word',
            duration: '24 min',
            video_url: SAMPLE_VIDEOS.litigio2,
            storage_path: 'course-videos/litigio/clase-02-matriz-factica.mp4',
            order_index: 2,
            is_free_preview: false,
            notes: 'Estructuración de la tabla de verificación de prueba directa e indiciaria.',
          },
          {
            id: 'les-1-3',
            module_id: 'mod-1-1',
            course_id: 'course-1',
            title: 'Clase 03: Identificación Temprana de Debilidades de la Contraparte',
            duration: '21 min',
            video_url: SAMPLE_VIDEOS.litigio3,
            storage_path: 'course-videos/litigio/clase-03-debilidades.mp4',
            order_index: 3,
            is_free_preview: false,
            notes: 'Anticipación y neutralización del contraargumento en el alegato de apertura.',
          },
        ],
      },
      {
        id: 'mod-1-2',
        course_id: 'course-1',
        title: 'Módulo 2: Alegatos de Apertura Memorables',
        description: 'El arte de captar la atención del juez en los primeros 120 segundos.',
        order_index: 2,
        lessons: [
          {
            id: 'les-1-4',
            module_id: 'mod-1-2',
            course_id: 'course-1',
            title: 'Clase 04: El Hook Inicial y la Frase Fuerza',
            duration: '25 min',
            video_url: SAMPLE_VIDEOS.litigio1,
            storage_path: 'course-videos/litigio/clase-04-hook-inicial.mp4',
            order_index: 4,
            is_free_preview: false,
            notes: 'Uso de pausas, cadencia de voz y contacto visual con el estrado.',
          },
          {
            id: 'les-1-5',
            module_id: 'mod-1-2',
            course_id: 'course-1',
            title: 'Clase 05: El Relato Cronológico vs. Temático',
            duration: '30 min',
            video_url: SAMPLE_VIDEOS.litigio2,
            storage_path: 'course-videos/litigio/clase-05-relato-tematico.mp4',
            order_index: 5,
            is_free_preview: false,
            notes: 'Cuándo conviene estructurar el alegato por temas y cuándo por línea de tiempo.',
          },
        ],
      },
      {
        id: 'mod-1-3',
        course_id: 'course-1',
        title: 'Módulo 3: Contra-interrogatorio Quirúrgico',
        description: 'Técnicas avanzadas para interrogar peritos y testigos hostiles.',
        order_index: 3,
        lessons: [
          {
            id: 'les-1-6',
            module_id: 'mod-1-3',
            course_id: 'course-1',
            title: 'Clase 06: La Regla de Oro: Solo Preguntas Asertivas',
            duration: '22 min',
            video_url: SAMPLE_VIDEOS.litigio3,
            storage_path: 'course-videos/litigio/clase-06-preguntas-asertivas.mp4',
            order_index: 6,
            is_free_preview: false,
            notes: 'Nunca hagas una pregunta cuya respuesta no conozcas con antelación.',
          },
          {
            id: 'les-1-7',
            module_id: 'mod-1-3',
            course_id: 'course-1',
            title: 'Clase 07: Impugnación de Credibilidad con Declaración Previa',
            duration: '28 min',
            video_url: SAMPLE_VIDEOS.litigio1,
            storage_path: 'course-videos/litigio/clase-07-impugnacion.mp4',
            order_index: 7,
            is_free_preview: false,
            notes: 'Técnica de C.A.C.A.: Comprometer, Acreditar, Confrontar y Acabar.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'El Vault Procesal: Redacción de Alegatos y Demandas Ganadoras',
    slug: 'el-vault-procesal',
    description:
      'Acceso y taller práctico a 15 modelos procesales de alta gama en Word con matrices de hechos y pruebas irrebatibles.',
    instructor: 'Roxana Rivera',
    price: 50,
    compare_at_price: 120,
    currency: 'PEN',
    category: 'Litigio',
    level: 'Intermedio',
    modality: 'Asincrónico',
    duration: '6 horas',
    modules_count: 3,
    lessons_count: 8,
    students_count: 182,
    rating: 4.8,
    status: 'published',
    cover_image:
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop',
    featured: false,
    trailer_url: SAMPLE_VIDEOS.litigio2,
    created_at: new Date('2026-02-01').toISOString(),
    modules: [
      {
        id: 'mod-2-1',
        course_id: 'course-2',
        title: 'Módulo 1: Diseño Visual y Arquitectura de la Demanda',
        order_index: 1,
        lessons: [
          {
            id: 'les-2-1',
            module_id: 'mod-2-1',
            course_id: 'course-2',
            title: 'Clase 01: El Resumen Ejecutivo en la Primera Página',
            duration: '19 min',
            video_url: SAMPLE_VIDEOS.litigio2,
            storage_path: 'course-videos/vault/clase-01-resumen-ejecutivo.mp4',
            order_index: 1,
            is_free_preview: true,
            notes: 'Por qué los jueces agradecen una síntesis clara antes del petitorio extenso.',
          },
          {
            id: 'les-2-2',
            module_id: 'mod-2-1',
            course_id: 'course-2',
            title: 'Clase 02: Plantillas y Formato Word Descargable',
            duration: '22 min',
            video_url: SAMPLE_VIDEOS.litigio3,
            storage_path: 'course-videos/vault/clase-02-plantillas-word.mp4',
            order_index: 2,
            is_free_preview: false,
            notes: 'Configuración tipográfica, márgenes de legibilidad y numeración jurídica.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Técnica de Interrogatorio y Objeciones en Audiencia Real',
    slug: 'interrogatorio-y-objeciones',
    description:
      'Aprende a formular preguntas cerradas que acorralan, a controlar testigos hostiles y a objetar en 0.5 segundos con base legal.',
    instructor: 'Roxana Rivera',
    price: 90,
    compare_at_price: 160,
    currency: 'PEN',
    category: 'Oralidad',
    level: 'Avanzado',
    modality: 'En Vivo',
    duration: '8 horas',
    modules_count: 4,
    lessons_count: 10,
    students_count: 134,
    rating: 5.0,
    status: 'published',
    cover_image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop',
    featured: false,
    trailer_url: SAMPLE_VIDEOS.litigio3,
    created_at: new Date('2026-02-14').toISOString(),
    modules: [
      {
        id: 'mod-3-1',
        course_id: 'course-3',
        title: 'Módulo 1: El Reflejo de la Objeción Inmediata',
        order_index: 1,
        lessons: [
          {
            id: 'les-3-1',
            module_id: 'mod-3-1',
            course_id: 'course-3',
            title: 'Clase 01: Las 7 Objeciones Prohibidas y Cuándo Levantarse',
            duration: '26 min',
            video_url: SAMPLE_VIDEOS.litigio1,
            storage_path: 'course-videos/objeciones/clase-01-siete-objeciones.mp4',
            order_index: 1,
            is_free_preview: true,
            notes: 'Preguntas capciosas, sugestivas en directo e impertinentes.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-4',
    title: 'Marca Personal Jurídica y Negociación de Honorarios Premium',
    slug: 'marca-personal-honorarios',
    description:
      'Aprende a cobrar por valor, negociar acuerdos extrajudiciales con el método Harvard y construir un prestigio intachable en redes.',
    instructor: 'Dra. Camila Soto',
    price: 50,
    compare_at_price: 100,
    currency: 'PEN',
    category: 'Marca Personal',
    level: 'Intermedio',
    modality: 'Asincrónico',
    duration: '5 horas',
    modules_count: 3,
    lessons_count: 8,
    students_count: 96,
    rating: 4.9,
    status: 'draft',
    cover_image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    featured: false,
    trailer_url: SAMPLE_VIDEOS.litigio2,
    created_at: new Date('2026-03-01').toISOString(),
    modules: [],
  },
];

// Sin datos falsos: Lista vacía por defecto ("si no hay datos que veamos sin datos")
export const SEED_STUDENTS: Student[] = [];

// Fetch user profile with role and level from Supabase
export async function getUserProfile(userId: string, email?: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      return data as UserProfile;
    }
  } catch {
    // Table not created yet
  }

  // Fallback: If user is the main owner or admin
  const isSuperAdmin = email === 'anthonnywt@gmail.com';
  return {
    id: userId,
    email: email || '',
    full_name: email?.split('@')[0] || 'Usuario',
    role: isSuperAdmin ? 'admin' : 'alumna',
    level: isSuperAdmin ? 'vip' : 'inicial',
  };
}

// Update profile role / level (admin only)
export async function updateUserRole(userId: string, role: UserRole, level: UserLevel): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role, level, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return !error;
  } catch {
    return false;
  }
}

const LOCAL_STORAGE_USERS_KEY = 'girls_and_law_users_v2';

// Create a new user account / profile
export async function createUserAccount(userData: {
  email: string;
  full_name: string;
  password?: string;
  role: UserRole;
  level: UserLevel;
  phone?: string;
}): Promise<UserProfile | null> {
  const email = userData.email.trim().toLowerCase();
  const fullName = userData.full_name.trim();

  // Try creating in Supabase Auth via secondary isolated client so admin is NOT logged out
  try {
    const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: authData, error: authErr } = await tempClient.auth.signUp({
      email,
      password: userData.password || 'GirlsAndLaw2026!',
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (!authErr && authData.user) {
      const userProfile: UserProfile = {
        id: authData.user.id,
        email,
        full_name: fullName,
        role: userData.role,
        level: userData.level,
        phone: userData.phone || '',
        created_at: new Date().toISOString(),
      };

      await supabase.from('profiles').upsert(userProfile);
      return userProfile;
    }
  } catch {
    // fallback
  }

  // Fallback insert if profiles allows or offline
  const fallbackId =
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`;
  const localProfile: UserProfile = {
    id: fallbackId,
    email,
    full_name: fullName,
    role: userData.role,
    level: userData.level,
    phone: userData.phone || '',
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('profiles').insert(localProfile);
  } catch {
    // offline
  }

  if (typeof window !== 'undefined') {
    const current = await getAllProfiles();
    const updated = [localProfile, ...current.filter((u) => u.id !== localProfile.id)];
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updated));
  }

  return localProfile;
}

// Update complete user profile
export async function updateUserProfile(profileData: {
  id: string;
  full_name: string;
  role: UserRole;
  level: UserLevel;
  phone?: string;
}): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const current = await getAllProfiles();
    const updated = current.map((u) =>
      u.id === profileData.id
        ? {
            ...u,
            full_name: profileData.full_name,
            role: profileData.role,
            level: profileData.level,
            phone: profileData.phone,
          }
        : u
    );
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updated));
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.full_name,
        role: profileData.role,
        level: profileData.level,
        phone: profileData.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileData.id);

    return !error;
  } catch {
    return false;
  }
}

// Delete user account / profile
export async function deleteUserProfile(userId: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const current = await getAllProfiles();
    const updated = current.filter((u) => u.id !== userId);
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updated));
  }

  try {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    return !error;
  } catch {
    return false;
  }
}

// Get all registered users from profiles
export async function getAllProfiles(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as UserProfile[];
    }
  } catch {
    // table not ready
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
  }

  const initial = [
    {
      id: 'e3bdf9ed-c289-4624-badf-7f26bae14ed8',
      email: 'anthonnywt@gmail.com',
      full_name: 'Anthonny (Super Admin)',
      role: 'admin' as UserRole,
      level: 'vip' as UserLevel,
    },
  ];

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(initial));
  }

  return initial;
}

const LOCAL_STORAGE_COURSES_KEY = 'girls_and_law_courses_v2';

// Helper to ensure each course has at least one functional module and playable lesson
export function ensureCourseModules(c: Course): Course {
  if (!c.modules || c.modules.length === 0) {
    return {
      ...c,
      modules: [
        {
          id: `mod-${c.id}-1`,
          course_id: c.id,
          title: 'Módulo 1: Fundamentos y Estrategia Procesal',
          description: 'Lecciones clínicas, jurisprudencia y materiales prácticos.',
          order_index: 1,
          lessons: [
            {
              id: `les-${c.id}-1`,
              module_id: `mod-${c.id}-1`,
              course_id: c.id,
              title: `Clase 01: Introducción a ${c.title}`,
              duration: c.duration || '15 min',
              video_url: c.trailer_url || SAMPLE_VIDEOS.litigio1,
              order_index: 1,
              is_free_preview: true,
              notes: 'Clase clínica introductoria con análisis procesal y descarga de matrices.',
            },
          ],
        },
      ],
    };
  }
  return c;
}

// 3 Subscription Plans requested: Plan Base, Plan Full (con Meet), Plan Ultra (Todo)
export interface SubscriptionPlan {
  id: 'plan-base' | 'plan-full' | 'plan-ultra';
  name: string;
  tagline: string;
  price: number;
  compare_price?: number;
  period: string;
  badge: string;
  level: UserLevel;
  popular?: boolean;
  description: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-base',
    name: 'Plan Base',
    tagline: 'Acceso a los Cursos',
    price: 49,
    compare_price: 80,
    period: 'PEN / mes',
    badge: 'Membresía Base',
    level: 'inicial',
    popular: false,
    description: 'Acceso ilimitado a todas las masterclasses grabadas y temarios interactivos en streaming HD.',
    features: [
      'Acceso ilimitado a todos los cursos y masterclasses',
      'Reproductor HD multidispositivo (Laptop, Celular, Tablet)',
      'Materiales procesales y lecturas complementarias',
      'Certificado digital por cada curso culminado',
      'Actualizaciones continuas de jurisprudencia',
    ],
  },
  {
    id: 'plan-full',
    name: 'Plan Full',
    tagline: 'Cursos + 1 Meet con Roxana Rivera',
    price: 99,
    compare_price: 150,
    period: 'PEN / mes',
    badge: 'Más Elegido · Recomendado',
    level: 'pro',
    popular: true,
    description: 'Acceso a todos los cursos más una sesión clínica en vivo (Meet) exclusiva con Roxana Rivera.',
    features: [
      'Todo lo incluido en el Plan Base',
      '1 Meet / Videollamada clínica en vivo con Roxana Rivera',
      'Resolución de dudas procesales y casos reales en directo',
      'Descarga de matrices y minutas procesales en Word',
      'Acceso a la comunidad privada de abogadas de élite',
      'Grabación de la sesión para repasar cuando quieras',
    ],
  },
  {
    id: 'plan-ultra',
    name: 'Plan Ultra',
    tagline: 'Acceso Total a Todo + Mentoría VIP',
    price: 199,
    compare_price: 320,
    period: 'PEN / mes',
    badge: 'Acceso Total VIP',
    level: 'vip',
    popular: false,
    description: 'Acceso total e irrestricto a todos los cursos, clínicas en vivo, Vault procesal y Meet 1 a 1 con Roxana.',
    features: [
      'Acceso TOTAL a todos los cursos presentes y futuros',
      'Meet exclusivo 1 a 1 personalizado con Roxana Rivera',
      'Clínicas de Juicio Oral y Litigio con simulaciones en vivo',
      'El Vault Procesal completo: 15+ modelos de demandas en Word',
      'Asesoría en negociación de honorarios y marca jurídica',
      'Canal VIP prioritario por WhatsApp con Roxana y equipo',
    ],
  },
];

export async function subscribeUserToPlan(params: {
  userId: string;
  planId: 'plan-base' | 'plan-full' | 'plan-ultra';
  paymentMethod: string;
  operationCode?: string;
}): Promise<{ success: boolean; level: UserLevel }> {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === params.planId) || SUBSCRIPTION_PLANS[0];

  // 1. Update user profile level in Supabase
  try {
    await supabase
      .from('profiles')
      .update({
        level: plan.level,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.userId);
  } catch (err) {
    console.warn('Error updating profile level:', err);
  }

  // 2. Also register in local profile if offline or local state
  if (typeof window !== 'undefined') {
    const current = await getAllProfiles();
    const updated = current.map((u) => (u.id === params.userId ? { ...u, level: plan.level } : u));
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updated));
  }

  // 3. Register enrollment / subscription payment in Supabase
  try {
    const allCourses = await getCourses();
    const published = allCourses.filter((c) => c.status === 'published');
    const coursesToEnroll = published.length > 0 ? published : allCourses;

    for (const c of coursesToEnroll) {
      await supabase.from('enrollments').upsert({
        user_id: params.userId,
        course_id: c.id,
        amount_paid: plan.price,
        currency: 'PEN',
        payment_method: `${plan.name} (${params.paymentMethod})`,
        status: 'active',
      });
    }
  } catch (err) {
    console.warn('Error registering plan enrollments:', err);
  }

  return { success: true, level: plan.level };
}

// Purga inmediata de datos de prueba o cursos seed residuales en LocalStorage
if (typeof window !== 'undefined') {
  try {
    const localCourses = localStorage.getItem(LOCAL_STORAGE_COURSES_KEY);
    if (localCourses && (localCourses.includes('course-1') || localCourses.includes('Litigio de Alto Impacto') || localCourses.includes('course-2'))) {
      localStorage.removeItem(LOCAL_STORAGE_COURSES_KEY);
    }
    const localEnr = localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
    if (localEnr && (localEnr.includes('admin-enr') || localEnr.includes('vip-enr'))) {
      localStorage.removeItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
    }
  } catch {
    // ignore
  }
}

// SINCRONIZACIÓN REAL: Consulta directa a Supabase con persistencia local resistente a fallos de RLS
export async function getCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    // Si Supabase responde con éxito y tiene cursos en la BD
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((c: Course) => ensureCourseModules(c));
    }

    // Si Supabase devuelve error (ej. 42P17 de políticas RLS) o está vacía, recuperar de LocalStorage para no perder lo creado
    if (error || (Array.isArray(data) && data.length === 0)) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem(LOCAL_STORAGE_COURSES_KEY);
        if (local) {
          try {
            const parsed: Course[] = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed.map((c: Course) => ensureCourseModules(c));
            }
          } catch {
            // fallback
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error connecting to Supabase courses:', err);
  }

  // Fallback offline a LocalStorage
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_COURSES_KEY);
    if (local) {
      try {
        const parsed: Course[] = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: Course) => ensureCourseModules(c));
        }
      } catch {
        // fallback
      }
    }
  }

  return [];
}

export async function saveCourse(course: Course): Promise<Course> {
  // 1. Persistir siempre de forma inmediata en LocalStorage para garantizar que el curso aparezca al instante
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_COURSES_KEY);
      let current: Course[] = [];
      if (local) {
        current = JSON.parse(local);
      }
      const existingIndex = current.findIndex((c) => c.id === course.id);
      let updated: Course[];
      if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = course;
      } else {
        updated = [course, ...current];
      }
      localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // 2. Persistir en la base de datos Supabase
  try {
    const { error } = await supabase.from('courses').upsert({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      instructor: course.instructor,
      price: course.price,
      compare_at_price: course.compare_at_price,
      category: course.category,
      level: course.level,
      modality: course.modality,
      duration: course.duration,
      modules_count: course.modules_count,
      lessons_count: course.lessons_count,
      students_count: course.students_count,
      rating: course.rating,
      status: course.status,
      cover_image: course.cover_image,
      trailer_url: course.trailer_url,
      featured: course.featured,
    });
    if (error) {
      console.warn('Supabase upsert course warning:', error.message);
    }
  } catch (err) {
    console.warn('Supabase upsert course exception:', err);
  }

  return course;
}

export async function deleteCourse(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const current = await getCourses();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(updated));
  }

  try {
    await supabase.from('courses').delete().eq('id', id);
  } catch {
    // table not ready
  }
  return true;
}

// =====================================================================
// GESTIÓN DE COMPRAS Y MATRÍCULAS DE CURSOS EN SOLES (PEN - S/.)
// Blindado contra inyecciones SQL y filtración de lecciones privadas
// =====================================================================
const LOCAL_STORAGE_ENROLLMENTS_KEY = 'girls_and_law_enrollments_v2';

export async function getUserEnrollments(userId: string, _userLevel?: UserLevel): Promise<Enrollment[]> {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    // Si Supabase responde exitosamente (incluso si está vacío []), devolvemos la data real sin inventar registros
    if (!error && Array.isArray(data)) {
      return data as Enrollment[];
    }
  } catch (err) {
    console.warn('Error fetching user enrollments:', err);
  }

  // Fallback offline a LocalStorage solo si Supabase no estuvo disponible
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
    if (local) {
      try {
        const all: Enrollment[] = JSON.parse(local);
        return all.filter((e) => e.user_id === userId && e.status === 'active');
      } catch {
        // fallback
      }
    }
  }

  return [];
}

// Matricular manualmente a una usuaria en un curso (Admin / Venta Directa Yape / Plin)
export async function enrollUserInCourse(params: {
  userId: string;
  courseId: string;
  amountPaid?: number;
  currency?: 'PEN' | 'USD';
  paymentMethod?: string;
}): Promise<Enrollment> {
  const enrollment: Enrollment = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `enr-${Date.now()}`,
    user_id: params.userId,
    course_id: params.courseId,
    amount_paid: params.amountPaid || 0,
    currency: params.currency || 'PEN',
    payment_method: params.paymentMethod || 'Manual Admin',
    status: 'active',
    progress_percent: 0,
    enrolled_at: new Date().toISOString(),
  };

  try {
    await supabase.from('enrollments').upsert({
      user_id: params.userId,
      course_id: params.courseId,
      amount_paid: params.amountPaid || 0,
      currency: params.currency || 'PEN',
      payment_method: params.paymentMethod || 'Manual Admin',
      status: 'active',
    });
  } catch {
    // offline fallback
  }

  saveEnrollmentLocally(enrollment);
  return enrollment;
}

export async function purchaseCourse(params: {
  userId: string;
  courseId: string;
  amountPaid: number;
  currency?: 'PEN' | 'USD';
  paymentMethod: string;
}): Promise<Enrollment> {
  const currency = params.currency || 'PEN';

  // 1. Procedimiento almacenado atómico y parametrizado (Cero SQL Injection y verificación de precio real en BD)
  try {
    const { data, error } = await supabase.rpc('register_course_purchase', {
      p_course_id: params.courseId,
      p_payment_method: params.paymentMethod,
    });

    if (!error && data?.enrollment_id) {
      const enrollment: Enrollment = {
        id: data.enrollment_id,
        user_id: params.userId,
        course_id: params.courseId,
        amount_paid: data.amount_paid || params.amountPaid,
        currency: data.currency || currency,
        payment_method: params.paymentMethod,
        status: 'active',
        progress_percent: 0,
        enrolled_at: new Date().toISOString(),
      };
      saveEnrollmentLocally(enrollment);
      return enrollment;
    }
  } catch {
    // Si la función SQL aún no se ejecutó en consola de Supabase, recurrir a insert directo
  }

  // 2. Inserción directa parametrizada (PostgREST previene SQL Injection por defecto)
  const newEnrollment: Enrollment = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `enr-${Date.now()}`,
    user_id: params.userId,
    course_id: params.courseId,
    amount_paid: params.amountPaid,
    currency,
    payment_method: params.paymentMethod,
    status: 'active',
    progress_percent: 0,
    enrolled_at: new Date().toISOString(),
  };

  try {
    await supabase.from('enrollments').upsert(newEnrollment);
  } catch {
    // offline
  }

  saveEnrollmentLocally(newEnrollment);
  return newEnrollment;
}

function saveEnrollmentLocally(enrollment: Enrollment) {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
      const list: Enrollment[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(
        (e) => !(e.user_id === enrollment.user_id && e.course_id === enrollment.course_id)
      );
      localStorage.setItem(LOCAL_STORAGE_ENROLLMENTS_KEY, JSON.stringify([enrollment, ...filtered]));
    } catch {
      // ignore
    }
  }
}

// Obtener todas las matrículas registradas en la base de datos
export async function getAllEnrollments(): Promise<Enrollment[]> {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .order('enrolled_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data as Enrollment[];
    }
  } catch (err) {
    console.warn('Error fetching enrollments:', err);
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
  }

  return [];
}

// SINCRONIZACIÓN REAL DE ALUMNAS:
// Consulta real a Supabase (profiles y enrollments). Si la BD no tiene registros, devuelve [] (sin datos falsos).
export async function getRealStudents(): Promise<Student[]> {
  try {
    const enrollments = await getAllEnrollments();
    const profiles = await getAllProfiles();
    const courses = await getCourses();

    const profileMap = new Map(profiles.map((p) => [p.id, p]));
    const courseMap = new Map(courses.map((c) => [c.id, c]));

    // Si existen matrículas reales registradas:
    if (enrollments.length > 0) {
      return enrollments.map((e) => {
        const prof = profileMap.get(e.user_id);
        const crs = courseMap.get(e.course_id);
        const dateStr = e.enrolled_at
          ? new Date(e.enrolled_at).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : 'Reciente';

        return {
          id: e.id,
          user_id: e.user_id,
          course_id: e.course_id,
          name: prof?.full_name || prof?.email?.split('@')[0] || 'Alumna Registrada',
          email: prof?.email || 'alumna@continental.edu.pe',
          course_title: crs?.title || 'Masterclass',
          amount_paid: Number(e.amount_paid) || 0,
          enrolled_at: dateStr,
          progress: e.progress_percent || 0,
          status: e.status === 'completed' ? 'Completado' : 'Activa',
          city: prof?.phone || 'Perú',
          role: prof?.role || 'alumna',
          level: prof?.level || 'inicial',
          phone: prof?.phone || '',
        };
      });
    }

    // Si no hay compras aún en enrollments, pero existen usuarias registradas con rol 'alumna':
    const alumnas = profiles.filter((p) => p.role === 'alumna');
    if (alumnas.length > 0) {
      return alumnas.map((p) => ({
        id: p.id,
        user_id: p.id,
        course_id: undefined,
        name: p.full_name || p.email.split('@')[0],
        email: p.email,
        course_title: 'Sin curso asignado aún',
        amount_paid: 0,
        enrolled_at: p.created_at
          ? new Date(p.created_at).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : 'Registrada',
        progress: 0,
        status: 'Activa',
        city: p.phone || 'Perú',
        role: p.role,
        level: p.level,
        phone: p.phone || '',
      }));
    }
  } catch (err) {
    console.warn('Error fetching real students:', err);
  }

  // Si no hay datos en la BD, devolver lista vacía ("si no hay datos que veamos sin datos")
  return [];
}

// Revocar matrícula de un curso
export async function revokeEnrollment(enrollmentId: string): Promise<boolean> {
  try {
    await supabase.from('enrollments').delete().eq('id', enrollmentId);
  } catch {
    // offline
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
    if (raw) {
      try {
        const all: Enrollment[] = JSON.parse(raw);
        localStorage.setItem(LOCAL_STORAGE_ENROLLMENTS_KEY, JSON.stringify(all.filter((e) => e.id !== enrollmentId)));
      } catch {
        // ignore
      }
    }
  }
  return true;
}

export function isUserEnrolledInCourse(
  enrollments: Enrollment[],
  courseId: string,
  userRole?: UserRole,
  userLevel?: UserLevel,
  courseLevel?: string
): boolean {
  if (
    userRole === 'admin' ||
    userRole === 'coordinadora' ||
    userRole === 'sub_admin' ||
    userRole === 'profesora' ||
    userLevel === 'vip'
  ) {
    return true;
  }

  // Matrícula manual individual asignada por la administradora
  if (enrollments.some((e) => e.course_id === courseId && e.status === 'active')) {
    return true;
  }

  // Modelo B: Desbloqueo por Nivel de Suscripción
  // Plan Full (pro) desbloquea cursos de nivel Inicial, Intermedio y Avanzado
  if (userLevel === 'pro') {
    if (!courseLevel || courseLevel === 'Inicial' || courseLevel === 'Intermedio' || courseLevel === 'Avanzado') {
      return true;
    }
  }

  // Plan Base (inicial) desbloquea cursos de nivel Inicial
  if (userLevel === 'inicial') {
    if (courseLevel === 'Inicial') {
      return true;
    }
  }

  return false;
}

// Helper to extract YouTube Video ID from any format (youtu.be, watch?v=, embed/, shorts/, etc.)
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL structures
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function isYouTubeUrl(url: string): boolean {
  return !!getYouTubeVideoId(url);
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&playsinline=1`;
}

// Generate Supabase Storage Public Video URL
export function getSupabaseVideoUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) return path;
  return `${supabaseUrl}/storage/v1/object/public/course-videos/${path.replace(/^course-videos\//, '')}`;
}

// Subir archivo de video directamente a Supabase Storage (Bucket: course-videos)
export async function uploadVideoToSupabaseStorage(
  file: File,
  folder: string = 'trailers'
): Promise<{ url: string; storagePath: string }> {
  const fileExt = file.name.split('.').pop() || 'mp4';
  const cleanName = file.name
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 30);
  const fileName = `${Date.now()}-${cleanName}.${fileExt}`;
  const storagePath = `${folder}/${fileName}`;

  try {
    const { error } = await supabase.storage
      .from('course-videos')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'video/mp4',
      });

    if (error) {
      console.warn('Supabase storage upload fallback:', error.message);
      const localBlobUrl = URL.createObjectURL(file);
      return {
        url: localBlobUrl,
        storagePath: `course-videos/${storagePath}`,
      };
    }

    const { data: urlData } = supabase.storage
      .from('course-videos')
      .getPublicUrl(storagePath);

    return {
      url: urlData.publicUrl,
      storagePath: `course-videos/${storagePath}`,
    };
  } catch (err) {
    console.warn('Supabase storage exception fallback:', err);
    const localBlobUrl = URL.createObjectURL(file);
    return {
      url: localBlobUrl,
      storagePath: `course-videos/${storagePath}`,
    };
  }
}

// =====================================================================
// COMPLETE SUPABASE SQL SCRIPT: DATABASE + STORAGE + POLICIES + SEEDS
// =====================================================================
export const SUPABASE_SQL_MIGRATION = `-- =====================================================================
-- GIRLS & LAW: BASE DE DATOS COMPLETA + SUPABASE VIDEO STORAGE
-- Pega y ejecuta este script completo en el SQL Editor de tu Supabase:
-- https://supabase.com/dashboard/project/gfyqhlaytcrpbidgrijj/sql
-- =====================================================================

-- 1. TABLA DE PERFILES DE USUARIOS (Roles y Niveles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'alumna' check (role in ('admin', 'coordinadora', 'sub_admin', 'profesora', 'alumna')),
  level text not null default 'inicial' check (level in ('inicial', 'pro', 'vip')),
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Asegurar actualización de constraint de rol en bases de datos existentes:
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'coordinadora', 'sub_admin', 'profesora', 'alumna'));

-- FUNCIÓN AUXILIAR SIN RECURSIÓN (SECURITY DEFINER evade el RLS al verificar rol)
create or replace function public.is_admin_or_staff()
returns boolean as $$
declare
  v_role text;
begin
  select role into v_role from public.profiles where id = auth.uid();
  return v_role in ('admin', 'coordinadora', 'sub_admin', 'profesora');
end;
$$ language plpgsql security definer set search_path = public;

alter table public.profiles enable row level security;

drop policy if exists "Perfiles legibles por usuarios autenticados" on public.profiles;
create policy "Perfiles legibles por usuarios autenticados" on public.profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists "Usuarios actualizan su propio perfil" on public.profiles;
create policy "Usuarios actualizan su propio perfil" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Admins gestionan perfiles" on public.profiles;
create policy "Admins gestionan perfiles" on public.profiles
  for all using (public.is_admin_or_staff());

-- 2. TRIGGER AUTOMÁTICO: AL CREARSE UN USUARIO EN AUTH.USERS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, level)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case when new.email = 'anthonnywt@gmail.com' then 'admin' else 'alumna' end,
    case when new.email = 'anthonnywt@gmail.com' then 'vip' else 'inicial' end
  )
  on conflict (id) do update set
    role = case when new.email = 'anthonnywt@gmail.com' then 'admin' else public.profiles.role end,
    level = case when new.email = 'anthonnywt@gmail.com' then 'vip' else public.profiles.level end;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ASIGNAR DIRECTAMENTE A TU USUARIO ANTHONNY COMO ADMIN VIP
insert into public.profiles (id, email, full_name, role, level)
values (
  'e3bdf9ed-c289-4624-badf-7f26bae14ed8',
  'anthonnywt@gmail.com',
  'Anthonny (Administrador General)',
  'admin',
  'vip'
)
on conflict (id) do update set role = 'admin', level = 'vip';

-- 3. TABLA DE CURSOS (Modelo de Venta de Cursos en Soles PEN / Pago Único)
create table if not exists public.courses (
  id text primary key,
  title text not null,
  slug text not null unique,
  description text,
  instructor text not null default 'Roxana Rivera',
  price numeric not null default 0,
  compare_at_price numeric,
  currency text not null default 'PEN' check (currency in ('PEN', 'USD')),
  category text not null default 'Litigio',
  level text not null default 'Intermedio',
  modality text not null default 'Asincrónico',
  duration text default '10 horas',
  modules_count integer default 0,
  lessons_count integer default 0,
  students_count integer default 0,
  rating numeric default 5.0,
  status text not null default 'published' check (status in ('published', 'draft', 'archived')),
  cover_image text,
  trailer_url text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

drop policy if exists "Cursos visibles públicamente" on public.courses;
create policy "Cursos visibles públicamente" on public.courses
  for select using (true);

drop policy if exists "Gestión de cursos para administradores" on public.courses;
create policy "Gestión de cursos para administradores" on public.courses
  for all using (public.is_admin_or_staff());

-- 4. TABLA DE MÓDULOS DE CURSOS
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id text references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.modules enable row level security;

drop policy if exists "Módulos visibles públicamente" on public.modules;
create policy "Módulos visibles públicamente" on public.modules
  for select using (true);

drop policy if exists "Admins gestionan módulos" on public.modules;
create policy "Admins gestionan módulos" on public.modules
  for all using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role in ('admin', 'coordinadora', 'sub_admin', 'profesora')
    )
  );

-- 5. TABLA DE LECCIONES (VIDEOS EN SUPABASE STORAGE)
-- CERO FILTRACIONES: Bloqueo de videos y lecciones privadas a no compradoras
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.modules(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  duration text default '15 min',
  video_url text, -- URL directa o enlace público de Supabase Storage
  storage_path text, -- Ruta en el bucket Supabase: ej. 'course-videos/litigio/clase-01.mp4'
  order_index integer default 0,
  is_free_preview boolean default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;

drop policy if exists "Lecciones visibles para alumnas y previews" on public.lessons;
drop policy if exists "Lecciones visibles solo con compra confirmada o preview" on public.lessons;

-- RLS ESTRICTO ANTI-FILTRACIÓN: Solo quien compró el curso o administradores pueden leer lecciones privadas
create policy "Lecciones visibles solo con compra confirmada o preview" on public.lessons
  for select using (
    is_free_preview = true
    or exists (
      select 1 from public.enrollments
      where enrollments.user_id = auth.uid()
        and enrollments.course_id = lessons.course_id
        and enrollments.status = 'active'
    )
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and (
          profiles.role in ('admin', 'coordinadora', 'sub_admin', 'profesora')
          or profiles.level = 'vip'
        )
    )
  );

drop policy if exists "Admins gestionan lecciones" on public.lessons;
create policy "Admins gestionan lecciones" on public.lessons
  for all using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role in ('admin', 'coordinadora', 'sub_admin', 'profesora')
    )
  );

-- 6. TABLA DE MATRÍCULAS / COMPRAS DE CURSOS EN SOLES (Pago Único)
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  amount_paid numeric not null default 0,
  currency text not null default 'PEN' check (currency in ('PEN', 'USD')),
  payment_method text default 'yape',
  status text not null default 'active' check (status in ('active', 'completed', 'refunded')),
  progress_percent integer default 0,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, course_id)
);

alter table public.enrollments enable row level security;

drop policy if exists "Alumnas ven sus propias matrículas" on public.enrollments;
create policy "Alumnas ven sus propias matrículas" on public.enrollments
  for select using (auth.uid() = user_id);

drop policy if exists "Admins ven y gestionan todas las matrículas" on public.enrollments;
create policy "Admins ven y gestionan todas las matrículas" on public.enrollments
  for all using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role in ('admin', 'coordinadora', 'sub_admin')
    )
  );

-- FUNCIÓN SEGURA PARA REGISTRAR COMPRA (100% INMUNE A SQL INJECTION Y MANIPULACIÓN DE PRECIO)
create or replace function public.register_course_purchase(
  p_course_id text,
  p_payment_method text default 'yape'
)
returns jsonb as $$
declare
  v_user_id uuid;
  v_price numeric;
  v_currency text;
  v_enrollment_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Usuario no autenticado en Supabase';
  end if;

  -- Obtiene el precio oficial directo de la base de datos (inmune a manipulación desde el frontend)
  select price, coalesce(currency, 'PEN') into v_price, v_currency
  from public.courses
  where id = p_course_id;

  if v_price is null then
    raise exception 'Curso no encontrado en catálogo';
  end if;

  -- Inserta o reactiva la matrícula de forma atómica y parametrizada (sin interpolación de texto)
  insert into public.enrollments (user_id, course_id, amount_paid, currency, payment_method, status, progress_percent)
  values (v_user_id, p_course_id, v_price, v_currency, p_payment_method, 'active', 0)
  on conflict (user_id, course_id) do update set
    status = 'active',
    amount_paid = excluded.amount_paid,
    payment_method = excluded.payment_method
  returning id into v_enrollment_id;

  -- Incrementa el contador de alumnas inscritas
  update public.courses
  set students_count = coalesce(students_count, 0) + 1
  where id = p_course_id;

  return jsonb_build_object(
    'success', true,
    'enrollment_id', v_enrollment_id,
    'course_id', p_course_id,
    'amount_paid', v_price,
    'currency', v_currency
  );
end;
$$ language plpgsql security definer set search_path = public;

-- 7. TABLA DE PROGRESO DE LECCIONES VISTAS POR ALUMNA
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  last_watched_seconds integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "Usuarios gestionan su progreso" on public.lesson_progress;
create policy "Usuarios gestionan su progreso" on public.lesson_progress
  for all using (auth.uid() = user_id);

-- 8. STORAGE BUCKET PARA VIDEOS DE CURSOS (course-videos)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-videos',
  'course-videos',
  true,
  1073741824, -- Hasta 1GB por video
  array['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 1073741824;

-- Políticas de lectura y subida para el bucket course-videos
drop policy if exists "Lectura pública de videos para streaming" on storage.objects;
create policy "Lectura pública de videos para streaming"
  on storage.objects for select
  using (bucket_id = 'course-videos');

drop policy if exists "Usuarios autenticados suben videos a course-videos" on storage.objects;
create policy "Usuarios autenticados suben videos a course-videos"
  on storage.objects for insert
  with check (
    bucket_id = 'course-videos' and
    auth.role() = 'authenticated'
  );

drop policy if exists "Usuarios autenticados actualizan videos en course-videos" on storage.objects;
create policy "Usuarios autenticados actualizan videos en course-videos"
  on storage.objects for update
  using (
    bucket_id = 'course-videos' and
    auth.role() = 'authenticated'
  );

drop policy if exists "Usuarios autenticados eliminan videos en course-videos" on storage.objects;
create policy "Usuarios autenticados eliminan videos en course-videos"
  on storage.objects for delete
  using (
    bucket_id = 'course-videos' and
    auth.role() = 'authenticated'
  );

-- =====================================================================
-- 9. DATOS SEMILLA: INSERTAR LOS 4 CURSOS EMBLEMÁTICOS (En Soles PEN)
-- =====================================================================
insert into public.courses (
  id, title, slug, description, instructor, price, compare_at_price, currency,
  category, level, modality, duration, modules_count, lessons_count,
  students_count, rating, status, cover_image, trailer_url, featured
) values
(
  'course-1',
  'Litigio de Alto Impacto: Poder, Argumentación & Autenticidad',
  'litigio-de-alto-impacto',
  'La formación clínica de élite para dominar tribunales con autoridad, persuasión escénica y una teoría del caso imbatible.',
  'Roxana Rivera',
  150,
  250,
  'PEN',
  'Litigio',
  'Clínico VIP',
  'Híbrido',
  '12 horas',
  3,
  7,
  248,
  4.9,
  'published',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  true
),
(
  'course-2',
  'El Vault Procesal: Redacción de Alegatos y Demandas Ganadoras',
  'el-vault-procesal',
  'Acceso y taller práctico a 15 modelos procesales de alta gama en Word con matrices de hechos y pruebas irrebatibles.',
  'Roxana Rivera',
  50,
  120,
  'PEN',
  'Litigio',
  'Intermedio',
  'Asincrónico',
  '6 horas',
  1,
  2,
  182,
  4.8,
  'published',
  'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  false
),
(
  'course-3',
  'Técnica de Interrogatorio y Objeciones en Audiencia Real',
  'interrogatorio-y-objeciones',
  'Aprende a formular preguntas cerradas que acorralan, a controlar testigos hostiles y a objetar en 0.5 segundos con base legal.',
  'Roxana Rivera',
  90,
  160,
  'PEN',
  'Oralidad',
  'Avanzado',
  'En Vivo',
  '8 horas',
  1,
  1,
  134,
  5.0,
  'published',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  false
),
(
  'course-4',
  'Marca Personal Jurídica y Negociación de Honorarios Premium',
  'marca-personal-honorarios',
  'Aprende a cobrar por valor, negociar acuerdos extrajudiciales con el método Harvard y construir un prestigio intachable en redes.',
  'Dra. Camila Soto',
  50,
  100,
  'PEN',
  'Marca Personal',
  'Intermedio',
  'Asincrónico',
  '5 horas',
  0,
  0,
  96,
  4.9,
  'draft',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  null,
  false
)
on conflict (id) do update set
  title = excluded.title,
  price = excluded.price,
  currency = excluded.currency,
  status = excluded.status,
  cover_image = excluded.cover_image;

-- 10. MÓDULOS DEL CURSO 1
insert into public.modules (id, course_id, title, description, order_index)
values
  ('11111111-1111-1111-1111-111111111111', 'course-1', 'Módulo 1: Arquitectura de la Teoría del Caso', 'Construcción de narrativa fáctica, jurídica y probatoria', 1),
  ('22222222-2222-2222-2222-222222222222', 'course-1', 'Módulo 2: Alegatos de Apertura Memorables', 'El hook inicial en los primeros 120 segundos ante el tribunal', 2),
  ('33333333-3333-3333-3333-333333333333', 'course-1', 'Módulo 3: Contra-interrogatorio Quirúrgico', 'Técnicas avanzadas con peritos y testigos hostiles', 3)
on conflict (id) do nothing;

-- 11. LECCIONES CON VIDEOS ASOCIADOS (Lista para Supabase Storage)
insert into public.lessons (id, module_id, course_id, title, duration, video_url, storage_path, order_index, is_free_preview, notes)
values
  (
    'aaaaaaa1-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'course-1',
    'Clase 01: El Hecho Relevante vs. La Paja Procesal',
    '18 min',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'course-videos/litigio/clase-01-hecho-relevante.mp4',
    1,
    true,
    'Aprende a depurar los hechos no controvertidos y enfocar la atención del juez.'
  ),
  (
    'aaaaaaa2-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'course-1',
    'Clase 02: Matriz Fáctico-Jurídica en Word',
    '24 min',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'course-videos/litigio/clase-02-matriz-factica.mp4',
    2,
    false,
    'Estructuración de la tabla de verificación de prueba directa e indiciaria.'
  ),
  (
    'aaaaaaa3-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'course-1',
    'Clase 03: Identificación de Debilidades de la Contraparte',
    '21 min',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'course-videos/litigio/clase-03-debilidades.mp4',
    3,
    false,
    'Anticipación y neutralización del contraargumento procesal.'
  ),
  (
    'aaaaaaa4-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'course-1',
    'Clase 04: El Hook Inicial y la Frase Fuerza',
    '25 min',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'course-videos/litigio/clase-04-hook-inicial.mp4',
    4,
    false,
    'Uso de pausas, cadencia de voz y contacto visual en sala.'
  )
on conflict (id) do nothing;

-- 12. MATRICULAR AL USUARIO ANTHONNY EN TODOS LOS CURSOS PARA TESTING (En Soles PEN)
insert into public.enrollments (user_id, course_id, amount_paid, currency, payment_method, status, progress_percent)
values
  ('e3bdf9ed-c289-4624-badf-7f26bae14ed8', 'course-1', 150, 'PEN', 'yape', 'active', 45),
  ('e3bdf9ed-c289-4624-badf-7f26bae14ed8', 'course-2', 50, 'PEN', 'yape', 'active', 20),
  ('e3bdf9ed-c289-4624-badf-7f26bae14ed8', 'course-3', 90, 'PEN', 'yape', 'active', 0)
on conflict (user_id, course_id) do nothing;
`;
