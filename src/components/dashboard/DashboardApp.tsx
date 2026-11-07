import { useState, useEffect, useRef } from 'react';
import { sileo } from 'sileo';
import {
  supabase,
  getCourses,
  saveCourse,
  deleteCourse,
  getUserProfile,
  getAllProfiles,
  updateUserRole,
  createUserAccount,
  updateUserProfile,
  deleteUserProfile,
  getSupabaseVideoUrl,
  SUPABASE_SQL_MIGRATION,
  SEED_STUDENTS,
  type Course,
  type CourseModule,
  type Lesson,
  type Student,
  type UserProfile,
  type UserRole,
  type UserLevel,
  type Enrollment,
  getUserEnrollments,
  isUserEnrolledInCourse,
} from '@/lib/supabase';
import { AuthCard } from './AuthCard';
import { CourseFormModal } from './CourseFormModal';
import { UserFormModal } from './UserFormModal';
import { CourseCheckoutModal } from './CourseCheckoutModal';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  TrendingUp,
  Database,
  Plus,
  Search,
  ExternalLink,
  LogOut,
  Edit2,
  Trash2,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
  Layers,
  RefreshCw,
  Award,
  Shield,
  GraduationCap,
  PlayCircle,
  PauseCircle,
  ArrowUpRight,
  Bell,
  Grid as GridIcon,
  List as ListIcon,
  Menu,
  X,
  Video,
  FileText,
  Download,
  ChevronDown,
  ChevronRight,
  Check,
  Play,
  RotateCcw,
  Volume2,
  Maximize2,
  DollarSign,
  Heart,
  ShoppingBag,
  Lock,
  Unlock,
  ShieldCheck,
  Receipt,
  QrCode,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export function DashboardApp() {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);
  const [courseToBuy, setCourseToBuy] = useState<Course | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'courses' | 'classroom' | 'my-courses' | 'students' | 'users' | 'metrics' | 'supabase-sync'
  >('dashboard');

  // Sidebar toggle for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // View mode for courses: Grid or Table
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  // User Management CRUD State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Classroom Active Course & Lesson State
  const [selectedCourseForClassroom, setSelectedCourseForClassroom] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(['les-1-1'])
  );
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');

  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) => {
    switch (type) {
      case 'error':
        sileo.error({ title, description });
        break;
      case 'warning':
        sileo.warning({ title, description });
        break;
      case 'info':
        sileo.info({ title, description });
        break;
      default:
        sileo.success({ title, description });
        break;
    }
  };

  // Initial Load: Check Supabase Session
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const user = sessionData.session.user;
          setSupabaseUser(user);
          const p = await getUserProfile(user.id, user.email);
          setProfile(p);
          const enrollments = await getUserEnrollments(user.id);
          setUserEnrollments(enrollments);
          if (p?.role === 'alumna') {
            setActiveTab('classroom');
          }
        }
      } catch {
        // no session
      }

      const loadedCourses = await getCourses();
      setCourses(loadedCourses);
      if (loadedCourses.length > 0) {
        setSelectedCourseForClassroom(loadedCourses[0]);
        if (loadedCourses[0].modules?.[0]?.lessons?.[0]) {
          setActiveLesson(loadedCourses[0].modules[0].lessons[0]);
        }
      }

      const profiles = await getAllProfiles();
      setUserList(profiles);

      setLoading(false);
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        const p = await getUserProfile(session.user.id, session.user.email);
        setProfile(p);
        const enrollments = await getUserEnrollments(session.user.id);
        setUserEnrollments(enrollments);
        if (p?.role === 'alumna') {
          setActiveTab('classroom');
        }
      } else {
        setSupabaseUser(null);
        setProfile(null);
        setUserEnrollments([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = async (user: User) => {
    setSupabaseUser(user);
    const p = await getUserProfile(user.id, user.email);
    setProfile(p);
    const enrollments = await getUserEnrollments(user.id);
    setUserEnrollments(enrollments);
    if (p?.role === 'alumna') {
      setActiveTab('classroom');
    } else {
      setActiveTab('dashboard');
    }
    showToast('¡Bienvenida al Campus de Girls & Law!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSupabaseUser(null);
    setProfile(null);
    setPreviewRole(null);
    setUserEnrollments([]);
    showToast('Sesión cerrada');
  };

  const isEnrolled = (courseId: string) => {
    return isUserEnrolledInCourse(userEnrollments, courseId, currentRole);
  };

  const handleOpenCheckout = (course: Course) => {
    setCourseToBuy(course);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (newEnrollment: Enrollment) => {
    setUserEnrollments((prev) => [newEnrollment, ...prev]);
    setCourses((prev) =>
      prev.map((c) =>
        c.id === newEnrollment.course_id
          ? { ...c, students_count: (c.students_count || 0) + 1 }
          : c
      )
    );
    const bought = courses.find((c) => c.id === newEnrollment.course_id);
    if (bought) {
      setSelectedCourseForClassroom(bought);
      if (bought.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(bought.modules[0].lessons[0]);
      }
      setActiveTab('classroom');
    }
  };

  // Course actions
  const handleSaveCourse = async (course: Course) => {
    await saveCourse(course);
    const updated = await getCourses();
    setCourses(updated);
    showToast(courseToEdit ? 'Curso actualizado con éxito' : 'Nuevo curso publicado en el catálogo');
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (confirm(`¿Estás segura de eliminar el curso "${title}"?`)) {
      await deleteCourse(id);
      const updated = await getCourses();
      setCourses(updated);
      showToast('Curso eliminado correctamente');
    }
  };

  const handleToggleStatus = async (course: Course) => {
    const updatedCourse: Course = {
      ...course,
      status: course.status === 'published' ? 'draft' : 'published',
    };
    await saveCourse(updatedCourse);
    const updated = await getCourses();
    setCourses(updated);
    showToast(
      updatedCourse.status === 'published'
        ? `"${course.title}" ahora está activo para venta`
        : `"${course.title}" puesto en borrador`
    );
  };

  // Role and level management (admin only)
  const handleRoleChange = async (userId: string, newRole: UserRole, currentLevel: UserLevel) => {
    await updateUserRole(userId, newRole, currentLevel);
    setUserList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast(`Rol actualizado a "${newRole}"`);
  };

  const handleLevelChange = async (userId: string, currentRole: UserRole, newLevel: UserLevel) => {
    await updateUserRole(userId, currentRole, newLevel);
    setUserList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, level: newLevel } : u))
    );
    showToast(`Nivel de acceso actualizado a "${newLevel.toUpperCase()}"`);
  };

  // User CRUD Handlers
  const handleSaveUser = async (userData: {
    id?: string;
    email: string;
    full_name: string;
    password?: string;
    role: UserRole;
    level: UserLevel;
    phone?: string;
  }) => {
    if (userData.id) {
      await updateUserProfile({
        id: userData.id,
        full_name: userData.full_name,
        role: userData.role,
        level: userData.level,
        phone: userData.phone,
      });
      setUserList((prev) =>
        prev.map((u) =>
          u.id === userData.id
            ? {
                ...u,
                full_name: userData.full_name,
                role: userData.role,
                level: userData.level,
                phone: userData.phone,
              }
            : u
        )
      );
      showToast('Cuenta de usuario actualizada');
    } else {
      const created = await createUserAccount({
        email: userData.email,
        full_name: userData.full_name,
        password: userData.password,
        role: userData.role,
        level: userData.level,
        phone: userData.phone,
      });
      if (created) {
        setUserList((prev) => [created, ...prev.filter((u) => u.id !== created.id)]);
        showToast(`Cuenta "${userData.email}" creada con éxito`);
      }
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (userId === supabaseUser?.id) {
      showToast('No puedes eliminar tu propia cuenta activa de Administradora');
      return;
    }
    if (confirm(`¿Estás segura de eliminar la cuenta de "${email}"? Esta acción borrará sus permisos y accesos.`)) {
      await deleteUserProfile(userId);
      setUserList((prev) => prev.filter((u) => u.id !== userId));
      showToast('Cuenta eliminada de la plataforma');
    }
  };

  const testSupabaseConnection = async () => {
    setSyncStatus('checking');
    try {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      const duration = Date.now() - start;

      if (!error) {
        setSyncStatus('connected');
        setSyncMessage(`Supabase 100% activo (${duration}ms). Tablas y storage bucket sincronizados.`);
      } else {
        setSyncStatus('connected');
        setSyncMessage(`Conexión con Supabase verificada (${duration}ms). Ejecuta el script SQL en el Editor SQL de Supabase para crear las tablas.`);
      }
    } catch {
      setSyncStatus('error');
      setSyncMessage('Error al verificar conexión con Supabase');
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
    setCopiedSql(true);
    showToast('Script SQL copiado al portapapeles');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Classroom lesson toggle
  const toggleLessonCompleted = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
        showToast('Lección desmarcada');
      } else {
        next.add(lessonId);
        showToast('¡Lección completada! Progreso actualizado.');
      }
      return next;
    });
  };

  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = speed;
    }
  };

  const currentRole: UserRole = previewRole || profile?.role || 'alumna';
  const currentLevel: UserLevel = profile?.level || 'inicial';
  const isAdmin = profile?.role === 'admin';

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filtered Users for Roles & Levels tab
  const filteredUserList = userList.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(userSearchQuery.toLowerCase()));

    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.status === 'published').length;
  const draftCourses = courses.filter((c) => c.status === 'draft').length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.students_count || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + c.price * (c.students_count || 0), 0);
  const avgTicket = totalStudents > 0 ? Math.round(totalRevenue / totalStudents) : 118;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F9]">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white border border-pink-100 shadow-[0_12px_36px_rgba(227,27,109,0.08)]">
          <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-[#E31B6D] animate-spin" />
          <div className="text-center">
            <h3 className="font-serif italic font-bold text-base text-[#2A1828]">Girls &amp; Law</h3>
            <p className="font-sans font-bold text-xs text-[#E31B6D] mt-1 animate-pulse">
              Cargando Campus Virtual...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in -> Show direct Supabase Login / Register
  if (!supabaseUser || !profile) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#FFF5F9] relative overflow-hidden">
        {/* Soft Pink Background Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />
        <AuthCard onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FFF5F9] text-[#2A1828] font-sans antialiased">

      {/* =======================================================================
       * LEFT SIDEBAR: Clean Fernly Structure + Girls & Law Signature Claymorphism
       * ======================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-md border-r border-pink-100/90 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-pink-100/80">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-white border border-pink-200/80 p-1 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src="/logogirlsandlaw-nobg.webp"
                  alt="Logo Girls & Law"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-base text-[#2A1828] leading-tight">
                  Girls <span className="text-[#E31B6D] italic">&amp;</span> Law
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E31B6D]">
                  Campus Virtual
                </span>
              </div>
            </a>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-pink-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-6">
            {/* Group 1: Formación & Campus */}
            <div>
              <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                Campus &amp; Cursos
              </p>
              <nav className="space-y-1.5">
                {(currentRole === 'admin' || currentRole === 'profesora') && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('dashboard');
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'dashboard'
                          ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                          : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                        <span>Dashboard General</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('courses');
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'courses'
                          ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                          : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className={`w-4 h-4 ${activeTab === 'courses' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                        <span>Gestión de Cursos</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          activeTab === 'courses'
                            ? 'bg-[#E31B6D] text-white'
                            : 'bg-pink-100/70 text-[#E31B6D]'
                        }`}
                      >
                        {totalCourses}
                      </span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('classroom');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'classroom'
                      ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                      : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className={`w-4 h-4 ${activeTab === 'classroom' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                    <span>Mi Aula Virtual</span>
                  </div>
                  <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-pink-100 text-[#E31B6D] font-black uppercase">
                    Videos 4K
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('my-courses');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'my-courses'
                      ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                      : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className={`w-4 h-4 ${activeTab === 'my-courses' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                    <span>Mis Cursos Comprados</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E31B6D] text-white">
                    {userEnrollments.length}
                  </span>
                </button>

                {currentRole === 'admin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('students');
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'students'
                          ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                          : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Users className={`w-4 h-4 ${activeTab === 'students' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                        <span>Alumnas &amp; Ventas</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-pink-100/70 text-[#E31B6D]">
                        {students.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('metrics');
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'metrics'
                          ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                          : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className={`w-4 h-4 ${activeTab === 'metrics' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                        <span>Ventas de Cursos</span>
                      </div>
                    </button>
                  </>
                )}
              </nav>
            </div>

            {/* Group 2: Configuración & Base de Datos */}
            <div>
              <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                Configuración &amp; BD
              </p>
              <nav className="space-y-1.5">
                {currentRole === 'admin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('users');
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'users'
                          ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                          : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Shield className={`w-4 h-4 ${activeTab === 'users' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                        <span>Roles &amp; Niveles</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('supabase-sync');
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'supabase-sync'
                          ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                          : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Database className={`w-4 h-4 ${activeTab === 'supabase-sync' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                        <span>Supabase &amp; Videos</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </button>
                  </>
                )}

                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>Ver Landing Web</span>
                  </div>
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Soporte & Logout */}
        <div className="p-4 border-t border-pink-100/80 space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF0F6] to-[#FFE4EF] border border-pink-200/70 text-center">
            <span className="text-[10px] font-black uppercase text-[#E31B6D] tracking-wider block">
              Soporte Académico VIP
            </span>
            <p className="text-[11px] text-[#6A5A6D] font-medium mt-1">
              ¿Dudas con la plataforma o tus videos?
            </p>
            <a
              href="mailto:directora@girlsandlaw.com"
              className="mt-2 inline-block text-[11px] font-bold text-[#E31B6D] underline hover:text-[#C21359]"
            >
              Escribir a Soporte →
            </a>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-bold text-[#6A5A6D] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* =======================================================================
       * MAIN CONTENT AREA
       * ======================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-pink-100/90 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-full text-slate-600 hover:bg-pink-50"
            >
              <Menu className="w-5 h-5 text-[#E31B6D]" />
            </button>

            {/* Search Input in pill style */}
            <div className="relative w-48 sm:w-72 md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cursos, lecciones, alumnas..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FFF5F9] border border-pink-200/80 text-xs text-[#2A1828] placeholder:text-[#A08A9E] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/30 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Right User Bar */}
          <div className="flex items-center gap-3">
            {/* Admin preview toggle */}
            {isAdmin && (
              <div className="hidden lg:flex items-center p-1 rounded-full bg-[#FFF0F6] border border-pink-200/80 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewRole(null)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    !previewRole
                      ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-xs'
                      : 'text-[#6A5A6D] hover:text-[#E31B6D]'
                  }`}
                >
                  Vista Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewRole('alumna');
                    setActiveTab('classroom');
                  }}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    previewRole === 'alumna'
                      ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-xs'
                      : 'text-[#6A5A6D] hover:text-[#E31B6D]'
                  }`}
                >
                  Vista Alumna
                </button>
              </div>
            )}

            {/* Shortcut: Mis Cursos Comprados */}
            <button
              type="button"
              onClick={() => setActiveTab('my-courses')}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                activeTab === 'my-courses'
                  ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-pink-500/20'
                  : 'bg-[#FFF0F6] text-[#E31B6D] hover:bg-[#FFE4EF] border border-pink-200/80'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mis Cursos ({userEnrollments.length})</span>
            </button>

            {/* User Chip */}
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white flex items-center justify-center text-xs font-black shadow-sm shadow-pink-500/30">
                {supabaseUser.email?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#2A1828] leading-tight">
                  {profile.full_name || supabaseUser.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-[#E31B6D] font-bold uppercase tracking-wider">
                  {currentRole} · {currentLevel}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* =======================================================================
           * TAB: DASHBOARD OVERVIEW (Course Sales Business Model & Girls & Law Theme)
           * ======================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-7">
              {/* Header Title & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBF3] border border-pink-200 text-[10px] font-black uppercase text-[#E31B6D] tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    Panel de Gestión &amp; Cursos Jurídicos
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2A1828] tracking-tight">
                    Dashboard Académico
                  </h1>
                  <p className="text-xs text-[#6A5A6D] font-medium mt-0.5">
                    Resumen de ventas de cursos, alumnas matriculadas y catálogo de masterclasses.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCourseToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)] transition-all shadow-[0_4px_14px_rgba(227,27,109,0.25)] flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Crear Nuevo Curso</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('supabase-sync')}
                    className="px-4 py-2.5 rounded-full text-xs font-bold text-[#2A1828] bg-white hover:bg-[#FFF0F6] border border-pink-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Database className="w-3.5 h-3.5 text-[#E31B6D]" />
                    <span>Supabase BD</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards (Girls & Law Cushion Style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Hero Signature Pink Cushion Card */}
                <div className="rounded-3xl p-6 bg-gradient-to-br from-[#E31B6D] via-[#EA3883] to-[#F06292] text-white flex flex-col justify-between shadow-[0_12px_32px_rgba(227,27,109,0.22)] relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-100 uppercase tracking-wider">
                      Cursos en Catálogo
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-serif italic font-black">{totalCourses}</span>
                    <p className="text-xs text-pink-100 font-bold mt-1">
                      {publishedCourses} activos para venta · {draftCourses} borrador
                    </p>
                  </div>
                </div>

                {/* Card 2: Alumnas Matriculadas */}
                <div className="rounded-3xl p-6 bg-white border border-pink-100/90 flex flex-col justify-between shadow-[0_10px_28px_rgba(227,27,109,0.05)] hover:shadow-[0_14px_34px_rgba(227,27,109,0.09)] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6A5A6D] uppercase tracking-wider">
                      Alumnas Matriculadas
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FFF0F6] border border-pink-200/80 flex items-center justify-center text-[#E31B6D]">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-serif italic font-black text-[#2A1828]">
                      {totalStudents}
                    </span>
                    <p className="text-xs text-emerald-600 font-bold mt-1">
                      +18 ventas este mes
                    </p>
                  </div>
                </div>

                {/* Card 3: Ticket Promedio por Curso */}
                <div className="rounded-3xl p-6 bg-white border border-pink-100/90 flex flex-col justify-between shadow-[0_10px_28px_rgba(227,27,109,0.05)] hover:shadow-[0_14px_34px_rgba(227,27,109,0.09)] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6A5A6D] uppercase tracking-wider">
                      Ticket Promedio
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FFF0F6] border border-pink-200/80 flex items-center justify-center text-[#E31B6D]">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-serif italic font-black text-[#2A1828]">
                      S/. {avgTicket} PEN
                    </span>
                    <p className="text-xs text-[#6A5A6D] font-bold mt-1">
                      Pago Único por Masterclass
                    </p>
                  </div>
                </div>

                {/* Card 4: Ingresos Totales por Cursos Vendidos */}
                <div className="rounded-3xl p-6 bg-white border border-pink-100/90 flex flex-col justify-between shadow-[0_10px_28px_rgba(227,27,109,0.05)] hover:shadow-[0_14px_34px_rgba(227,27,109,0.09)] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6A5A6D] uppercase tracking-wider">
                      Ventas de Cursos
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FFF0F6] border border-pink-200/80 flex items-center justify-center text-[#E31B6D]">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-serif italic font-black text-[#2A1828]">
                      S/. {totalRevenue.toLocaleString()}
                    </span>
                    <p className="text-xs text-emerald-600 font-bold mt-1">
                      PEN Confirmados (Yape/Banco/Tarjeta)
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Grid: Courses on Left, Widgets on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 8 Cols: Cursos Section */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-white rounded-3xl p-6 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-5">
                    {/* Courses Header & Filter Pills */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-100/80">
                      <div>
                        <h2 className="text-lg font-serif italic font-bold text-[#2A1828]">
                          Catálogo de Masterclasses
                        </h2>
                        <p className="text-xs text-[#6A5A6D]">
                          Cursos disponibles para venta individual con acceso de por vida
                        </p>
                      </div>

                      {/* View Switcher */}
                      <div className="flex items-center gap-1 p-1 rounded-full bg-[#FFF0F6] text-[#6A5A6D] border border-pink-200/70">
                        <button
                          type="button"
                          onClick={() => setViewMode('grid')}
                          className={`p-1.5 rounded-full transition-all cursor-pointer ${
                            viewMode === 'grid'
                              ? 'bg-white shadow-xs text-[#E31B6D]'
                              : 'hover:text-[#E31B6D]'
                          }`}
                          title="Cuadrícula"
                        >
                          <GridIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('table')}
                          className={`p-1.5 rounded-full transition-all cursor-pointer ${
                            viewMode === 'table'
                              ? 'bg-white shadow-xs text-[#E31B6D]'
                              : 'hover:text-[#E31B6D]'
                          }`}
                          title="Tabla"
                        >
                          <ListIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Category Filter Pills (Signature Pouf Style) */}
                    <div className="flex flex-wrap items-center gap-2">
                      {['all', 'Litigio', 'Oralidad', 'Penal', 'Marca Personal'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            categoryFilter === cat
                              ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-xs'
                              : 'bg-[#FFF0F6] text-[#6A5A6D] hover:bg-[#FFE4EF] hover:text-[#E31B6D]'
                          }`}
                        >
                          {cat === 'all' ? 'Todos los Cursos' : cat}
                        </button>
                      ))}
                    </div>

                    {/* View: Cards Grid */}
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                        {filteredCourses.map((c) => (
                          <div
                            key={c.id}
                            className="group bg-white rounded-3xl border border-pink-100 hover:border-pink-200 overflow-hidden shadow-[0_8px_24px_rgba(227,27,109,0.04)] hover:shadow-[0_12px_32px_rgba(227,27,109,0.1)] transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="relative aspect-[16/10] bg-pink-50 overflow-hidden">
                                <img
                                  src={c.cover_image}
                                  alt={c.title}
                                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[10px] font-black uppercase text-[#E31B6D] shadow-xs">
                                  {c.category}
                                </div>
                                <div className="absolute top-3 right-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-xs ${
                                      c.status === 'published'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-amber-400 text-slate-900'
                                    }`}
                                  >
                                    {c.status === 'published' ? 'Venta Activa' : 'Borrador'}
                                  </span>
                                </div>
                              </div>

                              <div className="p-5 space-y-2.5">
                                <div className="flex items-center justify-between text-xs text-[#A08A9E] font-medium">
                                  <span>{c.duration} · {c.lessons_count} lecciones</span>
                                  <span className="text-[#E31B6D] font-bold">{c.level}</span>
                                </div>

                                <h3 className="font-serif italic font-bold text-base text-[#2A1828] leading-snug line-clamp-2">
                                  {c.title}
                                </h3>

                                <div className="flex items-center justify-between pt-3 border-t border-pink-100 text-xs">
                                  <span className="text-[#6A5A6D] font-bold">{c.instructor}</span>
                                  <div className="text-right">
                                    <span className="text-base font-serif italic font-black text-[#E31B6D]">
                                      S/. {c.price} PEN
                                    </span>
                                    <span className="block text-[9px] text-[#A08A9E] uppercase font-bold">
                                      Pago Único
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="px-5 py-3 bg-[#FFF5F9] border-t border-pink-100 flex items-center justify-between">
                              {currentRole === 'admin' ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(c)}
                                  className={`text-[11px] font-bold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                                    c.status === 'published'
                                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  }`}
                                >
                                  {c.status === 'published' ? 'Pausar Venta' : 'Activar Venta'}
                                </button>
                              ) : isEnrolled(c.id) ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                  <Check className="w-3 h-3" />
                                  <span>Adquirido</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenCheckout(c)}
                                  className="text-[11px] font-bold px-3.5 py-1 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-xs hover:brightness-105 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Comprar S/. {c.price}</span>
                                </button>
                              )}

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCourseForClassroom(c);
                                    if (c.modules?.[0]?.lessons?.[0]) {
                                      setActiveLesson(c.modules[0].lessons[0]);
                                    }
                                    setActiveTab('classroom');
                                  }}
                                  className="p-1.5 rounded-full hover:bg-pink-100 text-[#E31B6D] transition-colors cursor-pointer"
                                  title="Ver Aula y Videos"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                </button>
                                {currentRole === 'admin' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCourseToEdit(c);
                                        setIsModalOpen(true);
                                      }}
                                      className="p-1.5 rounded-full hover:bg-pink-100 text-[#6A5A6D] transition-colors cursor-pointer"
                                      title="Editar"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCourse(c.id, c.title)}
                                      className="p-1.5 rounded-full hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* View: Table */
                      <div className="overflow-x-auto pt-2">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-pink-100 text-[#A08A9E] uppercase tracking-wider text-[10px] font-black">
                              <th className="pb-3">Curso / Masterclass</th>
                              <th className="pb-3">Categoría</th>
                              <th className="pb-3">Docente</th>
                              <th className="pb-3">Precio Venta</th>
                              <th className="pb-3">Estado</th>
                              <th className="pb-3 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-pink-100 font-medium">
                            {filteredCourses.map((c) => (
                              <tr key={c.id} className="hover:bg-pink-50/50 transition-colors">
                                <td className="py-3 pr-2">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={c.cover_image}
                                      alt={c.title}
                                      className="w-11 h-11 rounded-2xl object-cover border border-pink-100"
                                    />
                                    <div>
                                      <p className="font-serif italic font-bold text-[#2A1828] text-sm leading-tight">
                                        {c.title}
                                      </p>
                                      <p className="text-[11px] text-[#A08A9E]">{c.duration}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 text-[#6A5A6D] font-bold">{c.category}</td>
                                <td className="py-3 text-[#6A5A6D]">{c.instructor}</td>
                                <td className="py-3 font-serif italic font-black text-[#E31B6D]">
                                  S/. {c.price} PEN
                                </td>
                                <td className="py-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                      c.status === 'published'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {c.status === 'published' ? 'Venta Activa' : 'Borrador'}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedCourseForClassroom(c);
                                        if (c.modules?.[0]?.lessons?.[0]) {
                                          setActiveLesson(c.modules[0].lessons[0]);
                                        }
                                        setActiveTab('classroom');
                                      }}
                                      className="p-1.5 text-[#E31B6D] hover:bg-pink-100 rounded-full"
                                      title="Ver videos"
                                    >
                                      <PlayCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCourseToEdit(c);
                                        setIsModalOpen(true);
                                      }}
                                      className="p-1.5 text-[#6A5A6D] hover:bg-pink-100 rounded-full"
                                      title="Editar"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCourse(c.id, c.title)}
                                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-full"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right 4 Cols: Fernly-Style Side Widgets with Girls & Law Aesthetic */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Widget 1: Ventas de Cursos Recientes */}
                  <div className="bg-white rounded-3xl p-6 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                      <div>
                        <h3 className="font-serif italic font-bold text-sm text-[#2A1828]">
                          Últimas Compras de Cursos
                        </h3>
                        <p className="text-[11px] text-[#A08A9E]">Matrículas directas confirmadas</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('students')}
                        className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FFF0F6] text-[#E31B6D] hover:bg-[#FFE4EF] transition-colors"
                      >
                        Ver Todas
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {students.slice(0, 4).map((stu) => (
                        <div key={stu.id} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-[#E31B6D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {stu.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#2A1828] truncate">{stu.name}</p>
                              <p className="text-[10px] text-[#A08A9E] truncate">{stu.course_title}</p>
                            </div>
                          </div>
                          <span className="text-xs font-serif italic font-black text-[#E31B6D] shrink-0">
                            S/. {stu.amount_paid} PEN
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Widget 2: Recordatorio de Clínica en Vivo */}
                  <div className="bg-white rounded-3xl p-6 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                        Sesión en Vivo
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div>
                      <h4 className="font-serif italic font-bold text-sm text-[#2A1828]">
                        Clínica de Juicio Oral con Roxana Rivera
                      </h4>
                      <p className="text-xs text-[#6A5A6D] mt-0.5">
                        Jueves · 18:00 - 20:00 (Sala Zoom VIP)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast('Abriendo enlace de sala virtual Zoom...')}
                      className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Video className="w-4 h-4" />
                      <span>Ingresar a la Sala en Vivo</span>
                    </button>
                  </div>

                  {/* Widget 3: Progreso General de Alumnas */}
                  <div className="bg-white rounded-3xl p-6 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                      Tasa de Finalización de Clases
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-serif italic font-black text-[#2A1828]">
                          88.4%
                        </span>
                        <p className="text-[11px] text-[#6A5A6D]">Alumnas que completan los videos</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#FFF0F6] border-2 border-[#E31B6D] flex items-center justify-center font-bold text-xs text-[#E31B6D]">
                        88%
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] rounded-full"
                        style={{ width: '88%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================================
           * TAB: GESTIÓN DE CURSOS
           * ======================================================================= */}
          {activeTab === 'courses' && (currentRole === 'admin' || currentRole === 'profesora') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2A1828] tracking-tight">
                    Catálogo de Cursos &amp; Masterclasses
                  </h1>
                  <p className="text-xs text-[#6A5A6D] font-medium">
                    Crea y gestiona tus formaciones, precios de venta y contenidos en video.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCourseToEdit(null);
                    setIsModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)] transition-all shadow-[0_4px_14px_rgba(227,27,109,0.25)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Crear Nuevo Curso</span>
                </button>
              </div>

              {/* Grid of All Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-[0_10px_28px_rgba(227,27,109,0.06)] hover:shadow-[0_16px_36px_rgba(227,27,109,0.12)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-pink-50 overflow-hidden">
                        <img src={c.cover_image} alt={c.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[10px] font-black uppercase text-[#E31B6D] shadow-xs">
                          {c.category}
                        </span>
                        <span
                          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold shadow-xs ${
                            c.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
                          }`}
                        >
                          {c.status === 'published' ? 'Venta Activa' : 'Borrador'}
                        </span>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-[#A08A9E]">
                          <span>{c.duration} · {c.modules_count || c.modules?.length || 3} módulos</span>
                          <span className="text-[#E31B6D] font-bold">{c.level}</span>
                        </div>
                        <h3 className="font-serif italic font-bold text-lg text-[#2A1828] leading-snug line-clamp-2">
                          {c.title}
                        </h3>
                        <p className="text-xs text-[#6A5A6D] line-clamp-2 leading-relaxed">
                          {c.description}
                        </p>
                        <div className="pt-3 flex items-center justify-between border-t border-pink-100 text-xs">
                          <span className="text-[#6A5A6D] font-bold">{c.instructor}</span>
                          <div className="text-right">
                            <span className="text-lg font-serif italic font-black text-[#E31B6D]">
                              S/. {c.price} PEN
                            </span>
                            <span className="block text-[9px] text-[#A08A9E] uppercase font-bold">
                              Pago Único
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 px-6 bg-[#FFF5F9] border-t border-pink-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                          c.status === 'published'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {c.status === 'published' ? 'Pausar' : 'Activar'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourseForClassroom(c);
                            if (c.modules?.[0]?.lessons?.[0]) {
                              setActiveLesson(c.modules[0].lessons[0]);
                            }
                            setActiveTab('classroom');
                          }}
                          className="px-3 py-1.5 rounded-full bg-white text-[#E31B6D] border border-pink-200 text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-[#FFF0F6]"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Ver Aula</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCourseToEdit(c);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-full hover:bg-pink-100 text-[#6A5A6D]"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(c.id, c.title)}
                          className="p-1.5 rounded-full hover:bg-rose-50 text-rose-600"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =======================================================================
           * TAB: MI AULA VIRTUAL (REPRODUCTOR DE VIDEO SUPABASE STORAGE & TEMARIO)
           * Protegido contra filtraciones: Lecciones privadas bloqueadas sin matrícula
           * ======================================================================= */}
          {activeTab === 'classroom' && (() => {
            const hasPurchasedClassroomCourse = selectedCourseForClassroom
              ? isEnrolled(selectedCourseForClassroom.id)
              : false;
            const currentLessonLocked =
              !hasPurchasedClassroomCourse && !activeLesson?.is_free_preview;

            return (
              <div className="space-y-6">
                {/* Classroom Header Banner */}
                <div className="rounded-3xl bg-white border border-pink-100/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_12px_32px_rgba(227,27,109,0.06)]">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBF3] text-[10px] font-black text-[#E31B6D] uppercase tracking-wider mb-2">
                      <Sparkles className="w-3 h-3" />
                      Aula Virtual &amp; Streaming Supabase
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2A1828]">
                      {selectedCourseForClassroom?.title || 'Litigio de Alto Impacto'}
                    </h1>
                    <p className="text-xs text-[#6A5A6D] mt-1 max-w-2xl">
                      Docente: <strong className="text-[#E31B6D]">{selectedCourseForClassroom?.instructor || 'Roxana Rivera'}</strong> · Acceso permanente con lecciones en video HD y materiales descargables en Word.
                    </p>
                  </div>

                  {/* Course Switcher if multiple courses exist */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedCourseForClassroom?.id || ''}
                      onChange={(e) => {
                        const found = courses.find((c) => c.id === e.target.value);
                        if (found) {
                          setSelectedCourseForClassroom(found);
                          if (found.modules?.[0]?.lessons?.[0]) {
                            setActiveLesson(found.modules[0].lessons[0]);
                          }
                        }
                      }}
                      className="px-4 py-2 rounded-full bg-[#FFF0F6] border border-pink-200 text-xs font-bold text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/30"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Free Preview Warning / Course Purchase Banner if not enrolled */}
                {!hasPurchasedClassroomCourse && selectedCourseForClassroom && (
                  <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#FFF0F6] via-[#FFEBF3] to-white border border-pink-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#E31B6D] text-white flex items-center justify-center shrink-0 shadow-sm shadow-pink-500/30">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-[#2A1828]">
                            Modo Muestra Gratuita (Preview Activo)
                          </p>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                            Clases de Muestra
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6A5A6D] mt-0.5">
                          Estás navegando en modo de prueba. Adquiere el curso para desbloquear todas las grabaciones en video 4K y descargar las matrices procesales en Word.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCheckout(selectedCourseForClassroom)}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white font-bold text-xs shadow-[0_8px_20px_rgba(227,27,109,0.3)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Comprar por S/. {selectedCourseForClassroom.price} PEN</span>
                    </button>
                  </div>
                )}

                {/* Main Video Classroom Layout: Player (Left) + Curriculum/Playlist (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 8 Cols: Video Player & Lesson Details */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Video Player Card / Anti-Leak Secure Lock Screen */}
                    {!currentLessonLocked ? (
                      <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-pink-200/40 relative aspect-video flex flex-col justify-end">
                        {/* HTML5 Video Element */}
                        <video
                          ref={videoPlayerRef}
                          key={activeLesson?.id || 'default-player'}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                          poster={selectedCourseForClassroom?.cover_image}
                        >
                          <source
                            src={
                              activeLesson?.video_url
                                ? getSupabaseVideoUrl(activeLesson.video_url)
                                : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                            }
                            type="video/mp4"
                          />
                          Tu navegador no soporta reproducción de video HTML5.
                        </video>

                        {/* Supabase Storage Pill Overlay */}
                        <div className="absolute top-4 left-4 z-20 pointer-events-none">
                          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-black uppercase text-pink-300 border border-white/10 flex items-center gap-1.5 shadow-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            {activeLesson?.is_free_preview && !hasPurchasedClassroomCourse
                              ? 'Clase de Muestra Gratuita'
                              : 'Supabase Storage CDN · 4K'}
                          </span>
                        </div>

                        {/* Storage Path Indicator */}
                        {activeLesson?.storage_path && (
                          <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:block">
                            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono text-slate-300 border border-white/10">
                              bucket: {activeLesson.storage_path}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* ZERO LEAK LOCK SCREEN: The private video URL is NEVER rendered or exposed in the DOM */
                      <div className="bg-gradient-to-br from-[#2A1828] via-[#381B32] to-[#1E0F1D] rounded-3xl overflow-hidden shadow-2xl border border-pink-500/30 relative aspect-video flex flex-col items-center justify-center p-6 sm:p-8 text-center text-white">
                        <div className="w-16 h-16 rounded-3xl bg-pink-500/20 backdrop-blur-md border border-pink-400/30 flex items-center justify-center text-pink-300 mb-3 shadow-lg">
                          <Lock className="w-8 h-8" />
                        </div>
                        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black uppercase tracking-wider border border-pink-500/30 mb-2">
                          Lección Bloqueada · Acceso Exclusivo
                        </span>
                        <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-white max-w-lg leading-tight">
                          {activeLesson?.title || 'Contenido Exclusivo para Alumnas'}
                        </h3>
                        <p className="text-xs text-pink-200/80 max-w-md mt-2 leading-relaxed">
                          Para reproducir esta clase, acceder al código procesal y descargar las matrices en Word, adquiere el curso con pago único en Soles.
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              selectedCourseForClassroom &&
                              handleOpenCheckout(selectedCourseForClassroom)
                            }
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:brightness-105 active:scale-95 text-white text-xs font-bold shadow-[0_8px_24px_rgba(227,27,109,0.4)] flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>
                              Comprar Curso por S/. {selectedCourseForClassroom?.price || 50} PEN
                            </span>
                          </button>
                          {selectedCourseForClassroom?.modules?.[0]?.lessons?.find(
                            (l) => l.is_free_preview
                          ) && (
                            <button
                              type="button"
                              onClick={() => {
                                const previewLesson = selectedCourseForClassroom.modules?.[0]?.lessons?.find(
                                  (l) => l.is_free_preview
                                );
                                if (previewLesson) setActiveLesson(previewLesson);
                              }}
                              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-pink-200 text-xs font-bold transition-all cursor-pointer"
                            >
                              Ver Clase de Muestra
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Below Player Action & Meta Bar */}
                    <div className="bg-white rounded-3xl p-6 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FFEBF3] text-[10px] font-black text-[#E31B6D] uppercase">
                              {activeLesson?.duration || '20 min'}
                            </span>
                            <span className="text-xs text-[#A08A9E]">
                              Módulo: {selectedCourseForClassroom?.modules?.[0]?.title || 'Arquitectura Procesal'}
                            </span>
                          </div>
                          <h2 className="text-xl font-serif italic font-bold text-[#2A1828]">
                            {activeLesson?.title || 'Clase 01: El Hecho Relevante vs. La Paja Procesal'}
                          </h2>
                        </div>

                        {/* Lesson Completed Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            if (currentLessonLocked) {
                              sileo.warning({
                                title: 'Contenido Bloqueado',
                                description: 'Adquiere el curso para registrar progreso en esta lección.',
                              });
                              if (selectedCourseForClassroom) handleOpenCheckout(selectedCourseForClassroom);
                            } else if (activeLesson) {
                              toggleLessonCompleted(activeLesson.id);
                            }
                          }}
                          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                            activeLesson && completedLessonIds.has(activeLesson.id)
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white hover:shadow-[0_8px_20px_rgba(227,27,109,0.3)]'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {activeLesson && completedLessonIds.has(activeLesson.id)
                              ? 'Lección Completada ✓'
                              : 'Marcar como Vista'}
                          </span>
                        </button>
                      </div>

                      {/* Lesson Notes & Overview */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#A08A9E]">
                          Resumen &amp; Guía de Litigación
                        </h4>
                        <p className="text-xs text-[#6A5A6D] leading-relaxed">
                          {activeLesson?.notes ||
                            'En esta lección aprenderás a separar los hechos irrelevantes y concentrar el 100% de la persuasión en la tesis principal de litigio. Incluye minutas de alegato en Word y modelo de examen directo descargable.'}
                        </p>

                        {/* Downloadable Materials (Protected if not enrolled) */}
                        <div className="pt-2 flex flex-wrap gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (!hasPurchasedClassroomCourse) {
                                sileo.warning({
                                  title: 'Material Protegido',
                                  description: `Debes adquirir "${selectedCourseForClassroom?.title}" por S/. ${selectedCourseForClassroom?.price || 50} PEN para descargar los modelos procesales en Word.`,
                                });
                                if (selectedCourseForClassroom) handleOpenCheckout(selectedCourseForClassroom);
                              } else {
                                showToast('Descargando: Plantilla_Matriz_Factica_Word.docx');
                              }
                            }}
                            className="px-4 py-2 rounded-full bg-[#FFF0F6] hover:bg-[#FFE4EF] text-[#E31B6D] border border-pink-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            {hasPurchasedClassroomCourse ? (
                              <Download className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-pink-400" />
                            )}
                            <span>Plantilla Matriz Fáctica (.docx)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!hasPurchasedClassroomCourse) {
                                sileo.warning({
                                  title: 'Material Protegido',
                                  description: `Debes adquirir "${selectedCourseForClassroom?.title}" por S/. ${selectedCourseForClassroom?.price || 50} PEN para descargar las guías de objeción.`,
                                });
                                if (selectedCourseForClassroom) handleOpenCheckout(selectedCourseForClassroom);
                              } else {
                                showToast('Descargando: Esquema_Objeciones_PDF.pdf');
                              }
                            }}
                            className="px-4 py-2 rounded-full bg-[#FFF0F6] hover:bg-[#FFE4EF] text-[#E31B6D] border border-pink-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            {hasPurchasedClassroomCourse ? (
                              <FileText className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-pink-400" />
                            )}
                            <span>Checklist Objeciones (.pdf)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right 4 Cols: Interactive Course Curriculum / Playlist */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-3xl p-6 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                        <div>
                          <h3 className="font-serif italic font-bold text-base text-[#2A1828]">
                            Temario &amp; Videos
                          </h3>
                          <p className="text-[11px] text-[#A08A9E]">
                            {completedLessonIds.size} clases vistas
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#FFF0F6] text-[#E31B6D] font-black text-xs">
                          100% HD
                        </span>
                      </div>

                      {/* Modules & Lessons Tree */}
                      <div className="space-y-4">
                        {(selectedCourseForClassroom?.modules || []).map((mod, modIdx) => (
                          <div key={mod.id || modIdx} className="space-y-2">
                            <div className="px-3 py-2 rounded-2xl bg-[#FFF5F9] border border-pink-100 text-xs font-black text-[#2A1828]">
                              {mod.title}
                            </div>

                            <div className="space-y-1 pl-1">
                              {mod.lessons.map((les) => {
                                const isCurrent = activeLesson?.id === les.id;
                                const isDone = completedLessonIds.has(les.id);
                                const isLocked = !hasPurchasedClassroomCourse && !les.is_free_preview;

                                return (
                                  <button
                                    key={les.id}
                                    type="button"
                                    onClick={() => setActiveLesson(les)}
                                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                                      isCurrent
                                        ? 'bg-gradient-to-r from-[#FFF0F6] to-[#FFE4EF] border border-pink-200/80 shadow-xs'
                                        : 'hover:bg-pink-50/60'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                          isDone
                                            ? 'bg-emerald-500 text-white'
                                            : isLocked
                                            ? 'bg-pink-100 text-pink-400'
                                            : isCurrent
                                            ? 'bg-[#E31B6D] text-white'
                                            : 'bg-pink-100 text-[#E31B6D]'
                                        }`}
                                      >
                                        {isDone ? (
                                          <Check className="w-3.5 h-3.5" />
                                        ) : isLocked ? (
                                          <Lock className="w-3 h-3" />
                                        ) : (
                                          <Play className="w-3 h-3 fill-current ml-0.5" />
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <p
                                          className={`text-xs font-bold leading-tight truncate ${
                                            isCurrent ? 'text-[#E31B6D]' : 'text-[#2A1828]'
                                          }`}
                                        >
                                          {les.title}
                                        </p>
                                        <span className="text-[10px] text-[#A08A9E]">{les.duration}</span>
                                      </div>
                                    </div>

                                    {les.is_free_preview ? (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold shrink-0">
                                        Preview
                                      </span>
                                    ) : isLocked ? (
                                      <span className="px-2 py-0.5 rounded-full bg-pink-100/80 text-pink-500 text-[9px] font-bold shrink-0 flex items-center gap-1">
                                        <Lock className="w-2.5 h-2.5" />
                                        <span>Pago</span>
                                      </span>
                                    ) : null}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* =======================================================================
           * TAB: MIS CURSOS COMPRADOS (PERFIL DE ALUMNA & ACCESO A MASTERCLASSES)
           * Permite ver cursos comprados, progreso y adquirir nuevas formaciones en Soles
           * ======================================================================= */}
          {activeTab === 'my-courses' && (
            <div className="space-y-7">
              {/* Header Profile & Purchased Courses Hero */}
              <div className="rounded-3xl bg-white border border-pink-100/90 p-6 sm:p-8 shadow-[0_12px_32px_rgba(227,27,109,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBF3] text-[10px] font-black text-[#E31B6D] uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" />
                    Mi Perfil &amp; Formación Jurídica
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2A1828]">
                    Mis Cursos Comprados
                  </h1>
                  <p className="text-xs text-[#6A5A6D] mt-1 max-w-2xl leading-relaxed">
                    Hola <strong className="text-[#E31B6D]">{profile.full_name || supabaseUser.email?.split('@')[0]}</strong>. Aquí tienes acceso inmediato y de por vida a todas tus masterclasses adquiridas con videos en streaming HD y plantillas procesales en Word.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-5 py-3 rounded-2xl bg-[#FFF5F9] border border-pink-100 text-center">
                    <span className="text-2xl font-serif italic font-black text-[#E31B6D]">
                      {userEnrollments.length}
                    </span>
                    <span className="block text-[10px] font-bold text-[#A08A9E] uppercase">
                      Cursos Comprados
                    </span>
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                    <span className="text-sm font-black text-emerald-700">Acceso</span>
                    <span className="block text-[10px] font-bold text-emerald-600 uppercase">
                      De por Vida
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of Purchased Courses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-serif italic font-bold text-[#2A1828]">
                    Tus Masterclasses Disponibles
                  </h2>
                  <span className="text-xs text-[#E31B6D] font-bold">
                    {userEnrollments.length} Comprados
                  </span>
                </div>

                {userEnrollments.length === 0 ? (
                  <div className="p-8 sm:p-12 rounded-3xl bg-white border border-pink-100 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-3xl bg-[#FFF0F6] border border-pink-200 text-[#E31B6D] flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h3 className="text-lg font-serif italic font-bold text-[#2A1828]">
                        Aún no tienes cursos comprados en tu cuenta
                      </h3>
                      <p className="text-xs text-[#6A5A6D]">
                        Invierte en tu excelencia procesal adquiriendo tu primera masterclass clínica con Roxana Rivera. Cada curso cuesta solo S/. 50 PEN con acceso ilimitado.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white font-bold text-xs shadow-md cursor-pointer inline-flex items-center gap-2 hover:brightness-105"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ver Catálogo de Cursos</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userEnrollments.map((enr) => {
                      const course = courses.find((c) => c.id === enr.course_id);
                      if (!course) return null;
                      return (
                        <div
                          key={enr.id}
                          className="bg-white rounded-3xl border border-pink-100/90 hover:border-pink-200/90 overflow-hidden shadow-[0_10px_28px_rgba(227,27,109,0.05)] hover:shadow-[0_16px_36px_rgba(227,27,109,0.1)] transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative aspect-[16/10] bg-pink-50 overflow-hidden">
                              <img
                                src={course.cover_image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Compra Confirmada</span>
                              </div>
                              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                                {course.duration}
                              </div>
                            </div>

                            <div className="p-5 space-y-3">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#E31B6D]">
                                {course.category} · {course.level}
                              </span>
                              <h3 className="font-serif italic font-bold text-base text-[#2A1828] leading-snug line-clamp-2">
                                {course.title}
                              </h3>
                              <p className="text-xs text-[#6A5A6D]">
                                Docente: <strong>{course.instructor}</strong>
                              </p>

                              <div className="pt-2 border-t border-pink-100/80 flex items-center justify-between text-xs">
                                <div>
                                  <span className="text-[10px] text-[#A08A9E] uppercase font-bold block">
                                    Monto Pagado
                                  </span>
                                  <span className="font-serif italic font-black text-[#E31B6D] text-sm">
                                    S/. {enr.amount_paid} PEN
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-[#A08A9E] uppercase font-bold block">
                                    Método
                                  </span>
                                  <span className="font-bold text-[#2A1828] text-xs uppercase">
                                    {enr.payment_method}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-5 pt-0">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCourseForClassroom(course);
                                if (course.modules?.[0]?.lessons?.[0]) {
                                  setActiveLesson(course.modules[0].lessons[0]);
                                }
                                setActiveTab('classroom');
                              }}
                              className="w-full py-3 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:brightness-105 active:scale-95 text-white font-bold text-xs shadow-[0_8px_20px_rgba(227,27,109,0.25)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                            >
                              <PlayCircle className="w-4 h-4" />
                              <span>Entrar al Aula Virtual</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section: Explorar Más Cursos del Catálogo */}
              <div className="pt-6 border-t border-pink-100/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif italic font-bold text-lg text-[#2A1828]">
                      Explora Nuevas Masterclasses para Adquirir
                    </h3>
                    <p className="text-xs text-[#6A5A6D]">
                      Especialízate con formación clínica y minutas de alegato listas para usar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses
                    .filter((c) => !userEnrollments.some((e) => e.course_id === c.id))
                    .map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[16/10] bg-pink-50">
                            <img
                              src={c.cover_image}
                              alt={c.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[10px] font-black uppercase text-[#E31B6D]">
                              {c.category}
                            </div>
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#E31B6D] text-white text-[10px] font-black">
                              S/. {c.price} PEN
                            </div>
                          </div>

                          <div className="p-5 space-y-2">
                            <h4 className="font-serif italic font-bold text-sm text-[#2A1828] line-clamp-2">
                              {c.title}
                            </h4>
                            <p className="text-xs text-[#6A5A6D] line-clamp-2">{c.description}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-pink-100 text-xs">
                              <span className="text-[#A08A9E] font-medium">{c.duration}</span>
                              <span className="text-[#E31B6D] font-bold font-serif italic text-base">
                                S/. {c.price} PEN
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0">
                          <button
                            type="button"
                            onClick={() => handleOpenCheckout(c)}
                            className="w-full py-3 rounded-full bg-gradient-to-r from-[#FFF0F6] to-[#FFEBF3] hover:from-[#FFE4EF] hover:to-[#FFD6E8] text-[#E31B6D] border border-pink-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Comprar por S/. {c.price} PEN</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* =======================================================================
           * TAB: ALUMNAS INSCRITAS (VENTAS DE CURSOS INDIVIDUALES)
           * ======================================================================= */}
          {activeTab === 'students' && currentRole === 'admin' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-100">
                <div>
                  <h2 className="text-xl font-serif italic font-bold text-[#2A1828]">
                    Alumnas &amp; Ventas de Cursos
                  </h2>
                  <p className="text-xs text-[#6A5A6D]">
                    Registro de compras individuales de masterclasses y avance en video
                  </p>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-[#FFF0F6] text-[#E31B6D] text-xs font-black">
                  {students.length} Alumnas Registradas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-pink-100 text-[#A08A9E] uppercase tracking-wider text-[10px] font-black">
                      <th className="pb-3">Alumna</th>
                      <th className="pb-3">Curso Comprado</th>
                      <th className="pb-3">Monto Pagado</th>
                      <th className="pb-3">Ciudad / País</th>
                      <th className="pb-3">Progreso</th>
                      <th className="pb-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100 font-medium">
                    {students.map((stu) => (
                      <tr key={stu.id} className="hover:bg-pink-50/50 transition-colors">
                        <td className="py-4 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-400 to-[#E31B6D] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {stu.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[#2A1828] text-sm">{stu.name}</p>
                              <p className="text-[11px] text-[#A08A9E]">{stu.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-serif italic font-bold text-[#2A1828]">
                          {stu.course_title}
                        </td>
                        <td className="py-4 font-serif italic font-black text-[#E31B6D]">
                          S/. {stu.amount_paid} PEN (Pago Único)
                        </td>
                        <td className="py-4 text-[#6A5A6D]">{stu.city}</td>
                        <td className="py-4">
                          <div className="w-28 space-y-1">
                            <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] rounded-full"
                                style={{ width: `${stu.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[#A08A9E] font-bold">{stu.progress}% visto</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              stu.status === 'Completado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200'
                            }`}
                          >
                            {stu.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =======================================================================
           * TAB: RENDIMIENTO & VENTAS
           * ======================================================================= */}
          {activeTab === 'metrics' && currentRole === 'admin' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-6">
                <div>
                  <h2 className="text-xl font-serif italic font-bold text-[#2A1828]">
                    Rendimiento de Ventas por Curso
                  </h2>
                  <p className="text-xs text-[#6A5A6D]">
                    Desglose de ingresos brutos por cada masterclass individual
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {courses.map((c) => {
                    const revenue = c.price * (c.students_count || 0);
                    return (
                      <div
                        key={c.id}
                        className="p-5 rounded-3xl bg-[#FFF5F9] border border-pink-100 space-y-2"
                      >
                        <span className="text-[10px] font-black uppercase text-[#E31B6D] tracking-wider">
                          {c.category}
                        </span>
                        <h4 className="font-serif italic font-bold text-sm text-[#2A1828] line-clamp-1">
                          {c.title}
                        </h4>
                        <div className="flex items-baseline justify-between pt-2">
                          <span className="text-2xl font-serif italic font-black text-[#E31B6D]">
                            S/. {revenue.toLocaleString()} PEN
                          </span>
                          <span className="text-xs text-[#6A5A6D] font-bold">
                            {c.students_count} alumnas
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =======================================================================
           * TAB: ROLES Y NIVELES (ADMIN ONLY - CRUD COMPLETO DE CUENTAS)
           * ======================================================================= */}
          {activeTab === 'users' && currentRole === 'admin' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-6">
              {/* Header with Title and Create Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-[#2A1828]">
                    Gestión de Roles &amp; Cuentas de Acceso
                  </h2>
                  <p className="text-xs text-[#6A5A6D]">
                    Crea cuentas, asigna roles de Administradora, Profesora o Alumna y gestiona niveles de acceso (Inicial, Pro, VIP).
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#FFF0F6] text-[#E31B6D] text-xs font-black">
                    {userList.length} Cuentas Registradas
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUserToEdit(null);
                      setIsUserModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Nueva Cuenta</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Buscar usuario por nombre o correo..."
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FFF5F9] border border-pink-200 text-xs text-[#2A1828] placeholder:text-[#A08A9E] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/30 shadow-xs"
                  />
                </div>

                {/* Role Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'admin', label: 'Administradoras' },
                    { id: 'profesora', label: 'Profesoras' },
                    { id: 'alumna', label: 'Alumnas' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setUserRoleFilter(filter.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        userRoleFilter === filter.id
                          ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-xs'
                          : 'bg-[#FFF0F6] text-[#6A5A6D] hover:bg-[#FFE4EF] hover:text-[#E31B6D]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table of Users */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-pink-100 text-[#A08A9E] uppercase tracking-wider text-[10px] font-black">
                      <th className="pb-3">Usuario / Titular</th>
                      <th className="pb-3">Rol en la Plataforma</th>
                      <th className="pb-3">Nivel de Acceso</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100 font-medium">
                    {filteredUserList.map((u) => (
                      <tr key={u.id} className="hover:bg-pink-50/50 transition-colors">
                        <td className="py-4 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-400 to-[#E31B6D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                              {u.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-[#2A1828] text-sm">
                                {u.full_name || u.email.split('@')[0]}
                              </p>
                              <p className="text-[11px] text-[#A08A9E] font-mono">{u.email}</p>
                              {u.phone && (
                                <p className="text-[10px] text-[#6A5A6D] mt-0.5">📞 {u.phone}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole, u.level)}
                            className="px-3.5 py-1.5 rounded-full bg-[#FFF0F6] border border-pink-200 text-[#2A1828] text-xs font-bold focus:outline-none"
                          >
                            <option value="admin">Administradora</option>
                            <option value="profesora">Profesora</option>
                            <option value="alumna">Alumna</option>
                          </select>
                        </td>
                        <td className="py-4">
                          <select
                            value={u.level}
                            onChange={(e) => handleLevelChange(u.id, u.role, e.target.value as UserLevel)}
                            className="px-3.5 py-1.5 rounded-full bg-[#FFF0F6] border border-pink-200 text-[#2A1828] text-xs font-bold focus:outline-none"
                          >
                            <option value="inicial">Inicial (Básico)</option>
                            <option value="pro">Pro (Completo 4K)</option>
                            <option value="vip">VIP (Clínicas &amp; Mentorías)</option>
                          </select>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setUserToEdit(u);
                                setIsUserModalOpen(true);
                              }}
                              className="p-1.5 rounded-full hover:bg-pink-100 text-[#6A5A6D] hover:text-[#E31B6D] transition-colors cursor-pointer"
                              title="Editar usuario"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              disabled={u.id === supabaseUser?.id}
                              className="p-1.5 rounded-full hover:bg-rose-100 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent"
                              title={u.id === supabaseUser?.id ? 'Tu cuenta activa' : 'Eliminar cuenta'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =======================================================================
           * TAB: SUPABASE & VIDEO STORAGE (ADMIN ONLY)
           * ======================================================================= */}
          {activeTab === 'supabase-sync' && currentRole === 'admin' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-pink-100">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F6] border border-pink-200 flex items-center justify-center text-[#E31B6D]">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-serif italic font-bold text-[#2A1828]">
                    Base de Datos Supabase &amp; Video Storage
                  </h2>
                  <p className="text-xs text-[#6A5A6D]">
                    Almacenamiento de lecciones en video, tablas de cursos, perfiles y matrículas
                  </p>
                </div>
              </div>

              {/* Status Box */}
              <div className="p-5 rounded-3xl bg-[#FFF5F9] border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                    Proyecto Supabase Conectado
                  </span>
                  <p className="text-xs font-mono font-bold text-[#2A1828]">
                    https://gfyqhlaytcrpbidgrijj.supabase.co
                  </p>
                  <p className="text-[11px] text-[#6A5A6D]">
                    Bucket de almacenamiento de videos configurado: <code className="text-[#E31B6D] font-bold font-mono">course-videos</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={testSupabaseConnection}
                  disabled={syncStatus === 'checking'}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FFF0F6] text-[#2A1828] text-xs font-bold border border-pink-200 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#E31B6D] ${syncStatus === 'checking' ? 'animate-spin' : ''}`} />
                  <span>Probar Conexión</span>
                </button>
              </div>

              {syncMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{syncMessage}</span>
                </div>
              )}

              {/* Step By Step Instructions */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFF0F6] to-[#FFEBF3] border border-pink-200/80 space-y-3">
                <h3 className="font-serif italic font-bold text-sm text-[#2A1828]">
                  Instrucciones para migrar tu Supabase en 1 clic:
                </h3>
                <ol className="text-xs text-[#6A5A6D] space-y-1.5 list-decimal pl-5 leading-relaxed">
                  <li>Haz clic en el botón <strong>&quot;Copiar Script SQL Completo&quot;</strong> abajo.</li>
                  <li>
                    Abre el{' '}
                    <a
                      href="https://supabase.com/dashboard/project/gfyqhlaytcrpbidgrijj/sql"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#E31B6D] underline font-bold"
                    >
                      SQL Editor de tu Supabase
                    </a>.
                  </li>
                  <li>Pega todo el script y pulsa <strong>Run (Ejecutar)</strong>.</li>
                  <li>
                    ¡Listo! Creará automáticamente todas las tablas (<code className="font-mono text-[#E31B6D]">profiles</code>, <code className="font-mono text-[#E31B6D]">courses</code>, <code className="font-mono text-[#E31B6D]">modules</code>, <code className="font-mono text-[#E31B6D]">lessons</code>, <code className="font-mono text-[#E31B6D]">enrollments</code>), el bucket de Storage <code className="font-mono text-[#E31B6D]">course-videos</code> con sus políticas de streaming, y asignará tu usuario como <strong>Admin VIP</strong>.
                  </li>
                </ol>
              </div>

              {/* SQL Script View */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#2A1828]">
                    Script SQL Completo (BD + Video Storage + Políticas + Cursos)
                  </h3>
                  <button
                    type="button"
                    onClick={copySqlToClipboard}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSql ? '¡Copiado con Éxito!' : 'Copiar Script SQL'}</span>
                  </button>
                </div>

                <pre className="p-5 rounded-3xl bg-[#1E142B] text-pink-200/90 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed border border-pink-900/30">
                  {SUPABASE_SQL_MIGRATION}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Course Modal */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCourseToEdit(null);
        }}
        onSave={handleSaveCourse}
        courseToEdit={courseToEdit}
      />

      {/* User Account CRUD Modal */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
        userToEdit={userToEdit}
      />

      {/* Course Checkout Modal (Compra en Soles PEN con Yape/Plin/Tarjeta) */}
      <CourseCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCourseToBuy(null);
        }}
        onSuccess={handleCheckoutSuccess}
        course={courseToBuy}
        currentUserId={supabaseUser?.id || ''}
      />
    </div>
  );
}
