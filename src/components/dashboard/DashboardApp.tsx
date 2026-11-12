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
  isYouTubeUrl,
  getYouTubeEmbedUrl,
  uploadVideoToSupabaseStorage,
  getRealStudents,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlan,
  type Course,
  type CourseModule,
  type Lesson,
  type Student,
  type UserProfile,
  type UserRole,
  type UserLevel,
  type Enrollment,
  type PaymentSettings,
  getUserEnrollments,
  enrollUserInCourse,
  revokeEnrollment,
  isUserEnrolledInCourse,
  getPaymentSettings,
  savePaymentSettings,
  LOCAL_STORAGE_ACTIVE_USER_KEY,
} from '@/lib/supabase';
import { AuthCard } from './AuthCard';
import { CourseFormModal } from './CourseFormModal';
import { UserFormModal } from './UserFormModal';
import { CourseCheckoutModal } from './CourseCheckoutModal';
import { StudentSettingsModal } from './StudentSettingsModal';
import { ProtectedVideoPlayer } from './ProtectedVideoPlayer';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Search,
  ExternalLink,
  LogOut,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Award,
  Crown,
  Shield,
  GraduationCap,
  PlayCircle,
  PauseCircle,
  ArrowUpRight,
  ArrowRight,
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
  Zap,
  Unlock,
  ShieldCheck,
  Receipt,
  QrCode,
  Upload,
  Loader2,
  UserPlus,
  Settings,
  Building2,
  MessageCircle,
  Copy,
  Save,
  Phone,
  CreditCard,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export function DashboardApp() {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  // Sincronización real con BD: Si no hay alumnas en la BD, la lista inicia vacía ("si no hay datos que veamos sin datos")
  const [students, setStudents] = useState<Student[]>([]);
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);
  const [courseToBuy, setCourseToBuy] = useState<Course | null>(null);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'courses' | 'classroom' | 'my-courses' | 'subscriptions' | 'students' | 'users' | 'billing'
  >('dashboard');

  // Student Settings Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToManage, setStudentToManage] = useState<Student | null>(null);

  // Roxana's Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(getPaymentSettings());

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
  const lessonFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingLessonVideo, setIsUploadingLessonVideo] = useState(false);

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

  // Initial Load: Check Supabase Session or Local Active Session
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
          const enrollments = await getUserEnrollments(user.id, p?.level);
          setUserEnrollments(enrollments);
          if (p?.role === 'alumna') {
            setActiveTab('classroom');
          }
        } else if (typeof window !== 'undefined') {
          // Check local registered active session
          const localActive = localStorage.getItem(LOCAL_STORAGE_ACTIVE_USER_KEY);
          if (localActive) {
            try {
              const user = JSON.parse(localActive) as User;
              setSupabaseUser(user);
              const p = await getUserProfile(user.id, user.email);
              setProfile(p);
              const enrollments = await getUserEnrollments(user.id, p?.level);
              setUserEnrollments(enrollments);
              if (p?.role === 'alumna') {
                setActiveTab('classroom');
              }
            } catch {
              // fallback
            }
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
      } else {
        setSelectedCourseForClassroom(null);
        setActiveLesson(null);
      }

      // Sincronización real con Supabase:
      const realStudents = await getRealStudents();
      setStudents(realStudents);

      const profiles = await getAllProfiles();
      setUserList(profiles);

      // Si viene con parámetro ?plan=plan-xxx desde la landing page, abrir checkout
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const planParam = params.get('plan');
        if (planParam) {
          const matchPlan = SUBSCRIPTION_PLANS.find((p) => p.id === planParam);
          if (matchPlan) {
            setSelectedPlanForCheckout(matchPlan);
            setIsCheckoutOpen(true);
          }
        }

        // Si regresa de pasarela automática con ?payment=success:
        const paymentStatus = params.get('payment');
        const returnCourseId = params.get('course_id');
        const returnPlanId = params.get('plan_id');

        if (paymentStatus === 'success') {
          try {
            const activeUser =
              sessionData.session?.user ||
              (localStorage.getItem(LOCAL_STORAGE_ACTIVE_USER_KEY)
                ? (JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACTIVE_USER_KEY)!) as User)
                : null);

            if (activeUser) {
              if (returnCourseId) {
                const targetCourse = loadedCourses.find((c) => c.id === returnCourseId);
                await enrollUserInCourse({
                  userId: activeUser.id,
                  courseId: returnCourseId,
                  amountPaid: targetCourse?.price || 0,
                  paymentMethod: 'Mercado Pago (Auto-Validado)',
                });
                const updatedEnr = await getUserEnrollments(activeUser.id);
                setUserEnrollments(updatedEnr);
                if (targetCourse) {
                  setSelectedCourseForClassroom(targetCourse);
                  if (targetCourse.modules?.[0]?.lessons?.[0]) {
                    setActiveLesson(targetCourse.modules[0].lessons[0]);
                  }
                }
                setActiveTab('classroom');
                sileo.success({
                  title: '¡Pago verificado automáticamente!',
                  description: `Has adquirido "${targetCourse?.title || 'tu formación'}". Ya tienes acceso completo de por vida.`,
                });
              } else if (returnPlanId) {
                const targetPlan = SUBSCRIPTION_PLANS.find((p) => p.id === returnPlanId);
                if (targetPlan) {
                  const subRes = await subscribeUserToPlan({
                    userId: activeUser.id,
                    planId: returnPlanId as any,
                    paymentMethod: 'Mercado Pago (Auto-Validado)',
                  });
                  const updatedEnr = await getUserEnrollments(activeUser.id, subRes.level);
                  setUserEnrollments(updatedEnr);
                  setActiveTab('classroom');
                  sileo.success({
                    title: `¡Plan ${targetPlan.name} activado con éxito!`,
                    description: 'Tu membresía ha sido validada y confirmada automáticamente.',
                  });
                }
              }

              // Limpiar query params de la URL sin recargar
              window.history.replaceState({}, '', window.location.pathname);
            }
          } catch (err) {
            console.warn('Error processing returning payment:', err);
          }
        }
      }

      setLoading(false);
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        const p = await getUserProfile(session.user.id, session.user.email);
        setProfile(p);
        const enrollments = await getUserEnrollments(session.user.id, p?.level);
        setUserEnrollments(enrollments);
        if (p?.role === 'alumna') {
          setActiveTab('classroom');
        }

        // Si la alumna ingresó confirmando su correo electrónico desde el enlace de activación
        if (
          typeof window !== 'undefined' &&
          (window.location.hash?.includes('type=signup') ||
            window.location.hash?.includes('type=email_change') ||
            window.location.search?.includes('type=signup'))
        ) {
          sileo.success({
            title: '¡Cuenta activada con éxito!',
            description: 'Tu correo ha sido verificado. Bienvenida al Campus de Girls & Law.',
          });
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        const localActive =
          typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_ACTIVE_USER_KEY) : null;
        if (!localActive) {
          setSupabaseUser(null);
          setProfile(null);
          setUserEnrollments([]);
        }
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
    const enrollments = await getUserEnrollments(user.id, p?.level);
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_USER_KEY);
    }
    setSupabaseUser(null);
    setProfile(null);
    setPreviewRole(null);
    setUserEnrollments([]);
    showToast('Sesión cerrada');
  };

  const isEnrolled = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return isUserEnrolledInCourse(userEnrollments, courseId, currentRole, currentLevel, course?.level);
  };

  const handleOpenCheckout = (course: Course) => {
    setCourseToBuy(course);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = async (
    result: Enrollment | { plan: SubscriptionPlan; level: UserLevel }
  ) => {
    if ('course_id' in result) {
      setUserEnrollments((prev) => [result, ...prev]);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === result.course_id
            ? { ...c, students_count: (c.students_count || 0) + 1 }
            : c
        )
      );
      const bought = courses.find((c) => c.id === result.course_id);
      if (bought) {
        setSelectedCourseForClassroom(bought);
        if (bought.modules?.[0]?.lessons?.[0]) {
          setActiveLesson(bought.modules[0].lessons[0]);
        }
        setActiveTab('classroom');
      }
    } else {
      // Suscripción a Plan Base, Full o Ultra
      if (profile) {
        setProfile({ ...profile, level: result.level });
      }
      if (supabaseUser) {
        const enr = await getUserEnrollments(supabaseUser.id, result.level);
        setUserEnrollments(enr);
      }
      setActiveTab('classroom');
    }

    // Actualizar alumnas y ventas en tiempo real
    const realStudents = await getRealStudents();
    setStudents(realStudents);
  };

  // Course actions
  const handleSaveCourse = async (course: Course) => {
    await saveCourse(course);
    const updated = await getCourses();
    setCourses(updated);
    showToast(courseToEdit ? 'Curso actualizado con éxito' : 'Nuevo curso publicado en el catálogo');
  };

  const handleUploadLessonVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeLesson || !selectedCourseForClassroom) return;

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

    setIsUploadingLessonVideo(true);
    try {
      const folder = `courses/${selectedCourseForClassroom.slug || selectedCourseForClassroom.id}/lessons`;
      const result = await uploadVideoToSupabaseStorage(file, folder);

      const updatedLesson: Lesson = {
        ...activeLesson,
        video_url: result.url,
        storage_path: result.storagePath,
      };
      setActiveLesson(updatedLesson);

      const updatedModules = (selectedCourseForClassroom.modules || []).map((m) => ({
        ...m,
        lessons: m.lessons.map((les) => (les.id === activeLesson.id ? updatedLesson : les)),
      }));

      const updatedCourse: Course = {
        ...selectedCourseForClassroom,
        modules: updatedModules,
      };

      setSelectedCourseForClassroom(updatedCourse);
      setCourses((prev) =>
        prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
      );

      await saveCourse(updatedCourse);

      sileo.success({
        title: '¡Video de lección subido!',
        description: `"${file.name}" se guardó con éxito para "${activeLesson.title}".`,
      });
    } catch {
      sileo.error({
        title: 'Error al subir video',
        description: 'No se pudo procesar la subida del archivo de video.',
      });
    } finally {
      setIsUploadingLessonVideo(false);
      if (lessonFileInputRef.current) {
        lessonFileInputRef.current.value = '';
      }
    }
  };

  const handleUpdateLessonVideoUrl = async (newUrl: string) => {
    if (!activeLesson || !selectedCourseForClassroom) return;

    const trimmedUrl = newUrl.trim();
    if (!trimmedUrl) return;

    const isYt = isYouTubeUrl(trimmedUrl);
    const updatedLesson: Lesson = {
      ...activeLesson,
      video_url: trimmedUrl,
      storage_path: isYt ? `youtube/${getYouTubeVideoId(trimmedUrl)}` : activeLesson.storage_path,
    };
    setActiveLesson(updatedLesson);

    const updatedModules = (selectedCourseForClassroom.modules || []).map((m) => ({
      ...m,
      lessons: m.lessons.map((les) => (les.id === activeLesson.id ? updatedLesson : les)),
    }));

    const updatedCourse: Course = {
      ...selectedCourseForClassroom,
      modules: updatedModules,
    };

    setSelectedCourseForClassroom(updatedCourse);
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );

    await saveCourse(updatedCourse);

    sileo.success({
      title: isYt ? '¡YouTube No Listado Vinculado!' : '¡Enlace de Video Guardado!',
      description: `La lección "${activeLesson.title}" ahora reproduce el video en alta definición.`,
    });
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
    if (supabaseUser?.id === userId) {
      setProfile((prev) => (prev ? { ...prev, level: newLevel } : prev));
      const reloaded = await getUserEnrollments(userId, newLevel);
      setUserEnrollments(reloaded);
    }
    showToast(`Nivel de acceso actualizado a "${newLevel.toUpperCase()}"`);
  };

  const handleEnrollUser = async (userId: string, courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    const newEnr = await enrollUserInCourse({
      userId,
      courseId,
      amountPaid: course.price,
      currency: 'PEN',
      paymentMethod: 'Asignación Admin',
    });
    if (supabaseUser?.id === userId) {
      setUserEnrollments((prev) => [newEnr, ...prev.filter((e) => e.course_id !== courseId)]);
    }
    showToast(`Matriculada con éxito en "${course.title}"`);
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

  // Student Settings Handlers (Gestión individual de cada alumna)
  const handleEnrollStudentInCourse = async (userId: string, courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    await enrollUserInCourse({
      userId,
      courseId,
      amountPaid: course?.price || 0,
      paymentMethod: 'Asignación Admin',
    });
    const realStudents = await getRealStudents();
    setStudents(realStudents);
    if (supabaseUser && userId === supabaseUser.id) {
      const enr = await getUserEnrollments(supabaseUser.id, profile?.level);
      setUserEnrollments(enr);
    }
  };

  const handleRevokeStudentEnrollment = async (enrollmentId: string) => {
    await revokeEnrollment(enrollmentId);
    const realStudents = await getRealStudents();
    setStudents(realStudents);
    if (supabaseUser) {
      const enr = await getUserEnrollments(supabaseUser.id, profile?.level);
      setUserEnrollments(enr);
    }
  };

  const handleUpdateStudentProfile = async (
    userId: string,
    data: { level: UserLevel; role: UserRole; full_name?: string; phone?: string }
  ) => {
    await updateUserProfile({
      id: userId,
      full_name: data.full_name,
      role: data.role,
      level: data.level,
      phone: data.phone,
    });
    const updatedUsers = await getAllProfiles();
    setUserList(updatedUsers);
    const realStudents = await getRealStudents();
    setStudents(realStudents);
    if (supabaseUser && userId === supabaseUser.id) {
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  const handleSavePaymentSettings = (newSettings: PaymentSettings) => {
    savePaymentSettings(newSettings);
    setPaymentSettings(newSettings);
    sileo.success({
      title: 'Plataforma de Cobro Actualizada',
      description: 'Los datos de Yape, BCP y WhatsApp de Roxana se guardaron con éxito y se reflejan en el checkout.',
    });
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
  const isAdmin = profile?.role === 'admin' || profile?.role === 'coordinadora' || profile?.role === 'sub_admin';
  const hasAdminPrivileges = currentRole === 'admin' || currentRole === 'coordinadora' || currentRole === 'sub_admin';
  const hasStaffPrivileges = hasAdminPrivileges || currentRole === 'profesora';

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
  // Sincronización real con BD:
  // Si no hay ventas ni alumnas en la base de datos, los valores son 0 ("si no hay datos que veamos sin datos")
  const totalStudents = students.length;
  const totalRevenue = students.reduce((acc, s) => acc + (s.amount_paid || 0), 0);
  const avgTicket = totalStudents > 0 ? Math.round(totalRevenue / totalStudents) : 0;
  const avgProgress = totalStudents > 0 ? Math.round(students.reduce((acc, s) => acc + (s.progress || 0), 0) / totalStudents) : 0;

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
            {/* Si es Admin / Staff (Administrador, Sub Admin, Profesora) */}
            {hasStaffPrivileges ? (
              <div className="space-y-5">
                <div>
                  <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                    Panel de Administración
                  </p>
                  <nav className="space-y-1.5">
                    {/* 1. Dashboard */}
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

                    {/* 2. Cursos */}
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
                      {totalCourses > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-pink-100/70 text-[#E31B6D]">
                          {totalCourses}
                        </span>
                      )}
                    </button>

                    {/* 3. Alumnas & Ventas */}
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
                      {students.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-pink-100/70 text-[#E31B6D]">
                          {students.length}
                        </span>
                      )}
                    </button>

                    {/* 4. Planes & Suscripciones */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('subscriptions');
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'subscriptions'
                          ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                          : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Crown className={`w-4 h-4 ${activeTab === 'subscriptions' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                        <span>Planes &amp; Suscripciones</span>
                      </div>
                    </button>

                    {/* 5. Roles & Equipo */}
                    {hasAdminPrivileges && (
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
                          <span>Roles &amp; Equipo</span>
                        </div>
                      </button>
                    )}

                    {/* 6. Plataforma de Cobro (Roxana) */}
                    {hasAdminPrivileges && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('billing');
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'billing'
                            ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                            : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <QrCode className={`w-4 h-4 ${activeTab === 'billing' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                          <span>Plataforma de Cobro</span>
                        </div>
                      </button>
                    )}
                  </nav>
                </div>

                {/* Subsección: Modo Alumna (Preview) */}
                <div className="pt-3 border-t border-pink-100">
                  <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                    Vista Alumna
                  </p>
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
                      <span>Ir al Aula Virtual (Preview)</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Si es Alumna */
              <div>
                <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                  Mi Formación Jurídica
                </p>
                <nav className="space-y-1.5">
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
                    {userEnrollments.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E31B6D] text-white">
                        {userEnrollments.length}
                      </span>
                    )}
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
                      <span>Catálogo de Cursos</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('subscriptions');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'subscriptions'
                        ? 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200/80 shadow-xs'
                        : 'text-[#6A5A6D] hover:text-[#E31B6D] hover:bg-pink-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Crown className={`w-4 h-4 ${activeTab === 'subscriptions' ? 'text-[#E31B6D]' : 'text-slate-400'}`} />
                      <span>Planes &amp; Suscripciones</span>
                    </div>
                  </button>
                </nav>
              </div>
            )}

            {/* Group 3: Navegación Externa */}
            <div>
              <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                Enlaces
              </p>
              <nav className="space-y-1.5">
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

      {/* Mobile Drawer Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          role="presentation"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-35 md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* =======================================================================
       * MAIN CONTENT AREA
       * ======================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 sm:h-20 bg-white/90 backdrop-blur-md border-b border-pink-100/90 px-3 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-full text-slate-600 hover:bg-pink-50"
            >
              <Menu className="w-5 h-5 text-[#E31B6D]" />
            </button>

            {/* Search Input in pill style */}
            <div className="relative w-32 xs:w-44 sm:w-72 md:w-80">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-full bg-[#FFF5F9] border border-pink-200/80 text-[11px] sm:text-xs text-[#2A1828] placeholder:text-[#A08A9E] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/30 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Right User Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
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
                    setPreviewRole('coordinadora');
                    setActiveTab('dashboard');
                  }}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    previewRole === 'coordinadora'
                      ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-xs'
                      : 'text-[#6A5A6D] hover:text-[#E31B6D]'
                  }`}
                >
                  Vista Sub Admin
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

            {/* Shortcut: Crear Nuevo Usuario (Admin & Sub Admin) */}
            {hasAdminPrivileges && (
              <button
                type="button"
                onClick={() => {
                  setUserToEdit(null);
                  setIsUserModalOpen(true);
                }}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFF0F6] text-[#E31B6D] hover:bg-[#FFE4EF] border border-pink-200/90 shadow-2xs transition-all cursor-pointer"
                title="Crear un nuevo usuario, alumna, profesora o sub-administradora"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Crear Usuario</span>
              </button>
            )}

            {/* Shortcut: Mis Cursos Comprados (Solo visible para modo Alumna) */}
            {!hasStaffPrivileges && (
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
                <span>Mis Cursos{userEnrollments.length > 0 ? ` (${userEnrollments.length})` : ''}</span>
              </button>
            )}

            {/* User Chip */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white flex items-center justify-center text-xs font-black shadow-sm shadow-pink-500/30 shrink-0">
                {supabaseUser.email?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#2A1828] leading-tight truncate max-w-[120px]">
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
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto overflow-x-clip">
          {/* =======================================================================
           * TAB: DASHBOARD OVERVIEW (Course Sales Business Model & Girls & Law Theme)
           * ======================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5 sm:space-y-7">
              {/* Header Title & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBF3] border border-pink-200 text-[10px] font-black uppercase text-[#E31B6D] tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    Panel de Gestión &amp; Cursos Jurídicos
                  </div>
                  <h1 className="text-xl sm:text-3xl font-serif italic font-bold text-[#2A1828] tracking-tight">
                    Dashboard Académico
                  </h1>
                  <p className="text-xs text-[#6A5A6D] font-medium mt-0.5">
                    Resumen de ventas de cursos, alumnas matriculadas y catálogo de masterclasses.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setCourseToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)] transition-all shadow-[0_4px_14px_rgba(227,27,109,0.25)] flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Crear Nuevo Curso</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards (Clean 2x2 Grid on Mobile, 4 Cols on Desktop) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {/* Card 1: Hero Signature Pink Cushion Card */}
                <div className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-gradient-to-br from-[#E31B6D] via-[#EA3883] to-[#F06292] text-white flex flex-col justify-between shadow-[0_12px_32px_rgba(227,27,109,0.22)] relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold text-pink-100 uppercase tracking-wider">
                      Cursos en Catálogo
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <div className="mt-2.5 sm:mt-4">
                    <span className="text-2xl sm:text-4xl font-serif italic font-black">{totalCourses}</span>
                    <p className="text-[10px] sm:text-xs text-pink-100 font-bold mt-1 line-clamp-1 sm:line-clamp-none">
                      {publishedCourses} activos · {draftCourses} borrador
                    </p>
                  </div>
                </div>

                {/* Card 2: Alumnas Matriculadas */}
                <div className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border border-pink-100/90 flex flex-col justify-between shadow-[0_10px_28px_rgba(227,27,109,0.05)] hover:shadow-[0_14px_34px_rgba(227,27,109,0.09)] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold text-[#6A5A6D] uppercase tracking-wider">
                      Alumnas
                    </span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FFF0F6] border border-pink-200/80 flex items-center justify-center text-[#E31B6D] shrink-0">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 sm:mt-4">
                    <span className="text-2xl sm:text-4xl font-serif italic font-black text-[#2A1828]">
                      {totalStudents}
                    </span>
                    <p className="text-[10px] sm:text-xs text-emerald-600 font-bold mt-1 line-clamp-1 sm:line-clamp-none">
                      {totalStudents > 0 ? `${totalStudents} matriculadas` : 'Sin registros'}
                    </p>
                  </div>
                </div>

                {/* Card 3: Planes y Membresías */}
                <div className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border border-pink-100/90 flex flex-col justify-between shadow-[0_10px_28px_rgba(227,27,109,0.05)] hover:shadow-[0_14px_34px_rgba(227,27,109,0.09)] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold text-[#6A5A6D] uppercase tracking-wider">
                      Planes Activos
                    </span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FFF0F6] border border-pink-200/80 flex items-center justify-center text-[#E31B6D] shrink-0">
                      <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 sm:mt-4">
                    <span className="text-xl sm:text-3xl font-serif italic font-black text-[#2A1828]">
                      3 Planes
                    </span>
                    <p className="text-[10px] sm:text-xs text-[#E31B6D] font-bold mt-1 line-clamp-1 sm:line-clamp-none">
                      Base · Full · Ultra
                    </p>
                  </div>
                </div>

                {/* Card 4: Ingresos por Suscripciones */}
                <div className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border border-pink-100/90 flex flex-col justify-between shadow-[0_10px_28px_rgba(227,27,109,0.05)] hover:shadow-[0_14px_34px_rgba(227,27,109,0.09)] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold text-[#6A5A6D] uppercase tracking-wider">
                      Ingresos Membresías
                    </span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FFF0F6] border border-pink-200/80 flex items-center justify-center text-[#E31B6D] shrink-0">
                      <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 sm:mt-4">
                    <span className="text-xl sm:text-3xl font-serif italic font-black text-[#2A1828]">
                      S/. {totalRevenue.toLocaleString()}
                    </span>
                    <p className="text-[10px] sm:text-xs text-emerald-600 font-bold mt-1 line-clamp-1 sm:line-clamp-none">
                      PEN Confirmados
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
                          Masterclasses organizadas por planes de membresía y temarios interactivos
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
                      filteredCourses.length === 0 ? (
                        <div className="p-10 rounded-3xl bg-[#FFF9FB] border border-pink-100/90 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-pink-100 text-[#E31B6D] flex items-center justify-center mx-auto">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <h4 className="font-serif italic font-bold text-base text-[#2A1828]">
                            No hay cursos en la base de datos
                          </h4>
                          <p className="text-xs text-[#6A5A6D] max-w-sm mx-auto">
                            Comienza creando tu primera masterclass con video y temario.
                          </p>
                          {hasAdminPrivileges && (
                            <button
                              type="button"
                              onClick={() => {
                                setCourseToEdit(null);
                                setIsModalOpen(true);
                              }}
                              className="px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E31B6D] to-[#F06292] shadow-xs cursor-pointer"
                            >
                              + Crear Primer Curso
                            </button>
                          )}
                        </div>
                      ) : (
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
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-block ${
                                      c.level === 'Clínico VIP'
                                        ? 'bg-gradient-to-r from-pink-100 to-amber-100 text-amber-900 border border-amber-200'
                                        : c.level === 'Inicial'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-purple-100 text-purple-800'
                                    }`}>
                                      {c.level === 'Clínico VIP' ? 'Plan Ultra VIP' : c.level === 'Inicial' ? 'Plan Base' : 'Plan Full'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="px-5 py-3 bg-[#FFF5F9] border-t border-pink-100 flex items-center justify-between">
                              {hasAdminPrivileges ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(c)}
                                  className={`text-[11px] font-bold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                                    c.status === 'published'
                                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  }`}
                                >
                                  {c.status === 'published' ? 'Pausar Curso' : 'Activar Curso'}
                                </button>
                              ) : isEnrolled(c.id) ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                  <Check className="w-3 h-3" />
                                  <span>Desbloqueado con tu Plan</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('subscriptions')}
                                  className="text-[11px] font-bold px-3.5 py-1 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white shadow-xs hover:brightness-105 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Crown className="w-3 h-3" />
                                  <span>Desbloquear con Plan</span>
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
                                {hasAdminPrivileges && (
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
                      )
                    ) : (
                      /* View: Table */
                      <div className="overflow-x-auto pt-2">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-pink-100 text-[#A08A9E] uppercase tracking-wider text-[10px] font-black">
                              <th className="pb-3">Curso / Masterclass</th>
                              <th className="pb-3">Categoría</th>
                              <th className="pb-3">Docente</th>
                              <th className="pb-3">Plan Requerido</th>
                              <th className="pb-3">Estado</th>
                              <th className="pb-3 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-pink-100 font-medium">
                            {filteredCourses.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-xs text-[#A08A9E]">
                                  No hay cursos registrados en la base de datos aún.
                                </td>
                              </tr>
                            ) : (
                              filteredCourses.map((c) => (
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
                                <td className="py-3">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-block ${
                                    c.level === 'Clínico VIP'
                                      ? 'bg-gradient-to-r from-pink-100 to-amber-100 text-amber-900 border border-amber-200'
                                      : c.level === 'Inicial'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {c.level === 'Clínico VIP' ? 'Plan Ultra VIP' : c.level === 'Inicial' ? 'Plan Base' : 'Plan Full'}
                                  </span>
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
                            ))
                            )}
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
                      {students.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-[#FFF9FB] border border-pink-100 text-center">
                          <p className="text-xs text-[#A08A9E] font-medium">Sin compras registradas aún</p>
                          <p className="text-[10px] text-pink-400 mt-0.5">Las compras en la BD aparecerán aquí</p>
                        </div>
                      ) : (
                        students.slice(0, 4).map((stu) => (
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
                        ))
                      )}
                    </div>
                  </div>

                  {/* Widget 2: Recordatorio de Sesión en Vivo */}
                  <div className="bg-white rounded-3xl p-6 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                        Sesión en Vivo
                      </span>
                      {totalCourses > 0 && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>

                    {totalCourses > 0 ? (
                      <>
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
                      </>
                    ) : (
                      <div className="text-center py-2 space-y-1">
                        <p className="text-xs text-[#A08A9E] font-medium">Sin sesiones programadas</p>
                        <p className="text-[10px] text-pink-400">Programa tus clases en vivo desde el panel</p>
                      </div>
                    )}
                  </div>

                  {/* Widget 3: Progreso General de Alumnas */}
                  <div className="bg-white rounded-3xl p-6 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-[#A08A9E]">
                      Tasa de Finalización de Clases
                    </h3>

                    {totalStudents > 0 ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-serif italic font-black text-[#2A1828]">
                              {avgProgress}%
                            </span>
                            <p className="text-[11px] text-[#6A5A6D]">Alumnas que completan los videos</p>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-[#FFF0F6] border-2 border-[#E31B6D] flex items-center justify-center font-bold text-xs text-[#E31B6D]">
                            {avgProgress}%
                          </div>
                        </div>

                        <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] rounded-full"
                            style={{ width: `${avgProgress}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2 space-y-1">
                        <p className="text-xs text-[#A08A9E] font-medium">0% · Sin actividad aún</p>
                        <p className="text-[10px] text-pink-400">Aparecerá cuando tus alumnas completen lecciones</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================================
           * TAB: CATÁLOGO Y GESTIÓN DE CURSOS (Visible para Alumnas y Administradoras)
           * ======================================================================= */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBF3] border border-pink-200 text-[10px] font-black uppercase text-[#E31B6D] tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    {hasStaffPrivileges ? 'Administración Académica' : 'Formación Jurídica de Élite'}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2A1828] tracking-tight">
                    Catálogo de Cursos &amp; Masterclasses
                  </h1>
                  <p className="text-xs text-[#6A5A6D] font-medium">
                    {hasStaffPrivileges
                      ? 'Crea y gestiona tus formaciones, precios de venta y contenidos en video.'
                      : 'Explora nuestras masterclasses clínicas con acceso de por vida y videos en alta definición.'}
                  </p>
                </div>

                {hasStaffPrivileges && (
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
                )}
              </div>

              {/* Courses Content: Empty State or Cards Grid */}
              {filteredCourses.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 sm:p-16 border border-pink-100/90 text-center space-y-4 shadow-[0_12px_32px_rgba(227,27,109,0.06)]">
                  <div className="w-16 h-16 rounded-full bg-[#FFF0F6] text-[#E31B6D] flex items-center justify-center mx-auto border border-pink-200 shadow-2xs">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-serif italic font-bold text-xl text-[#2A1828]">
                      No hay cursos registrados en el catálogo aún
                    </h3>
                    <p className="text-xs text-[#6A5A6D] max-w-md mx-auto mt-1.5 leading-relaxed">
                      Crea tu primera masterclass con video de YouTube no listado y temario interactivo para comenzar a impartir clases.
                    </p>
                  </div>
                  {hasStaffPrivileges && (
                    <button
                      type="button"
                      onClick={() => {
                        setCourseToEdit(null);
                        setIsModalOpen(true);
                      }}
                      className="px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E31B6D] to-[#F06292] shadow-md hover:shadow-lg hover:scale-102 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Crear Mi Primer Curso</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((c) => {
                    const userHasCourse = isEnrolled(c.id);

                    return (
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
                                userHasCourse
                                  ? 'bg-emerald-500 text-white'
                                  : c.status === 'published'
                                  ? 'bg-[#E31B6D] text-white'
                                  : 'bg-amber-400 text-slate-900'
                              }`}
                            >
                              {userHasCourse ? '✓ Desbloqueado' : c.status === 'published' ? 'Venta Activa' : 'Borrador'}
                            </span>
                          </div>

                          <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between text-xs text-[#A08A9E]">
                              <span>{c.duration} · {c.modules_count || c.modules?.length || 1} módulos</span>
                              <span className="text-[#E31B6D] font-bold">{c.level}</span>
                            </div>
                            <h3 className="font-serif italic font-bold text-lg text-[#2A1828] leading-snug line-clamp-2">
                              {c.title}
                            </h3>
                            <p className="text-xs text-[#6A5A6D] line-clamp-2 leading-relaxed">
                              {c.description || 'Masterclass jurídica de alto impacto con análisis de teoría del caso y litigio estratégico.'}
                            </p>
                            <div className="pt-3 flex items-center justify-between border-t border-pink-100 text-xs">
                              <span className="text-[#6A5A6D] font-bold">{c.instructor}</span>
                              <div className="text-right">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-block ${
                                  c.level === 'Clínico VIP'
                                    ? 'bg-gradient-to-r from-pink-100 to-amber-100 text-amber-900 border border-amber-200'
                                    : c.level === 'Inicial'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {c.level === 'Clínico VIP' ? 'Plan Ultra VIP' : c.level === 'Inicial' ? 'Plan Base' : 'Plan Full'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 px-6 bg-[#FFF5F9] border-t border-pink-100 flex items-center justify-between">
                          {hasStaffPrivileges ? (
                            <>
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
                            </>
                          ) : userHasCourse ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCourseForClassroom(c);
                                if (c.modules?.[0]?.lessons?.[0]) {
                                  setActiveLesson(c.modules[0].lessons[0]);
                                }
                                setActiveTab('classroom');
                              }}
                              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:brightness-105 transition-all cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Entrar al Aula Virtual</span>
                            </button>
                          ) : (
                            <div className="w-full flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCourseForClassroom(c);
                                  if (c.modules?.[0]?.lessons?.[0]) {
                                    setActiveLesson(c.modules[0].lessons[0]);
                                  }
                                  setActiveTab('classroom');
                                }}
                                className="px-3.5 py-2 rounded-full bg-white text-[#6A5A6D] hover:text-[#E31B6D] border border-pink-200 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Ver Muestra
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveTab('subscriptions')}
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                              >
                                <Crown className="w-3.5 h-3.5" />
                                <span>Desbloquear con Plan</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                      Aula Virtual &amp; Streaming HD
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2A1828]">
                      {selectedCourseForClassroom?.title || 'Litigio de Alto Impacto'}
                    </h1>
                    <p className="text-xs text-[#6A5A6D] mt-1 max-w-2xl">
                      Docente: <strong className="text-[#E31B6D]">{selectedCourseForClassroom?.instructor || 'Roxana Rivera'}</strong> · Acceso permanente con lecciones en video HD y materiales descargables en Word.
                    </p>
                  </div>

                  {/* Course Switcher if multiple courses exist */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
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
                      className="w-full sm:w-auto max-w-full px-4 py-2 rounded-full bg-[#FFF0F6] border border-pink-200 text-xs font-bold text-[#2A1828] focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/30 truncate"
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
                  <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#FFF0F6] via-[#FFEBF3] to-white border border-pink-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#E31B6D] text-white flex items-center justify-center shrink-0 shadow-sm shadow-pink-500/30">
                        <Lock className="w-4 h-4" />
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
                          Estás navegando en modo de prueba. Suscríbete a un plan de membresía para desbloquear todas las grabaciones en video HD y descargar las matrices procesales en Word.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('subscriptions')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white font-bold text-xs shadow-[0_8px_20px_rgba(227,27,109,0.3)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Crown className="w-4 h-4" />
                      <span>Desbloquear con Plan de Membresía</span>
                    </button>
                  </div>
                )}

                {/* Main Video Classroom Layout: Player (Left) + Curriculum/Playlist (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 8 Cols: Video Player & Lesson Details */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Video Player Card / Anti-Leak Secure Lock Screen */}
                    {!currentLessonLocked ? (
                      <ProtectedVideoPlayer
                        videoUrl={activeLesson?.video_url}
                        poster={selectedCourseForClassroom?.cover_image}
                        title={activeLesson?.title || selectedCourseForClassroom?.title}
                        userEmail={profile?.email || supabaseUser?.email || 'alumna@girlsandlaw.pe'}
                        isFreePreview={Boolean(activeLesson?.is_free_preview && !hasPurchasedClassroomCourse)}
                      />
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
                          Para reproducir esta clase, acceder al código procesal y descargar las matrices en Word, activa tu plan de membresía mensual en Soles.
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveTab('subscriptions')}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] hover:brightness-105 active:scale-95 text-white text-xs font-bold shadow-[0_8px_24px_rgba(227,27,109,0.4)] flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <Crown className="w-4 h-4" />
                            <span>
                              Desbloquear con Plan de Membresía
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

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                          {/* Admin / Teacher Video Options (YouTube Unlisted & MP4) */}
                          {hasStaffPrivileges && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentUrl = activeLesson?.video_url || '';
                                  const inputUrl = window.prompt(
                                    'Pega el enlace o ID de YouTube en modo "No listado" (ej: https://youtu.be/...):\n\nReproducción inmediata sin límite de peso y en alta definición HD.',
                                    currentUrl
                                  );
                                  if (inputUrl !== null && inputUrl.trim()) {
                                    handleUpdateLessonVideoUrl(inputUrl.trim());
                                  }
                                }}
                                className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-full bg-red-50 hover:bg-red-100/70 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                                title="Vincular video de YouTube No Listado (Gratis & Ilimitado)"
                              >
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span>YouTube (No listado)</span>
                              </button>

                              <input
                                type="file"
                                ref={lessonFileInputRef}
                                accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.mov,.webm,.mkv"
                                onChange={handleUploadLessonVideo}
                                className="hidden"
                              />
                              <button
                                type="button"
                                disabled={isUploadingLessonVideo}
                                onClick={() => lessonFileInputRef.current?.click()}
                                className="w-full sm:w-auto justify-center px-3.5 py-2.5 rounded-full bg-[#FFF0F6] hover:bg-[#FFE4EF] text-[#E31B6D] border border-pink-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                                title="Subir archivo de video MP4 directo"
                              >
                                {isUploadingLessonVideo ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Subiendo MP4...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Subir MP4</span>
                                  </>
                                )}
                              </button>
                            </>
                          )}

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
                            className={`w-full sm:w-auto justify-center px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
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
                        <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-2.5">
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
                            className="w-full sm:w-auto justify-center px-4 py-2 rounded-full bg-[#FFF0F6] hover:bg-[#FFE4EF] text-[#E31B6D] border border-pink-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
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
                            className="w-full sm:w-auto justify-center px-4 py-2 rounded-full bg-[#FFF0F6] hover:bg-[#FFE4EF] text-[#E31B6D] border border-pink-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
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

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                  <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#FFF5F9] border border-pink-100 text-center">
                    <span className="text-xl sm:text-2xl font-serif italic font-black text-[#E31B6D]">
                      {userEnrollments.length}
                    </span>
                    <span className="block text-[9px] sm:text-[10px] font-bold text-[#A08A9E] uppercase">
                      {userEnrollments.length === 1 ? 'Curso Comprado' : 'Cursos Comprados'}
                    </span>
                  </div>
                  <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                    <span className="text-xs sm:text-sm font-black text-emerald-700">
                      {currentLevel === 'vip' ? 'Membresía VIP' : 'Acceso'}
                    </span>
                    <span className="block text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase">
                      {currentLevel === 'vip' ? 'Catálogo Total' : 'De por Vida'}
                    </span>
                  </div>
                </div>
              </div>

              {/* VIP Member Special Banner */}
              {currentLevel === 'vip' && (
                <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#2A1828] via-[#3D1A35] to-[#2A1828] text-white border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#E31B6D] to-[#F06292] text-white flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/30">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-serif italic font-bold text-white">
                          Pase VIP Activo · Acceso Ilimitado a la Academia
                        </p>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[9px] font-black uppercase">
                          VIP Full Access
                        </span>
                      </div>
                      <p className="text-xs text-pink-200/80 mt-0.5">
                        Tu cuenta tiene habilitadas todas las grabaciones clínicas, temarios y expedientes procesales descargables de Girls &amp; Law.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('courses')}
                    className="w-full sm:w-auto text-center px-5 py-2.5 rounded-full bg-white text-[#E31B6D] font-bold text-xs shadow-md hover:bg-pink-50 transition-all shrink-0 cursor-pointer"
                  >
                    Ver Todo el Catálogo
                  </button>
                </div>
              )}

              {/* Grid of Purchased Courses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-serif italic font-bold text-[#2A1828]">
                    Tus Masterclasses Disponibles
                  </h2>
                  {userEnrollments.length > 0 && (
                    <span className="text-xs text-[#E31B6D] font-bold">
                      {userEnrollments.length} {userEnrollments.length === 1 ? 'Comprado' : 'Comprados'}
                    </span>
                  )}
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
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[#E31B6D] text-[10px] font-black shadow-xs">
                              {c.level === 'Clínico VIP' ? 'Plan Ultra' : c.level === 'Inicial' ? 'Plan Base' : 'Plan Full'}
                            </div>
                          </div>

                          <div className="p-5 space-y-2">
                            <h4 className="font-serif italic font-bold text-sm text-[#2A1828] line-clamp-2">
                              {c.title}
                            </h4>
                            <p className="text-xs text-[#6A5A6D] line-clamp-2">{c.description}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-pink-100 text-xs">
                              <span className="text-[#A08A9E] font-medium">{c.duration}</span>
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                c.level === 'Clínico VIP'
                                  ? 'bg-gradient-to-r from-pink-100 to-amber-100 text-amber-900 border border-amber-200'
                                  : c.level === 'Inicial'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {c.level === 'Clínico VIP' ? 'Plan Ultra VIP' : c.level === 'Inicial' ? 'Plan Base' : 'Plan Full'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (isEnrolled(c.id)) {
                                setSelectedCourseForClassroom(c);
                                if (c.modules?.[0]?.lessons?.[0]) {
                                  setActiveLesson(c.modules[0].lessons[0]);
                                }
                                setActiveTab('classroom');
                              } else {
                                setActiveTab('subscriptions');
                              }
                            }}
                            className="w-full py-3 rounded-full bg-gradient-to-r from-[#FFF0F6] to-[#FFEBF3] hover:from-[#FFE4EF] hover:to-[#FFD6E8] text-[#E31B6D] border border-pink-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                          >
                            {isEnrolled(c.id) ? (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Ingresar al Aula Virtual</span>
                              </>
                            ) : (
                              <>
                                <Crown className="w-3.5 h-3.5" />
                                <span>Desbloquear con Plan de Membresía</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* =======================================================================
           * TAB: PLANES & SUSCRIPCIONES (Plan Base, Plan Full con Meet, Plan Ultra)
           * ======================================================================= */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-8">
              {/* Header Hero */}
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEBF3] border border-pink-200 text-[10px] font-black uppercase text-[#E31B6D] tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  Membresías &amp; Planes 2026
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2A1828]">
                  Elige tu plan de formación legal
                </h1>
                <p className="text-xs text-[#6A5A6D]">
                  Suscripciones mensuales flexibles en Soles PEN. Cancela o cambia de plan cuando quieras.
                </p>
              </div>

              {/* 3 Subscription Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                {SUBSCRIPTION_PLANS.map((p) => {
                  const isCurrent = profile?.level === p.level;
                  return (
                    <div
                      key={p.id}
                      className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative overflow-hidden ${
                        p.popular
                          ? 'bg-gradient-to-b from-[#FFF0F6] via-white to-[#FFEBF3] border-2 border-[#E31B6D] shadow-[0_16px_40px_rgba(227,27,109,0.18)] scale-102 z-10'
                          : 'bg-white border border-pink-200/90 shadow-[0_10px_30px_rgba(227,27,109,0.06)] hover:border-pink-300'
                      }`}
                    >
                      {p.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white text-[9px] font-black uppercase tracking-wider py-1 px-4 rounded-bl-2xl shadow-xs">
                          ★ Más Elegido
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#E31B6D] bg-pink-100/70 px-2.5 py-0.5 rounded-full">
                            {p.badge}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Tu Plan Actual
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif italic font-bold text-xl text-[#2A1828]">
                          {p.name}
                        </h3>
                        <p className="text-xs font-bold text-[#E31B6D] mt-0.5">
                          {p.tagline}
                        </p>
                        <p className="text-[11px] text-[#6A5A6D] mt-2 leading-relaxed">
                          {p.description}
                        </p>

                        <div className="mt-5 pb-5 border-b border-pink-100/80">
                          <div className="flex items-baseline gap-2">
                            <span className="font-serif italic font-black text-3xl sm:text-4xl text-[#E31B6D]">
                              S/. {p.price}
                            </span>
                            <span className="text-xs font-bold text-[#A08A9E]">
                              PEN / mes
                            </span>
                          </div>
                          {p.compare_price && (
                            <span className="text-[10px] text-[#A08A9E] line-through">
                              Antes: S/. {p.compare_price} PEN
                            </span>
                          )}
                        </div>

                        <ul className="mt-5 space-y-2.5 text-xs font-bold text-[#2A1828]">
                          {p.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-[#E31B6D] shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-7 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCourseToBuy(null);
                            setSelectedPlanForCheckout(p);
                            setIsCheckoutOpen(true);
                          }}
                          className={`w-full py-3 px-5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 ${
                            p.popular
                              ? 'bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white hover:shadow-[0_8px_20px_rgba(227,27,109,0.35)]'
                              : 'bg-[#FFF0F6] text-[#E31B6D] hover:bg-[#FFE4EF] border border-pink-200'
                          }`}
                        >
                          <span>{isCurrent ? 'Plan Activo (Renovar)' : `Suscribirme a ${p.name}`}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informative Guarantee Card */}
              <div className="max-w-2xl mx-auto p-5 rounded-3xl bg-white border border-pink-100 text-center space-y-1.5 shadow-xs">
                <span className="text-[10px] font-black uppercase text-[#E31B6D] tracking-wider block">
                  ✦ Garantía Incondicional de 14 Días
                </span>
                <p className="text-xs text-[#6A5A6D]">
                  Accede a los cursos y clínicas. Si sientes que no transforma tu práctica procesal, solicita el reembolso completo sin preguntas.
                </p>
              </div>
            </div>
          )}

          {/* =======================================================================
           * TAB: ALUMNAS & VENTAS (Unificado: Ingresos de Ventas + Matrículas)
           * ======================================================================= */}
          {activeTab === 'students' && hasAdminPrivileges && (
            <div className="space-y-6">
              {/* Rendimiento de Ventas por Curso */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-4">
                <div>
                  <h2 className="text-xl font-serif italic font-bold text-[#2A1828]">
                    Rendimiento de Ventas por Masterclass
                  </h2>
                  <p className="text-xs text-[#6A5A6D]">
                    Desglose de ingresos confirmados y alumnas por cada formación
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {courses.length === 0 ? (
                    <p className="text-xs text-[#A08A9E] italic col-span-3">No hay cursos creados en la base de datos aún.</p>
                  ) : (
                    courses.map((c) => {
                      const revenue = c.price * (c.students_count || 0);
                      return (
                        <div
                          key={c.id}
                          className="p-5 rounded-3xl bg-[#FFF5F9] border border-pink-100 space-y-2"
                        >
                          <span className="text-[10px] font-black uppercase text-[#E31B6D] tracking-wider">
                            {c.category} · {c.level}
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
                    })
                  )}
                </div>
              </div>

              {/* Registro de Alumnas Matriculadas */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-100">
                  <div>
                    <h3 className="text-lg font-serif italic font-bold text-[#2A1828]">
                      Registro de Alumnas Matriculadas
                    </h3>
                    <p className="text-xs text-[#6A5A6D]">
                      Compras individuales de masterclasses y avance en clases de video
                    </p>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-[#FFF0F6] text-[#E31B6D] text-xs font-black">
                    {students.length} Alumnas Registradas
                  </span>
                </div>

              {/* Mobile Student Cards (sm:hidden) */}
              <div className="sm:hidden space-y-3">
                {students.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#A08A9E]">
                    No hay alumnas matriculadas ni ventas registradas en la base de datos aún.
                  </div>
                ) : (
                  students.map((stu) => (
                    <div
                      key={stu.id}
                      className="p-4 rounded-2xl bg-[#FFF9FB] border border-pink-100 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-[#E31B6D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {stu.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#2A1828] text-xs truncate">{stu.name}</p>
                            <p className="text-[10px] text-[#A08A9E] truncate">{stu.email}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0 ${
                            stu.status === 'Completado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-[#FFF0F6] text-[#E31B6D] border border-pink-200'
                          }`}
                        >
                          {stu.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-pink-100/60">
                        <div>
                          <span className="text-[10px] text-[#A08A9E] block">Curso</span>
                          <span className="font-serif italic font-bold text-[#2A1828] text-xs line-clamp-1">
                            {stu.course_title}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#A08A9E] block">Monto Pagado</span>
                          <span className="font-serif italic font-black text-[#E31B6D] text-xs">
                            S/. {stu.amount_paid} PEN
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#6A5A6D]">Progreso en video</span>
                          <span className="font-bold text-[#E31B6D]">{stu.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-pink-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] rounded-full"
                            style={{ width: `${stu.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Settings & Access Button */}
                      <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
                        <span className="text-[10px] text-[#A08A9E] font-medium">
                          Nivel: <strong className="uppercase text-[#2A1828]">{stu.level || 'inicial'}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setStudentToManage(stu);
                            setIsStudentModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FFF0F6] text-[#E31B6D] hover:bg-[#FFE0EB] border border-pink-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>Settings &amp; Accesos</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-pink-100 text-[#A08A9E] uppercase tracking-wider text-[10px] font-black">
                      <th className="pb-3">Alumna</th>
                      <th className="pb-3">Curso Comprado</th>
                      <th className="pb-3">Monto Pagado</th>
                      <th className="pb-3">Ciudad / País</th>
                      <th className="pb-3">Progreso</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3 text-right">Settings / Accesos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100 font-medium">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-xs text-[#A08A9E]">
                          No hay alumnas matriculadas ni ventas registradas en la base de datos aún.
                        </td>
                      </tr>
                    ) : (
                      students.map((stu) => (
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
                        <td className="py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setStudentToManage(stu);
                              setIsStudentModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-full bg-[#FFF0F6] text-[#E31B6D] hover:bg-[#FFE0EB] border border-pink-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            title="Gestionar cursos, accesos y nivel de esta alumna"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            <span>Settings Alumna</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

          {/* =======================================================================
           * TAB: ROLES Y NIVELES (ADMIN & SUB ADMIN - CRUD COMPLETO DE CUENTAS)
           * ======================================================================= */}
          {activeTab === 'users' && hasAdminPrivileges && (
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
                    { id: 'coordinadora', label: 'Coordinadoras (Sub Admin)' },
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

              {/* Mobile Cards for Users (sm:hidden) */}
              <div className="sm:hidden space-y-3">
                {filteredUserList.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl bg-[#FFF9FB] border border-pink-100 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-[#E31B6D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {u.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#2A1828] text-xs truncate">
                            {u.full_name || u.email.split('@')[0]}
                          </p>
                          <p className="text-[10px] text-[#A08A9E] font-mono truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setUserToEdit(u);
                            setIsUserModalOpen(true);
                          }}
                          className="p-1.5 rounded-full hover:bg-pink-100 text-[#6A5A6D] hover:text-[#E31B6D]"
                          title="Editar usuario"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          disabled={u.id === supabaseUser?.id}
                          className="p-1.5 rounded-full hover:bg-rose-100 text-rose-500 disabled:opacity-30"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Role & Level Selects */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-[#A08A9E] uppercase block mb-1">
                          Rol
                        </label>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole, u.level)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-pink-200 text-[#2A1828] text-[11px] font-bold"
                        >
                          <option value="admin">Admin</option>
                          <option value="coordinadora">Sub Admin</option>
                          <option value="profesora">Profesora</option>
                          <option value="alumna">Alumna</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#A08A9E] uppercase block mb-1">
                          Nivel
                        </label>
                        <select
                          value={u.level}
                          onChange={(e) => handleLevelChange(u.id, u.role, e.target.value as UserLevel)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-pink-200 text-[#2A1828] text-[11px] font-bold"
                        >
                          <option value="inicial">Inicial</option>
                          <option value="pro">Pro 4K</option>
                          <option value="vip">VIP Clínico</option>
                        </select>
                      </div>
                    </div>

                    {/* Course Assignment Dropdown */}
                    <div>
                      <label className="text-[10px] font-bold text-[#A08A9E] uppercase block mb-1">
                        Matricular Curso
                      </label>
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleEnrollUser(u.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-pink-200 text-[#E31B6D] text-[11px] font-bold"
                      >
                        <option value="" disabled>+ Asignar Curso...</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} (S/. {c.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table of Users (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-pink-100 text-[#A08A9E] uppercase tracking-wider text-[10px] font-black">
                      <th className="pb-3">Usuario / Titular</th>
                      <th className="pb-3">Rol en la Plataforma</th>
                      <th className="pb-3">Nivel de Acceso</th>
                      <th className="pb-3">Matricular / Asignar Curso</th>
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
                            <option value="coordinadora">Coordinadora (Sub Admin)</option>
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
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleEnrollUser(u.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="px-3 py-1.5 rounded-full bg-[#FFF0F6] hover:bg-[#FFE4EF] border border-pink-200 text-[#E31B6D] text-xs font-bold focus:outline-none cursor-pointer transition-colors"
                          >
                            <option value="" disabled>+ Asignar Curso...</option>
                            {courses.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.title} (S/. {c.price})
                              </option>
                            ))}
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
           * TAB: PLATAFORMA DE COBRO (ROXANA RIVERA - YAPE, BCP, QR & WHATSAPP)
           * ======================================================================= */}
          {activeTab === 'billing' && hasStaffPrivileges && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/90 shadow-[0_12px_32px_rgba(227,27,109,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#E31B6D] bg-[#FFF0F6] px-3 py-1 rounded-full border border-pink-200">
                    Pasarela Directa en Soles PEN
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-[#2A1828] mt-2">
                    Plataforma de Cobro de Roxana Rivera
                  </h2>
                  <p className="text-xs text-[#6A5A6D] mt-1 max-w-2xl">
                    Configura tus números de Yape, Plin, cuentas bancarias en Soles y WhatsApp directo. Todas las alumnas verán estos datos en el checkout para pagar sin comisiones bancarias ni pasarelas intermedias.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSavePaymentSettings(paymentSettings)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Ajustes de Cobro</span>
                </button>
              </div>

              {/* Main Grid: Settings Form (Left) + Live Preview (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Column */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-[0_12px_32px_rgba(227,27,109,0.06)] space-y-6">
                  <h3 className="font-serif italic font-bold text-lg text-[#2A1828] flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#E31B6D]" />
                    <span>Datos Bancarios y Billeteras Digitales</span>
                  </h3>

                  <div className="space-y-4 text-xs">
                    {/* Pasarela Automática: Mercado Pago (Yape & Tarjetas - Auto-Validación) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-pink-50/30 border-2 border-sky-200/90 space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#009EE3] text-white flex items-center justify-center font-black text-xs shadow-xs">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-sky-950 text-xs sm:text-sm block">
                              Mercado Pago (Auto-Validación de Pagos con Yape & Tarjetas)
                            </span>
                            <span className="text-[10px] text-sky-700 font-medium">
                              Cobra cualquier precio dinámicamente sin generar links de pago para cada curso
                            </span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={paymentSettings.enable_mercadopago}
                            onChange={(e) =>
                              setPaymentSettings((prev) => ({
                                ...prev,
                                enable_mercadopago: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009EE3]"></div>
                        </label>
                      </div>

                      {paymentSettings.enable_mercadopago && (
                        <div className="space-y-3 pt-3 border-t border-sky-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-[#2A1828] mb-1">
                                Public Key de Mercado Pago
                              </label>
                              <input
                                type="text"
                                value={paymentSettings.mercadopago_public_key || ''}
                                onChange={(e) =>
                                  setPaymentSettings((prev) => ({
                                    ...prev,
                                    mercadopago_public_key: e.target.value,
                                  }))
                                }
                                placeholder="APP_USR-xxxx o TEST-xxxx"
                                className="w-full px-3 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400/40 text-xs font-mono font-bold text-[#2A1828]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-[#2A1828] mb-1">
                                Access Token de Mercado Pago
                              </label>
                              <input
                                type="password"
                                value={paymentSettings.mercadopago_access_token || ''}
                                onChange={(e) =>
                                  setPaymentSettings((prev) => ({
                                    ...prev,
                                    mercadopago_access_token: e.target.value,
                                  }))
                                }
                                placeholder="APP_USR-xxxx o TEST-xxxx"
                                className="w-full px-3 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400/40 text-xs font-mono font-bold text-[#2A1828]"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-100/70 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-sky-900 text-[11px]">
                              <input
                                type="checkbox"
                                checked={paymentSettings.mercadopago_sandbox}
                                onChange={(e) =>
                                  setPaymentSettings((prev) => ({
                                    ...prev,
                                    mercadopago_sandbox: e.target.checked,
                                  }))
                                }
                                className="rounded text-[#009EE3] focus:ring-sky-400"
                              />
                              Modo de Pruebas (Sandbox Test)
                            </label>
                            <span className="text-[10px] text-sky-800 font-bold">
                              {paymentSettings.mercadopago_access_token
                                ? '🟢 Credenciales Conectadas'
                                : '⚡ Auto-Validación Activa'}
                            </span>
                          </div>

                          <p className="text-[10px] text-[#6A5A6D]">
                            💡 <strong>Sin crear links manuales:</strong> El sistema toma el precio de cualquier curso o plan (S/. 99, S/. 150, etc.) y genera la pasarela de cobro automáticamente.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Titular */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#2A1828] mb-1">
                        Titular de las Cuentas / Empresa
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.account_holder}
                        onChange={(e) =>
                          setPaymentSettings((prev) => ({ ...prev, account_holder: e.target.value }))
                        }
                        placeholder="Ej: Roxana Rivera / Girls & Law S.A.C."
                        className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/30 text-xs font-medium text-[#2A1828]"
                      />
                      <p className="text-[10px] text-[#A08A9E] mt-1">
                        Nombre que las alumnas verán como titular al momento de transferir o yapear.
                      </p>
                    </div>

                    {/* Yape / Plin */}
                    <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-pink-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#E31B6D] flex items-center gap-1.5">
                          <QrCode className="w-4 h-4" /> Billetera Digital (Yape / Plin)
                        </span>
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                          Pago Instantáneo
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-[#6A5A6D] mb-1">
                            Número de Celular Yape / Plin
                          </label>
                          <input
                            type="text"
                            value={paymentSettings.yape_phone}
                            onChange={(e) =>
                              setPaymentSettings((prev) => ({ ...prev, yape_phone: e.target.value }))
                            }
                            placeholder="Ej: 987 654 321"
                            className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/30 text-xs font-bold text-[#2A1828]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#6A5A6D] mb-1">
                            URL Imagen Código QR
                          </label>
                          <input
                            type="text"
                            value={paymentSettings.qr_image_url}
                            onChange={(e) =>
                              setPaymentSettings((prev) => ({ ...prev, qr_image_url: e.target.value }))
                            }
                            placeholder="https://... o imagen de tu QR"
                            className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/30 text-xs font-medium text-[#2A1828]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Transferencia Bancaria */}
                    <div className="p-4 rounded-2xl bg-[#F7F9FF] border border-blue-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-blue-600" /> Transferencia Bancaria Directa
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                          Soles PEN
                        </span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#6A5A6D] mb-1">
                          Entidad Bancaria
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.bank_name}
                          onChange={(e) =>
                            setPaymentSettings((prev) => ({ ...prev, bank_name: e.target.value }))
                          }
                          placeholder="Ej: BCP - Banco de Crédito del Perú"
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-xs font-medium text-[#2A1828]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-[#6A5A6D] mb-1">
                            Número de Cuenta Corriente / Ahorros
                          </label>
                          <input
                            type="text"
                            value={paymentSettings.bank_account_number}
                            onChange={(e) =>
                              setPaymentSettings((prev) => ({
                                ...prev,
                                bank_account_number: e.target.value,
                              }))
                            }
                            placeholder="Ej: 194-98765432-0-12"
                            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-xs font-mono font-bold text-[#2A1828]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#6A5A6D] mb-1">
                            Código Interbancario (CCI)
                          </label>
                          <input
                            type="text"
                            value={paymentSettings.bank_cci}
                            onChange={(e) =>
                              setPaymentSettings((prev) => ({ ...prev, bank_cci: e.target.value }))
                            }
                            placeholder="Ej: 002-194-0098765432012-90"
                            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-xs font-mono font-bold text-[#2A1828]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp de Confirmación */}
                    <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp de Roxana para Validar Comprobantes
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Notificación Inmediata
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex-1 w-full">
                          <label className="block text-[10px] font-bold text-[#6A5A6D] mb-1">
                            Número de WhatsApp (con código de país ej: 51 para Perú)
                          </label>
                          <input
                            type="text"
                            value={paymentSettings.whatsapp_number}
                            onChange={(e) =>
                              setPaymentSettings((prev) => ({
                                ...prev,
                                whatsapp_number: e.target.value,
                              }))
                            }
                            placeholder="51987654321"
                            className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 text-xs font-bold text-[#2A1828]"
                          />
                        </div>
                        <a
                          href={`https://wa.me/${paymentSettings.whatsapp_number.replace(/\D/g, '')}?text=Hola%20Roxana%2C%20este%20es%20un%20test%20desde%20Girls%20%26%20Law`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 sm:mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto justify-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Probar WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* Instrucciones adicionales */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#2A1828] mb-1">
                        Instrucciones que Lee la Alumna en el Checkout
                      </label>
                      <textarea
                        rows={3}
                        value={paymentSettings.instructions}
                        onChange={(e) =>
                          setPaymentSettings((prev) => ({ ...prev, instructions: e.target.value }))
                        }
                        placeholder="Instrucciones para el pago..."
                        className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E31B6D]/30 text-xs font-medium text-[#2A1828]"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSavePaymentSettings(paymentSettings)}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Guardar y Sincronizar Cambios de Cobro</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Preview Column (Right) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-gradient-to-br from-pink-50 to-[#FFF0F6] rounded-3xl p-6 border border-pink-200/80 shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-pink-200/80 mb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#E31B6D] tracking-wider">
                          Vista Previa en Vivo
                        </span>
                        <h4 className="font-serif italic font-bold text-sm text-[#2A1828]">
                          Así lo ven tus alumnas en el Checkout
                        </h4>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Sincronizado" />
                    </div>

                    {/* Simulated Modal Card */}
                    <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-4 text-xs">
                      {/* Titular info */}
                      <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#E31B6D] to-[#F06292] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          {paymentSettings.account_holder.charAt(0) || 'R'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-[#A08A9E] font-medium">Docente &amp; Titular</p>
                          <p className="font-bold text-[#2A1828] text-xs truncate">
                            {paymentSettings.account_holder || 'Roxana Rivera'}
                          </p>
                        </div>
                      </div>

                      {/* Yape simulation */}
                      <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">
                            Pagar con Yape o Plin
                          </span>
                          <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            Inmediato
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-purple-200/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#6A5A6D] block">Número Yape / Plin</span>
                            <span className="text-sm font-black text-[#2A1828] font-mono">
                              {paymentSettings.yape_phone || '987 654 321'}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                            Copiar
                          </span>
                        </div>
                      </div>

                      {/* Bank simulation */}
                      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                          {paymentSettings.bank_name || 'BCP - Banco de Crédito del Perú'}
                        </span>
                        <div className="bg-white p-2.5 rounded-lg border border-blue-200/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#6A5A6D] block">Cta. Ahorros Soles</span>
                            <span className="text-xs font-mono font-bold text-[#2A1828]">
                              {paymentSettings.bank_account_number || '194-98765432-0-12'}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                            Copiar
                          </span>
                        </div>
                        {paymentSettings.bank_cci && (
                          <div className="bg-white p-2.5 rounded-lg border border-blue-200/60 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-[#6A5A6D] block">Código Interbancario (CCI)</span>
                              <span className="text-xs font-mono font-bold text-[#2A1828]">
                                {paymentSettings.bank_cci}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                              Copiar
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Direct WhatsApp Action Button */}
                      <div className="pt-1">
                        <div className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs">
                          <MessageCircle className="w-4 h-4" />
                          <span>Enviar Comprobante a Roxana por WhatsApp</span>
                        </div>
                        <p className="text-[10px] text-center text-[#A08A9E] mt-2">
                          La alumna envía su número de operación o captura y Roxana la valida directamente.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-pink-100 text-xs text-[#6A5A6D] space-y-2">
                    <p className="font-bold text-[#2A1828] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      100% de los ingresos para Girls &amp; Law
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Al operar mediante Yape directo y transferencias BCP, no pagas comisiones del 4% al 6% de pasarelas tradicionales. Una vez confirmado el pago, puedes matricular a la alumna con un solo clic desde la pestaña <strong>Alumnas &amp; Ventas</strong>.
                    </p>
                  </div>
                </div>
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

      {/* Student Individual Settings & Course Management Modal */}
      <StudentSettingsModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToManage(null);
        }}
        student={studentToManage}
        courses={courses}
        userEnrollments={userEnrollments}
        onEnrollInCourse={handleEnrollStudentInCourse}
        onRevokeEnrollment={handleRevokeStudentEnrollment}
        onUpdateProfile={handleUpdateStudentProfile}
      />

      {/* Course & Subscription Checkout Modal (Compra en Soles PEN con Yape/Plin/Tarjeta) */}
      <CourseCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCourseToBuy(null);
          setSelectedPlanForCheckout(null);
        }}
        onSuccess={handleCheckoutSuccess}
        course={courseToBuy}
        plan={selectedPlanForCheckout}
        currentUserId={supabaseUser?.id || ''}
      />
    </div>
  );
}
