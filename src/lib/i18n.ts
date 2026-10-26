import { useState, useEffect } from 'react';

export type Language = 'es' | 'en';

const STORAGE_KEY = 'girls_and_law_lang';

export function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY) as Language;
    if (saved === 'es' || saved === 'en') return saved;
  }
  return 'es';
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('language-change', { detail: { lang } }));
  }
}

export function useLanguage() {
  const [lang, setLangState] = useState<Language>('es');

  useEffect(() => {
    // Initial sync
    const initial = getInitialLanguage();
    setLangState(initial);
    document.documentElement.lang = initial;

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: Language }>;
      if (customEvent.detail?.lang) {
        setLangState(customEvent.detail.lang);
      }
    };

    window.addEventListener('language-change', handleLangChange);
    return () => window.removeEventListener('language-change', handleLangChange);
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLangState(newLang);
    setLanguage(newLang);
  };

  return { lang, setLanguage: changeLanguage };
}

export const DICTIONARY = {
  es: {
    nav: {
      vision: 'Visión',
      methodology: 'Metodología',
      syllabus: 'Temario',
      founder: 'Fundadora',
      pricing: 'Inversión',
      enroll: 'Inscribirme',
      podcastTitle: 'Escuchar Podcast en Spotify',
    },
    hero: {
      badge: '✦ Masterclass Exclusiva · Nueva Edición 2026',
      title1: 'Litigio de',
      titleHighlight1: 'Alto Impacto',
      title2: 'Poder,',
      titleHighlight2: 'Argumentación',
      title3: '& Autenticidad.',
      description:
        'Aprende el arte de persuadir en tribunales, construir una teoría del caso imbatible y proyectar una presencia magnética. La formación clínica de élite que la facultad nunca te enseñó.',
      ctaPrimary: 'Comenzar Masterclass →',
      ctaSecondary: 'Ver clase de muestra',
      guarantee: 'Inversión desde $39 USD/mes · 14 días de garantía incondicional',
      pills: {
        courtrooms: 'Salas de audiencia reales',
        models: '15 modelos en Word',
        mentorship: 'Mentoría con Roxana Rivera',
      },
      cinemaEyebrow: 'Producción 4K HDR · Masterclass Cinema Pro',
      cinemaTitle: 'Experimenta una clase maestra desde adentro',
      playingBadge: 'EN REPRODUCCIÓN',
    },
    founderCard: {
      tag: 'LEADER 2026',
      role: 'FUNDADORA & DIRECTORA LEGAL',
      bio: 'Redefiniendo el ejercicio del derecho desde la autenticidad, la excelencia procesal y la sororidad para juristas de alto impacto.',
      followers: 'Seguidoras',
      clinical: 'Clínica 4K',
      rating: 'Calificación',
      cta: 'Conectar con Roxana →',
    },
    features: {
      eyebrow: 'Ingeniería del Aprendizaje',
      title: 'Cada detalle diseñado para transformar tu carrera.',
      description:
        'Combinamos cinematografía inmersiva, rigor procesal de primera línea y comunidad exclusiva.',
      card1: {
        title: 'Producción en salas de audiencias reales.',
        desc: 'Sin salones genéricos ni diapositivas monótonas. Aprende la acústica del tribunal, el manejo de la distancia con el juez y el dominio espacial que impone respeto desde el primer segundo.',
        tag1: '✦ 4K Ultra HD · Masterclass Cinema',
        tag2: '12 Módulos Clínicos',
      },
      card2: {
        title: 'El Vault Procesal',
        desc: '15 modelos procesales editables en Word: alegatos de apertura, matrices para interrogar testigos y propuestas de honorarios.',
        sample: '📄 alegato_apertura_pro.docx',
      },
      card3: {
        title: 'Comunidad VIP Perpetua',
        desc: 'Pertenecerás al círculo de abogadas más activo de Latinoamérica. Derivación de casos, alianzas y networking auténtico.',
        stat: '+5,000 juristas conectadas',
      },
      card4: {
        title: 'Simulaciones de juicio con feedback en vivo.',
        desc: 'No basta con saber la ley: debes saber responder bajo fuego. Practicarás objeciones en milisegundos, control de testigos difíciles y alegatos orales con evaluación experta.',
        stat1Num: '4 Sesiones',
        stat1Label: 'En tiempo real',
        stat2Num: '1 a 1',
        stat2Label: 'Revisión clínica experta',
      },
    },
    syllabus: {
      eyebrow: 'Plan de Estudios Clínico',
      title: 'De la teoría abstracta al dominio procesal absoluto.',
      description:
        'Cuatro módulos intensivos con grabaciones en 4K, análisis de casos emblemáticos y simulaciones paso a paso.',
      tabsTitle: 'Módulos del Programa',
      deliverableLabel: 'Entregable del Módulo:',
      lessonsTitle: 'Lecciones incluidas:',
      skillsTitle: 'Habilidades clave adquiridas:',
      viewDetails: 'Ver detalles del módulo',
      modules: [
        {
          id: 'mod-1',
          number: '01',
          title: 'Mentalidad, Autoridad & Dominio de Sala',
          duration: '2h 45m · 4 Clases',
          description:
            'Aprende a transformar los nervios en magnetismo procesal. Postura, cadencia vocal, gestión de la mirada y control del espacio en el estrado para proyectar autoridad inmediata sin impostaciones.',
          lessons: [
            'Clase 1: Psicología del Tribunal: Qué busca realmente un juez',
            'Clase 2: Acústica y modulación: El poder de las pausas dramáticas',
            'Clase 3: Lenguaje no verbal femenino: Reclamar el espacio sin pedir disculpas',
            'Clase 4: Cómo responder ante interrupciones y descalificaciones en sala',
          ],
          skills: ['Presencia escénica', 'Modulación vocal', 'Manejo del estrés bajo presión'],
          deliverable: 'Manual Práctico de Presencia en Sala & Checklist de Entrada',
        },
        {
          id: 'mod-2',
          number: '02',
          title: 'Teoría del Caso Imbatible & Narrativa Persuasiva',
          duration: '3h 30m · 5 Clases',
          description:
            'El derecho no lo gana quien tiene más leyes, sino quien construye la narrativa fáctica y jurídica más verosímil y memorable. Estructuraremos casos reales de alta complejidad desde cero.',
          lessons: [
            'Clase 1: El Triángulo de Hierro: Hechos, derecho y evidencia',
            'Clase 2: Storytelling procesal: Cómo enganchar al juez desde el minuto uno',
            'Clase 3: Redacción del Alegato de Apertura: Estructura cinematográfica',
            'Clase 4: Anticipación de las defensas y trampas de la contraparte',
            'Clase 5: Mapeo de fortalezas y debilidades probatorias',
          ],
          skills: ['Estrategia procesal', 'Narrativa jurídica persuasiva', 'Diseño de alegatos'],
          deliverable: 'Plantilla de Matriz de Teoría del Caso en Excel y Word',
        },
        {
          id: 'mod-3',
          number: '03',
          title: 'Interrogatorio, Contra-interrogatorio & Objeciones',
          duration: '3h 15m · 5 Clases',
          description:
            'La técnica clínica más temida y más poderosa. Aprende a formular preguntas cerradas que acorralan, a controlar testigos hostiles y a objetar en 0.5 segundos con base legal irrebatible.',
          lessons: [
            'Clase 1: La Regla de Oro del contrainterrogatorio: Preguntas de un solo hecho',
            'Clase 2: Desacreditación y confrontación con declaraciones previas',
            'Clase 3: Control de peritos y testigos expertos de la contraparte',
            'Clase 4: Dinámica relámpago de objeciones: Cómo fundamentar sin dudar',
            'Clase 5: Objeciones éticas vs. tácticas en la práctica judicial',
          ],
          skills: ['Técnicas de litigación oral', 'Control de testigos', 'Objeciones inmediatas'],
          deliverable: 'Guía Rápida de Bolsillo para Objeciones en Audiencia',
        },
        {
          id: 'mod-4',
          number: '04',
          title: 'Alegato de Clausura & Argumentación Conclusiva',
          duration: '2h 50m · 4 Clases',
          description:
            'El cierre definitivo del litigio. Cómo atar cada prueba a las proposiciones fácticas, refutar las tesis contrarias y cerrar con una conclusión que deje al tribunal sin otra alternativa jurídica.',
          lessons: [
            'Clase 1: Arquitectura del Alegato Final: De lo fáctico a lo emotivo',
            'Clase 2: El arte de sintetizar 50 horas de prueba en 30 minutos',
            'Clase 3: Refutación demoledora de la teoría contraria',
            'Clase 4: Cierre con propósito: Cómo pedir la pretensión con contundencia',
          ],
          skills: ['Argumentación jurídica avanzada', 'Síntesis probatoria', 'Retórica judicial'],
          deliverable: 'Modelo Estructurado de Alegato Final & Rúbrica de Autoevaluación',
        },
      ],
    },
    founderSection: {
      badge: 'Liderazgo & Visión',
      title: 'Un mensaje de nuestra fundadora',
      quote:
        '“Girls and Law nació para recordar a cada mujer que estudia o ejerce el derecho que no necesita encajar en un molde rígido para ser brillante. Puedes amar la moda, la música pop, la cultura y al mismo tiempo ser una abogada o profesional altamente rigurosa e imparable.”',
      name: 'Roxana Rivera',
      role: 'Fundadora & Directora de Girls and Law',
      badgeRole: 'Fundadora',
      cta: 'Conectar con Roxana',
    },
    pricing: {
      eyebrow: 'Inversión & Admisión',
      title: 'Elige cómo transformar tu práctica legal.',
      description: 'Inversión transparente sin costos ocultos. Acceso de por vida a la plataforma.',
      singlePayment: 'Pago Único',
      installments: '3 Cuotas Sin Interés',
      card1: {
        badge: 'Modalidad Asincrónica',
        title: 'Acceso Digital Pro',
        desc: 'Aprende a tu propio ritmo con las 12 horas clínicas completas y el archivo de plantillas.',
        priceSingle: '$149',
        priceInstallments: '$55',
        pricePeriod: '/cuota (3 cuotas)',
        pricePeriodSingle: 'pago único de por vida',
        features: [
          '12 horas de contenido en 4K en salas reales',
          'Acceso de por vida con actualizaciones 2026',
          'El Vault: 15 modelos procesales editables en Word',
          'Certificado oficial emitido por Girls & Law',
          'Acceso a la comunidad privada en Discord',
        ],
        cta: 'Elegir Acceso Digital Pro →',
        guarantee: '14 días de garantía de satisfacción 100%',
      },
      card2: {
        badge: 'Vacantes Limitadas · Solo 25 Cupos',
        title: 'VIP Masterclass Experience',
        desc: 'El programa completo más 4 clínicas en vivo de simulación de juicio con Roxana Rivera.',
        priceSingle: '$299',
        priceInstallments: '$109',
        pricePeriod: '/cuota (3 cuotas)',
        pricePeriodSingle: 'pago único de por vida',
        features: [
          'Todo lo incluido en el Acceso Digital Pro',
          '4 sesiones clínicas en vivo de simulación de juicio (Zoom)',
          'Rol activo con feedback 1 a 1 de Roxana Rivera',
          'Revisión personalizada de tu alegato de apertura',
          'Mesa redonda exclusiva de networking con socias invitadas',
          'Acceso prioritario al canal VIP de derivación de casos',
        ],
        cta: 'Postular a Experiencia VIP →',
        guarantee: 'Garantía incondicional · Soporte VIP prioritario',
      },
    },
    faq: {
      eyebrow: 'Preguntas Frecuentes',
      title: 'Todo lo que necesitas saber.',
      items: [
        {
          question: '¿Para qué ramas del derecho aplica esta Masterclass?',
          answer:
            'Las técnicas de argumentación, persuasión en sala, teoría del caso y contra-interrogatorio son aplicables a litigio civil, penal, laboral, constitucional y arbitrajes comerciales. Además, los principios de negociación y presencia escénica fortalecen a cualquier jurista en mediaciones y juntas de directorio.',
        },
        {
          question: '¿Qué pasa si aún soy estudiante o recién egresada?',
          answer:
            'Es el momento idóneo. La mayoría de facultades enseñan teoría abstracta pero no cómo comportarse, litigar o defender una postura en audiencia real. Llegarás a tus primeros litigios con la seguridad y el aplomo de quien lleva años en tribunales.',
        },
        {
          question: '¿Durante cuánto tiempo tengo acceso a los contenidos?',
          answer:
            'El acceso a todas las clases grabadas en 4K, actualizaciones futuras y al Vault de plantillas procesales es de por vida. Puedes ver las lecciones cuantas veces quieras y a tu propio ritmo desde cualquier dispositivo.',
        },
        {
          question: '¿Cómo funcionan las sesiones en vivo del plan VIP?',
          answer:
            'Se realizan vía Zoom con grupos reducidos de máximo 15 participantes por sala. Tendrás roles asignados (abogada demandante, defensa, objeciones) y recibirás feedback en tiempo real de Roxana Rivera y socias invitadas.',
        },
        {
          question: '¿Qué métodos de pago aceptan?',
          answer:
            'Aceptamos tarjetas de crédito y débito internacionales (Visa, Mastercard, American Express), Apple Pay, Google Pay y transferencia bancaria directa para países seleccionados.',
        },
      ],
    },
    bottomCTA: {
      title: 'Tu voz procesal merece ser escuchada con fuerza.',
      description:
        'No necesitas esperar años ni soportar la arrogancia de los métodos tradicionales. Adquiere hoy la confianza, la técnica y el respaldo de Girls & Law.',
      ctaPrimary: 'Asegurar Mi Plaza Ahora →',
      ctaSecondary: 'Revisar Plan de Estudios',
    },
    footer: {
      description:
        'Redefiniendo el ejercicio jurídico desde la autenticidad, la excelencia procesal y la sororidad. Formando a la nueva generación de juristas líderes.',
      col1Title: 'Programa',
      col1Link1: 'Metodología',
      col1Link2: 'Temario Clínico',
      col1Link3: 'Planes & Inversión',
      col1Link4: 'Preguntas Frecuentes',
      col2Title: 'Comunidad',
      col2Link1: 'Sobre Girls & Law',
      col2Link2: 'Fundadora',
      col2Link3: 'Podcast en Spotify',
      col2Link4: 'Instagram Oficial',
      col3Title: 'Legal & Garantía',
      col3Link1: 'Términos del Servicio',
      col3Link2: 'Política de Privacidad',
      col3Link3: 'Garantía de 14 Días',
      copyright: 'Todos los derechos reservados. Redefiniendo el litigio con poder & estilo.',
    },
    bottomNav: {
      trailer: 'Trailer',
      syllabus: 'Temario',
      founder: 'Roxana',
      pricing: 'Precios',
      join: 'Unirme',
    },
  },
  en: {
    nav: {
      vision: 'Vision',
      methodology: 'Methodology',
      syllabus: 'Syllabus',
      founder: 'Founder',
      pricing: 'Pricing',
      enroll: 'Enroll Now',
      podcastTitle: 'Listen to Podcast on Spotify',
    },
    hero: {
      badge: '✦ Exclusive Masterclass · 2026 Edition',
      title1: 'High-Impact',
      titleHighlight1: 'Litigation',
      title2: 'Power,',
      titleHighlight2: 'Argumentation',
      title3: '& Authenticity.',
      description:
        'Master the art of courtroom persuasion, build an unbeatable case theory, and project magnetic authority. The elite clinical training law school never taught you.',
      ctaPrimary: 'Start Masterclass →',
      ctaSecondary: 'Watch sample class',
      guarantee: 'Starting at $39 USD/mo · 14-day unconditional money-back guarantee',
      pills: {
        courtrooms: 'Real courtroom sessions',
        models: '15 editable Word templates',
        mentorship: 'Mentorship with Roxana Rivera',
      },
      cinemaEyebrow: '4K HDR Production · Masterclass Cinema Pro',
      cinemaTitle: 'Experience an elite masterclass from the inside',
      playingBadge: 'NOW PLAYING',
    },
    founderCard: {
      tag: 'LEADER 2026',
      role: 'FOUNDER & LEGAL DIRECTOR',
      bio: 'Redefining the practice of law through authenticity, procedural excellence, and solidarity for high-impact legal professionals.',
      followers: 'Followers',
      clinical: '4K Clinical',
      rating: 'Rating',
      cta: 'Connect with Roxana →',
    },
    features: {
      eyebrow: 'Learning Engineering',
      title: 'Every detail engineered to transform your legal career.',
      description:
        'We blend immersive cinematography, frontline procedural rigor, and an exclusive community.',
      card1: {
        title: 'Filmed in real courtroom chambers.',
        desc: 'No generic conference rooms or lifeless slides. Learn court acoustics, spatial positioning with judges, and physical command that commands respect from second one.',
        tag1: '✦ 4K Ultra HD · Masterclass Cinema',
        tag2: '12 Clinical Modules',
      },
      card2: {
        title: 'The Procedural Vault',
        desc: '15 editable Word templates: opening statements, witness cross-examination matrices, and fee proposals.',
        sample: '📄 opening_statement_pro.docx',
      },
      card3: {
        title: 'Perpetual VIP Community',
        desc: 'Join the most vibrant network of female attorneys in Latin America. Case referrals, strategic partnerships, and authentic mentorship.',
        stat: '+5,000 connected attorneys',
      },
      card4: {
        title: 'Trial simulations with live real-time feedback.',
        desc: 'Knowing the law is not enough: you must perform under fire. Practice split-second objections, hostile witness control, and oral arguments evaluated by experts.',
        stat1Num: '4 Sessions',
        stat1Label: 'Real time live',
        stat2Num: '1-on-1',
        stat2Label: 'Expert clinical review',
      },
    },
    syllabus: {
      eyebrow: 'Clinical Curriculum',
      title: 'From abstract theory to absolute courtroom mastery.',
      description:
        'Four intensive modules with 4K video lectures, landmark case breakdowns, and step-by-step trial simulations.',
      tabsTitle: 'Program Modules',
      deliverableLabel: 'Module Deliverable:',
      lessonsTitle: 'Included lessons:',
      skillsTitle: 'Key acquired skills:',
      viewDetails: 'View module details',
      modules: [
        {
          id: 'mod-1',
          number: '01',
          title: 'Mindset, Authority & Courtroom Dominance',
          duration: '2h 45m · 4 Classes',
          description:
            'Transform courtroom anxiety into trial magnetism. Master posture, vocal cadence, gaze management, and bench presence to project undeniable authority.',
          lessons: [
            'Class 1: Judicial Psychology: What a judge truly looks for',
            'Class 2: Acoustics & Modulation: The power of dramatic pauses',
            'Class 3: Female Nonverbal Power: Taking up space without apologizing',
            'Class 4: Handling courtroom interruptions and sexist dismissals',
          ],
          skills: ['Stage presence', 'Vocal modulation', 'High-pressure stress management'],
          deliverable: 'Practical Courtroom Presence Handbook & Entry Checklist',
        },
        {
          id: 'mod-2',
          number: '02',
          title: 'Unbeatable Case Theory & Persuasive Storytelling',
          duration: '3h 30m · 5 Classes',
          description:
            'Cases are won by those who craft the most compelling, credible, and memorable narrative. We structure high-stakes real-world litigation from scratch.',
          lessons: [
            'Class 1: The Iron Triangle: Facts, law, and evidentiary weight',
            'Class 2: Trial Storytelling: Hooking the bench from minute one',
            'Class 3: Drafting Cinematic Opening Statements',
            'Class 4: Anticipating opponent defenses and procedural traps',
            'Class 5: Evidentiary strengths and vulnerabilities mapping',
          ],
          skills: ['Procedural strategy', 'Persuasive legal narrative', 'Argument design'],
          deliverable: 'Case Theory Matrix Template in Excel & Word',
        },
        {
          id: 'mod-3',
          number: '03',
          title: 'Direct Examination, Cross & Rapid Objections',
          duration: '3h 15m · 5 Classes',
          description:
            'The most feared and decisive clinical skill. Learn laser-sharp leading questions that box in witnesses, tame hostile experts, and lodge objections in 0.5 seconds.',
          lessons: [
            'Class 1: The Golden Rule of Cross-Examination: Single-fact questions',
            'Class 2: Impeachment and confrontation with prior statements',
            'Class 3: Controlling expert witnesses and hostile depositions',
            'Class 4: Split-second objections: Standing on rock-solid legal grounds',
            'Class 5: Ethical vs. tactical objections in trial practice',
          ],
          skills: ['Oral trial advocacy', 'Witness control', 'Instant objections'],
          deliverable: 'Pocket Quick-Reference Card for Courtroom Objections',
        },
        {
          id: 'mod-4',
          number: '04',
          title: 'Closing Arguments & Conclusive Persuasion',
          duration: '2h 50m · 4 Classes',
          description:
            'The ultimate finish. How to anchor evidence directly to factual burdens, dismantle opposing arguments, and close with an airtight verdict demand.',
          lessons: [
            'Class 1: Closing Argument Architecture: From factual rigor to impact',
            'Class 2: Synthesizing 50 hours of witness proof in 30 minutes',
            'Class 3: Decisive rebuttal of the opponent theory',
            'Class 4: Closing with conviction: Framing the final judgment request',
          ],
          skills: ['Advanced legal argument', 'Evidence synthesis', 'Judicial rhetoric'],
          deliverable: 'Structured Closing Argument Template & Self-Evaluation Rubric',
        },
      ],
    },
    founderSection: {
      badge: 'Leadership & Vision',
      title: 'A message from our founder',
      quote:
        '“Girls and Law was founded to remind every woman studying or practicing law that she doesn’t need to fit into a rigid mold to be brilliant. You can love fashion, pop music, culture, and simultaneously be an unstoppable, uncompromisingly rigorous advocate.”',
      name: 'Roxana Rivera',
      role: 'Founder & Director of Girls and Law',
      badgeRole: 'Founder',
      cta: 'Connect with Roxana',
    },
    pricing: {
      eyebrow: 'Tuition & Admission',
      title: 'Choose how to elevate your legal practice.',
      description: 'Transparent investment with zero hidden fees. Lifetime access to the platform.',
      singlePayment: 'One-Time Payment',
      installments: '3 Interest-Free Installments',
      card1: {
        badge: 'Self-Paced Learning',
        title: 'Digital Pro Access',
        desc: 'Learn on your own schedule with 12 full clinical hours and the entire template archive.',
        priceSingle: '$149',
        priceInstallments: '$55',
        pricePeriod: '/installment (3 payments)',
        pricePeriodSingle: 'one-time lifetime payment',
        features: [
          '12 hours of 4K content filmed in real courtrooms',
          'Lifetime access with all 2026 curriculum updates',
          'The Vault: 15 editable procedural Word templates',
          'Official Girls & Law Verified Certificate',
          'Access to the private Discord legal community',
        ],
        cta: 'Choose Digital Pro Access →',
        guarantee: '14-day 100% money-back satisfaction guarantee',
      },
      card2: {
        badge: 'Limited Seats · Only 25 Spots',
        title: 'VIP Masterclass Experience',
        desc: 'The complete masterclass plus 4 live courtroom trial clinics with Roxana Rivera.',
        priceSingle: '$299',
        priceInstallments: '$109',
        pricePeriod: '/installment (3 payments)',
        pricePeriodSingle: 'one-time lifetime payment',
        features: [
          'Everything included in Digital Pro Access',
          '4 live interactive trial simulation clinics via Zoom',
          'Active trial role with 1-on-1 feedback from Roxana Rivera',
          'Personalized review of your opening statement',
          'Exclusive networking roundtable with invited firm partners',
          'Priority access to our VIP case referral channel',
        ],
        cta: 'Apply for VIP Experience →',
        guarantee: 'Unconditional guarantee · Dedicated VIP priority support',
      },
    },
    faq: {
      eyebrow: 'Frequently Asked Questions',
      title: 'Everything you need to know.',
      items: [
        {
          question: 'What fields of law does this Masterclass apply to?',
          answer:
            'Our argumentation, courtroom persuasion, case theory, and cross-examination frameworks apply across civil, criminal, labor, constitutional litigation, and commercial arbitrations. Moreover, negotiation and executive presence principles benefit any lawyer in corporate boardrooms and mediations.',
        },
        {
          question: 'What if I am still a student or recent graduate?',
          answer:
            'It is the ideal time. Most law faculties teach abstract doctrine but neglect how to command attention or litigate in an actual hearing. You will enter your first court cases with the poise and confidence of a seasoned litigator.',
        },
        {
          question: 'How long do I keep access to the course content?',
          answer:
            'Lifetime access. You can revisit all 4K recorded lectures, future updates, and the Procedural Vault templates whenever you want, at your own pace, on any device.',
        },
        {
          question: 'How do the live VIP clinics work?',
          answer:
            'They are held live on Zoom in intimate cohorts of up to 15 participants. You will be assigned active litigation roles (plaintiff counsel, defense, objections) and receive immediate 1-on-1 feedback from Roxana Rivera and guest partners.',
        },
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept international credit and debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and direct bank transfers for select countries.',
        },
      ],
    },
    bottomCTA: {
      title: 'Your courtroom voice deserves to command attention.',
      description:
        'You do not need to wait decades or endure archaic law firm hierarchies. Claim the confidence, technique, and backing of Girls & Law today.',
      ctaPrimary: 'Secure My Spot Now →',
      ctaSecondary: 'Review Curriculum',
    },
    footer: {
      description:
        'Redefining legal practice through authenticity, courtroom excellence, and female solidarity. Training the next generation of leading advocates.',
      col1Title: 'Program',
      col1Link1: 'Methodology',
      col1Link2: 'Clinical Curriculum',
      col1Link3: 'Plans & Tuition',
      col1Link4: 'FAQ',
      col2Title: 'Community',
      col2Link1: 'About Girls & Law',
      col2Link2: 'Founder',
      col2Link3: 'Spotify Podcast',
      col2Link4: 'Official Instagram',
      col3Title: 'Legal & Guarantee',
      col3Link1: 'Terms of Service',
      col3Link2: 'Privacy Policy',
      col3Link3: '14-Day Guarantee',
      copyright: 'All rights reserved. Redefining litigation with power & style.',
    },
    bottomNav: {
      trailer: 'Trailer',
      syllabus: 'Syllabus',
      founder: 'Roxana',
      pricing: 'Pricing',
      join: 'Join',
    },
  },
} as const;
