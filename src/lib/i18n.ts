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
      vision: 'Qué es',
      methodology: 'Nuestra Esencia',
      syllabus: 'Proyectos',
      founder: 'Fundadora',
      pricing: 'Inversión',
      enroll: 'Inscribirme',
      podcastTitle: 'Escuchar Podcast Entre Girls y Leyes en Spotify',
    },
    hero: {
      badge: '✦ Comunidad & Movimiento Internacional · Girls and Law',
      title1: 'GIRLS AND LAW:',
      titleHighlight1: 'Mujeres Multifacéticas',
      title2: 'Transformando',
      titleHighlight2: 'el Derecho',
      title3: '.',
      description:
        'Una comunidad y movimiento internacional que nació para transformar la mentalidad tradicional sobre lo que significa ser abogada y romper los estereotipos en el mundo jurídico. Porque una mujer puede ser abogada, artista, deportista, psicóloga, médica, investigadora o todo aquello que sueñe ser.',
      ctaPrimary: 'Explorar Cursos & Formación →',
      ctaSecondary: 'Conocer Nuestra Esencia',
      guarantee: 'Una Girl de Derecho es toda mujer que defiende sus derechos y los de los demás.',
      pills: {
        courtrooms: '+17,000 seguidoras en Instagram',
        models: 'Comunidad en más de 14 países',
        mentorship: 'Fundado por Roxana Rivera',
      },
      cinemaEyebrow: 'Iniciativa Académica · Masterclasses Oficiales',
      cinemaTitle: 'Formación clínica para juristas de alto impacto',
      playingBadge: 'DISPONIBLE',
    },
    founderCard: {
      tag: 'LEADER 2026',
      role: 'FUNDADORA DE GIRLS AND LAW',
      bio: 'Bachiller en Derecho por la USMP. Defensora del liderazgo auténtico, derechos humanos y la transformación social.',
      followers: 'Seguidoras IG',
      clinical: 'Países',
      rating: 'Calificación',
      cta: 'Conectar con Roxana →',
    },
    features: {
      eyebrow: 'Nuestra Esencia & Movimiento',
      title: 'Mujeres multifacéticas transformando el Derecho.',
      description:
        'Una comunidad internacional creada para romper los estereotipos que históricamente han condicionado la identidad de las mujeres en el mundo jurídico.',
      card1: {
        title: '1. ¿Qué es Girls and Law?',
        desc: 'Comunidad y movimiento internacional fundado por Roxana Rivera para transformar la mentalidad tradicional sobre la abogacía y romper estereotipos. Hoy integra a mujeres de todas las disciplinas que construyen múltiples caminos sin renunciar a su esencia.',
        tag1: '✦ Movimiento Internacional',
        tag2: 'Comunidad Multidisciplinaria',
      },
      card2: {
        title: '2. ¿Qué significa ser una Girl de Derecho?',
        desc: 'Para nosotras, una Girl de Derecho no es solo una profesional jurídica: es toda mujer que defiende sus derechos y los de los demás, reconoce su propia voz, cuestiona las desigualdades y promueve la justicia.',
        sample: '⚖️ "Toda mujer que defiende sus derechos y los de los demás"',
      },
      card3: {
        title: '3. Nuestra Misión',
        desc: 'Construir una comunidad internacional de mujeres multifacéticas, brindándoles herramientas, oportunidades y espacios de formación, liderazgo, visibilidad, colaboración y crecimiento personal y profesional.',
        stat: '+17,000 juristas & aliadas conectadas',
      },
      card4: {
        title: '4. Nuestra Visión',
        desc: 'Convertirnos en un movimiento internacional de referencia para que ninguna mujer tenga que limitar sus talentos o aspiraciones para encajar en estereotipos profesionales y sociales. Una red que inspire, lidere y transforme realidades.',
        stat1Num: '178',
        stat1Label: 'Postulaciones globales',
        stat2Num: '111',
        stat2Label: 'Integrantes en 14 países',
      },
    },
    syllabus: {
      eyebrow: 'Proyectos & Iniciativas',
      title: 'Iniciativas que impulsan a nuestra comunidad.',
      description:
        'Desarrollamos proyectos formativos, culturales y de bienestar para fortalecer la identidad y participación de nuestras integrantes.',
      tabsTitle: 'Nuestras Iniciativas',
      deliverableLabel: 'Plataforma oficial:',
      lessonsTitle: 'Puntos clave del proyecto:',
      skillsTitle: 'Impacto en la comunidad:',
      viewDetails: 'Conocer más de esta iniciativa',
      modules: [
        {
          id: 'proj-1',
          number: 'A',
          title: 'Entre Girls y Leyes – Podcast Oficial',
          duration: 'Spotify & Plataformas',
          description:
            'Espacio de conversación, reflexión y difusión de experiencias donde abordamos temas relacionados con el Derecho, las mujeres, el desarrollo profesional y las distintas formas de transformar nuestra sociedad.',
          lessons: [
            'Conversaciones honestas sobre el ejercicio profesional real',
            'Experiencias de juristas y mujeres multidisciplinarias',
            'Historias y perspectivas que inspiran a nuestra comunidad',
          ],
          skills: ['Pensamiento crítico', 'Visibilidad y difusión', 'Inspiración real'],
          deliverable: 'Disponible en Spotify y redes de Girls and Law',
        },
        {
          id: 'proj-2',
          number: 'B',
          title: 'Para Girls de Derecho – Playlist Oficial',
          duration: 'Música & Motivación',
          description:
            'Una playlist creada para acompañar, motivar y empoderar a nuestras Girls. Creemos que cada mujer necesita espacios para conectar consigo misma, recuperar su confianza y recordar todo lo que es capaz de lograr.',
          lessons: [
            'Selección musical para enfoque y energía en el estudio y litigio',
            'Canciones que refuerzan la confianza y presencia personal',
            'Espacio sonoro de identidad y sororidad para juristas',
          ],
          skills: ['Bienestar emocional', 'Confianza personal', 'Energía diaria'],
          deliverable: 'Curaduría exclusiva en Spotify',
        },
        {
          id: 'proj-3',
          number: 'C',
          title: 'Club de Lectura Internacional',
          duration: 'Encuentros Globales',
          description:
            'Un espacio que conecta a mujeres de diferentes países a través de la lectura, el intercambio de ideas y el aprendizaje colectivo, fomentando el pensamiento crítico, la cultura y el diálogo.',
          lessons: [
            'Lecturas seleccionadas con perspectiva jurídica y de género',
            'Debates virtuales mensuales entre integrantes de 14 países',
            'Construcción de vínculos internacionales y cultura compartida',
          ],
          skills: ['Análisis crítico', 'Cultura jurídica', 'Lazos internacionales'],
          deliverable: 'Sesiones mensuales en vivo & Guías de lectura',
        },
        {
          id: 'proj-4',
          number: 'D',
          title: 'Masterclasses & Formación Académica',
          duration: 'Campus Virtual',
          description:
            'Organizamos encuentros virtuales, masterclasses clínicas, conversatorios y capacitaciones con especialistas de distintas áreas, promoviendo el aprendizaje interdisciplinario y el rigor procesal.',
          lessons: [
            'Técnicas de litigación oral, teoría del caso y redacción procesal',
            'Modelos de escritos y demandas descargables en Word',
            'Certificación oficial emitida por Girls and Law',
          ],
          skills: ['Litigio de alto impacto', 'Rigor procesal', 'Acreditación oficial'],
          deliverable: 'Acceso en streaming HD en el Campus Virtual',
        },
        {
          id: 'proj-5',
          number: 'E',
          title: 'Marca Personal, Networking & Bienestar',
          duration: 'Alianzas & Red',
          description:
            'Impulsamos el desarrollo de la identidad profesional, comunicación digital y alianzas con universidades, organizaciones y proyectos de América Latina, Europa y Estados Unidos.',
          lessons: [
            'Herramientas para visibilizar talentos, proyectos y carrera',
            'Networking activo y derivación colaborativa de oportunidades',
            'Espacios de acompañamiento, bienestar mutuo e integración',
          ],
          skills: ['Marca personal', 'Networking internacional', 'Sororidad activa'],
          deliverable: 'Red privada de integrantes oficiales',
        },
      ],
    },
    founderSection: {
      badge: 'Nuestra Fundadora',
      title: 'Roxana Rivera: Fundadora de Girls and Law',
      originStory:
        'Girls and Law fue fundado por Roxana Rivera, bachiller en Derecho por la Universidad de San Martín de Porres, interesada en el Derecho Penal, los derechos humanos, el liderazgo y la transformación social.',
      reflection:
        'La iniciativa nació de una inquietud personal: ¿por qué una mujer debe ajustarse a un modelo determinado para ser considerada una buena abogada?',
      growth:
        'A partir de esa reflexión, Roxana creó un espacio que inicialmente buscaba cambiar la mentalidad sobre lo que debía ser una abogada y que, con el tiempo, se convirtió en una comunidad internacional que reconoce y celebra todas las dimensiones de las mujeres.',
      quote:
        '“No buscamos que todas seamos iguales. Buscamos que todas podamos ser nosotras mismas, sin límites impuestos por los estereotipos.”',
      name: 'Roxana Rivera',
      role: 'Fundadora & Directora de Girls and Law · Bachiller en Derecho por la USMP',
      badgeRole: 'Fundadora',
      cta: 'Conectar en Instagram @roxanamriverag',
    },
    identity: {
      badge: '✦ Sección Oficial 09 · Identidad Institucional',
      title: 'Nuestra Identidad Institucional',
      description: 'Los pilares fundacionales que definen el movimiento y comunidad internacional de Girls and Law.',
      nameLabel: 'Nombre Oficial',
      nameValue: 'Girls and Law',
      natureLabel: 'Naturaleza',
      natureValue: 'Comunidad y movimiento internacional de mujeres multifacéticas',
      founderLabel: 'Fundadora',
      founderValue: 'Roxana Rivera',
      sloganLabel: 'Frase Institucional',
      sloganValue: 'Mujeres multifacéticas transformando el Derecho',
      podcastLabel: 'Podcast Oficial',
      podcastValue: 'Entre Girls y Leyes',
      playlistLabel: 'Playlist Oficial',
      playlistValue: 'Para Girls de Derecho',
      cultureLabel: 'Iniciativa Cultural',
      cultureValue: 'Club de Lectura Internacional',
      digitalLabel: 'Presencia Digital',
      digitalValue: 'Instagram (+17K), TikTok y LinkedIn',
    },
    pricing: {
      eyebrow: 'Inversión & Membresías',
      title: 'Accede a la formación y comunidad oficial.',
      description: 'Planes flexibles en Soles PEN con acceso continuo al campus virtual y mentorías.',
      singlePayment: 'Mensual',
      installments: 'Anual (Ahorra 20%)',
      card1: {
        badge: 'Membresía Base',
        title: 'Plan Base',
        desc: 'Acceso ilimitado a todas las masterclasses grabadas y temarios interactivos en streaming HD.',
        priceSingle: 'S/. 49',
        priceInstallments: 'S/. 39',
        pricePeriod: '/mes (anual)',
        pricePeriodSingle: 'PEN / mes',
        features: [
          'Acceso ilimitado a todos los cursos y masterclasses',
          'Reproductor HD multidispositivo (Laptop, Celular, Tablet)',
          'Materiales procesales y lecturas complementarias',
          'Certificado digital por cada curso completado',
          'Actualizaciones continuas de jurisprudencia',
        ],
        cta: 'Elegir Plan Base →',
        guarantee: '14 días de garantía incondicional',
      },
      card2: {
        badge: 'Más Elegido · Recomendado',
        title: 'Plan Full',
        desc: 'Todo el contenido de cursos más una videollamada clínica en vivo (Meet) exclusiva con Roxana Rivera.',
        priceSingle: 'S/. 99',
        priceInstallments: 'S/. 79',
        pricePeriod: '/mes (anual)',
        pricePeriodSingle: 'PEN / mes',
        features: [
          'Todo lo incluido en el Plan Base',
          '1 Meet / Videollamada clínica en vivo con Roxana Rivera',
          'Resolución de dudas procesales y casos reales en vivo',
          'Descarga de matrices y minutas procesales en Word',
          'Acceso a la comunidad privada de abogadas de élite',
          'Grabación de la sesión para repasar cuando quieras',
        ],
        cta: 'Elegir Plan Full →',
        guarantee: 'Cupos limitados por cohorte · Mentoría directa',
      },
      card3: {
        badge: 'Acceso Total VIP',
        title: 'Plan Ultra',
        desc: 'Acceso total e irrestricto a todos los cursos, clínicas en vivo, Vault procesal y Meet 1 a 1 con Roxana Rivera.',
        priceSingle: 'S/. 199',
        priceInstallments: 'S/. 159',
        pricePeriod: '/mes (anual)',
        pricePeriodSingle: 'PEN / mes',
        features: [
          'Acceso TOTAL a todos los cursos presentes y futuros',
          'Meet exclusivo 1 a 1 personalizado con Roxana Rivera',
          'Clínicas de Juicio Oral y Litigio con simulaciones en vivo',
          'El Vault Procesal completo: 15+ modelos de demandas en Word',
          'Asesoría de marca personal jurídica y honorarios premium',
          'Canal VIP prioritario por WhatsApp con Roxana y su equipo',
        ],
        cta: 'Elegir Plan Ultra VIP →',
        guarantee: 'Acceso ilimitado · Asesoría VIP directa',
      },
    },
    faq: {
      eyebrow: 'Nuestra Filosofía',
      title: 'En qué creemos en Girls and Law',
      items: [
        {
          question: '1. No tenemos que elegir entre nuestra profesión y nuestras pasiones',
          answer:
            'Creemos que una mujer no tiene que renunciar a sus otros talentos para destacar en el Derecho. Una jurista puede ser artista, deportista, emprendedora, investigadora o madre con total plenitud.',
        },
        {
          question: '2. No existe una única manera de ser mujer ni de desarrollarse profesionalmente',
          answer:
            'Rompemos el molde rígido de lo que históricamente se impuso sobre la abogacía. Celebramos la diversidad de estilos, expresiones y trayectorias sin juzgar.',
        },
        {
          question: '3. Todas tenemos derecho a construir nuestra propia identidad',
          answer:
            'Tu autenticidad es tu mayor fortaleza. No necesitas fingir una personalidad ajena ni adoptar patrones masculinizados o fríos para ejercer con autoridad y excelencia.',
        },
        {
          question: '4. El conocimiento, la sororidad y la colaboración pueden transformar sociedades',
          answer:
            'Apostamos por la cooperación sobre la competencia destructiva. Una red de mujeres que se respaldan y comparten sus herramientas genera un impacto positivo duradero.',
        },
        {
          question: '5. Defender nuestros derechos y los de los demás es ejercer el Derecho',
          answer:
            'Incluso fuera de los tribunales: toda mujer que reconoce su voz, cuestiona desigualdades y promueve justicia en su entorno está transformando la realidad.',
        },
        {
          question: '6. Ser multifacética no significa estar dividida, sino reconocer todo nuestro potencial',
          answer:
            'Nuestras múltiples facetas enriquecen nuestra visión del mundo, haciéndonos profesionales más empáticas, creativas y resolutivas.',
        },
      ],
    },
    bottomCTA: {
      title: 'GIRLS AND LAW: MUJERES MULTIFACÉTICAS TRANSFORMANDO EL DERECHO.',
      description:
        'No buscamos que todas seamos iguales. Buscamos que todas podamos ser nosotras mismas, sin límites impuestos por los estereotipos. Únete a nuestra comunidad internacional.',
      ctaPrimary: 'Explorar Cursos & Formación →',
      ctaSecondary: 'Ingresar al Campus Virtual',
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
      vision: 'What is G&L',
      methodology: 'Our Essence',
      syllabus: 'Projects',
      founder: 'Founder',
      pricing: 'Investment',
      enroll: 'Join Us',
      podcastTitle: 'Listen to Podcast on Spotify',
    },
    hero: {
      badge: '✦ International Community & Movement · Girls and Law',
      title1: 'GIRLS AND LAW:',
      titleHighlight1: 'Multifaceted Women',
      title2: 'Transforming',
      titleHighlight2: 'the Law',
      title3: '.',
      description:
        'An international community and movement founded to transform the traditional mentality of what it means to be a female lawyer and break stereotypes in the legal world. Because a woman can be a lawyer, artist, athlete, psychologist, doctor, researcher, or anything she dreams to be.',
      ctaPrimary: 'Explore Courses & Training →',
      ctaSecondary: 'Discover Our Essence',
      guarantee: 'A Law Girl is every woman who defends her rights and those of others.',
      pills: {
        courtrooms: '+17,000 Instagram followers',
        models: 'Community in 14+ countries',
        mentorship: 'Founded by Roxana Rivera',
      },
      cinemaEyebrow: 'Academic Initiative · Official Masterclasses',
      cinemaTitle: 'Clinical training for high-impact legal professionals',
      playingBadge: 'AVAILABLE',
    },
    founderCard: {
      tag: 'LEADER 2026',
      role: 'FOUNDER OF GIRLS AND LAW',
      bio: 'Law graduate from USMP. Advocate for authentic leadership, human rights, and social transformation.',
      followers: 'IG Followers',
      clinical: 'Countries',
      rating: 'Community',
      cta: 'Connect with Roxana →',
    },
    features: {
      eyebrow: 'Our Essence & Movement',
      title: 'Multifaceted women transforming the Law.',
      description:
        'An international community created to break stereotypes that historically conditioned women’s identity in the legal sphere.',
      card1: {
        title: '1. What is Girls and Law?',
        desc: 'An international movement founded by Roxana Rivera to transform traditional legal culture and break stereotypes. Today it brings together women across disciplines who build multiple paths without sacrificing their essence.',
        tag1: '✦ Global Movement',
        tag2: 'Multidisciplinary Network',
      },
      card2: {
        title: '2. What does it mean to be a Law Girl?',
        desc: 'For us, a Law Girl is not only a legal practitioner: she is every woman who defends her rights and those of others, recognizes her voice, questions inequalities, and promotes justice.',
        sample: '⚖️ "Every woman who defends her rights and those of others"',
      },
      card3: {
        title: '3. Our Mission',
        desc: 'Build an international community of multifaceted women, providing tools, leadership opportunities, training, visibility, collaboration, and personal and professional growth.',
        stat: '+17,000 jurists & allies connected',
      },
      card4: {
        title: '4. Our Vision',
        desc: 'Become an international benchmark movement so no woman has to limit her talents or dreams to fit into professional stereotypes. A network that inspires, leads, and transforms.',
        stat1Num: '178',
        stat1Label: 'Global applicants',
        stat2Num: '111',
        stat2Label: 'Members in 14 countries',
      },
    },
    syllabus: {
      eyebrow: 'Projects & Initiatives',
      title: 'Initiatives empowering our global community.',
      description:
        'We develop educational, cultural, and wellness projects to strengthen identity, training, and active participation.',
      tabsTitle: 'Our Initiatives',
      deliverableLabel: 'Official Platform:',
      lessonsTitle: 'Key highlights:',
      skillsTitle: 'Community impact:',
      viewDetails: 'Learn more about this initiative',
      modules: [
        {
          id: 'proj-1',
          number: 'A',
          title: 'Entre Girls y Leyes – Official Podcast',
          duration: 'Spotify & Platforms',
          description:
            'A space for conversation, reflection, and sharing experiences where we discuss law, women, career development, and real societal transformation.',
          lessons: [
            'Honest discussions on actual professional practice',
            'Experiences of lawyers and multidisciplinary women',
            'Stories and perspectives that inspire our community',
          ],
          skills: ['Critical thinking', 'Visibility & outreach', 'Real inspiration'],
          deliverable: 'Available on Spotify and Girls and Law channels',
        },
        {
          id: 'proj-2',
          number: 'B',
          title: 'Para Girls de Derecho – Official Playlist',
          duration: 'Music & Motivation',
          description:
            'A playlist curated to accompany, motivate, and empower our Girls. We believe every woman needs spaces to connect with herself, rebuild confidence, and achieve her goals.',
          lessons: [
            'Curated tracks for high-focus legal study and litigation',
            'Songs that reinforce personal confidence and presence',
            'Sonic space of identity and sisterhood for jurists',
          ],
          skills: ['Emotional wellness', 'Personal confidence', 'Daily energy'],
          deliverable: 'Exclusive Spotify curation',
        },
        {
          id: 'proj-3',
          number: 'C',
          title: 'International Book Club',
          duration: 'Global Meetups',
          description:
            'Connecting women across 14 countries through reading, collective learning, and critical thinking on justice and culture.',
          lessons: [
            'Curated readings with legal and gender perspectives',
            'Monthly virtual discussions between international members',
            'Building international bonds and shared cultural enrichment',
          ],
          skills: ['Critical analysis', 'Legal culture', 'International bonds'],
          deliverable: 'Monthly live sessions & Reading guides',
        },
        {
          id: 'proj-4',
          number: 'D',
          title: 'Masterclasses & Academic Training',
          duration: 'Virtual Campus',
          description:
            'Virtual masterclasses, clinical sessions, and training with leading specialists, promoting cross-disciplinary learning and procedural excellence.',
          lessons: [
            'Oral advocacy techniques, case theory, and pleadings',
            'Downloadable legal templates and motions in Word',
            'Official certification accredited by Girls and Law',
          ],
          skills: ['High-impact litigation', 'Procedural rigor', 'Official certificate'],
          deliverable: 'HD streaming access on Virtual Campus',
        },
        {
          id: 'proj-5',
          number: 'E',
          title: 'Personal Brand, Networking & Wellness',
          duration: 'Alliances & Network',
          description:
            'Fostering professional identity, digital communication, and alliances with universities, organizations, and initiatives across Latin America, Europe, and the US.',
          lessons: [
            'Tools to showcase talents, projects, and career milestones',
            'Active networking and collaborative opportunity referrals',
            'Spaces for mutual support, integration, and community well-being',
          ],
          skills: ['Personal branding', 'Global networking', 'Active sisterhood'],
          deliverable: 'Private official members network',
        },
      ],
    },
    founderSection: {
      badge: 'Our Founder',
      title: 'Roxana Rivera: Founder of Girls and Law',
      originStory:
        'Girls and Law was founded by Roxana Rivera, a law graduate from the University of San Martín de Porres, deeply interested in Criminal Law, human rights, authentic leadership, and social transformation.',
      reflection:
        'The initiative was born from a personal question: why must a woman adjust to a rigid model to be considered a great lawyer?',
      growth:
        'From that reflection, Roxana built a space that initially set out to reshape the mindset around what being a female lawyer should mean, and over time transformed into an international movement celebrating every dimension of women.',
      quote:
        '“We do not seek for everyone to be the same. We seek for everyone to be themselves, without limits imposed by stereotypes.”',
      name: 'Roxana Rivera',
      role: 'Founder & Director of Girls and Law · Law Graduate from USMP',
      badgeRole: 'Founder',
      cta: 'Connect on Instagram @roxanamriverag',
    },
    identity: {
      badge: '✦ Official Section 09 · Institutional Identity',
      title: 'Our Institutional Identity',
      description: 'The core pillars defining the international movement and community of Girls and Law.',
      nameLabel: 'Official Name',
      nameValue: 'Girls and Law',
      natureLabel: 'Nature',
      natureValue: 'International community and movement of multifaceted women',
      founderLabel: 'Founder',
      founderValue: 'Roxana Rivera',
      sloganLabel: 'Institutional Motto',
      sloganValue: 'Multifaceted women transforming the Law',
      podcastLabel: 'Official Podcast',
      podcastValue: 'Entre Girls y Leyes',
      playlistLabel: 'Official Playlist',
      playlistValue: 'Para Girls de Derecho',
      cultureLabel: 'Cultural Initiative',
      cultureValue: 'International Book Club',
      digitalLabel: 'Digital Presence',
      digitalValue: 'Instagram (+17K), TikTok & LinkedIn',
    },
    pricing: {
      eyebrow: 'Tuition & Plans 2026',
      title: 'Choose your legal subscription plan.',
      description: 'Flexible monthly membership in Soles PEN. Cancel or switch plans anytime.',
      singlePayment: 'Monthly',
      installments: 'Annual (Save 20%)',
      card1: {
        badge: 'Base Membership',
        title: 'Plan Base',
        desc: 'Unlimited access to all recorded masterclasses and interactive syllabi in HD streaming.',
        priceSingle: 'S/. 49',
        priceInstallments: 'S/. 39',
        pricePeriod: '/mo (billed annually)',
        pricePeriodSingle: 'PEN / month',
        features: [
          'Unlimited access to all courses and masterclasses',
          'Multi-device HD video player (Laptop, Phone, Tablet)',
          'Comprehensive legal readings and lecture slides',
          'Verified digital certificate for each course',
          'Continuous case law and precedent updates',
        ],
        cta: 'Choose Plan Base →',
        guarantee: '14-day 100% unconditional guarantee',
      },
      card2: {
        badge: 'Most Popular · Recommended',
        title: 'Plan Full',
        desc: 'Full course access plus an exclusive live trial clinic (Meet) with Roxana Rivera.',
        priceSingle: 'S/. 99',
        priceInstallments: 'S/. 79',
        pricePeriod: '/mo (billed annually)',
        pricePeriodSingle: 'PEN / month',
        features: [
          'Everything included in Plan Base',
          '1 Live Clinical Meet / Videocall with Roxana Rivera',
          'Live Q&A and practical case troubleshooting',
          'Downloadable procedural matrices in Word',
          'Access to the private elite women lawyers community',
          'HD session recording for lifetime review',
        ],
        cta: 'Choose Plan Full →',
        guarantee: 'Limited cohort seats · Direct mentorship',
      },
      card3: {
        badge: 'VIP Total Access',
        title: 'Plan Ultra',
        desc: 'Total unrestricted access to all courses, live courtroom clinics, Vault, and 1-on-1 Meet with Roxana.',
        priceSingle: 'S/. 199',
        priceInstallments: 'S/. 159',
        pricePeriod: '/mo (billed annually)',
        pricePeriodSingle: 'PEN / month',
        features: [
          'TOTAL access to all current and upcoming courses',
          'Private 1-on-1 personalized Meet with Roxana Rivera',
          'Live trial simulation clinics with interactive roles',
          'The Complete Procedural Vault: 15+ Word templates',
          'Legal personal branding and premium fee advisory',
          'Priority VIP WhatsApp channel with Roxana & team',
        ],
        cta: 'Choose Plan Ultra VIP →',
        guarantee: 'Unlimited access · Direct VIP executive advisory',
      },
    },
    faq: {
      eyebrow: 'Our Philosophy',
      title: 'What we believe in Girls and Law',
      items: [
        {
          question: '1. We do not have to choose between our profession and our passions',
          answer:
            'A woman does not have to give up her other talents to excel in law. A legal practitioner can be an artist, athlete, entrepreneur, researcher, or mother with complete fulfillment.',
        },
        {
          question: '2. There is no single way to be a woman or develop professionally',
          answer:
            'We break the rigid historical mold of legal practice. We celebrate diversity of styles, expressions, and career journeys without judgment.',
        },
        {
          question: '3. We all have the right to build our own identity',
          answer:
            'Authenticity is strength. You don’t need to adopt a cold or aggressive persona to practice with authority and excellence.',
        },
        {
          question: '4. Knowledge, sisterhood, and collaboration can transform societies',
          answer:
            'We believe in mutual cooperation over destructive competition. A network of women supporting and sharing tools creates lasting positive impact.',
        },
        {
          question: '5. Defending our rights and those of others is practicing the Law',
          answer:
            'Even outside courtrooms: every woman who recognizes her voice, challenges inequalities, and champions justice transforms society.',
        },
        {
          question: '6. Being multifaceted does not mean being divided—it means realizing full potential',
          answer:
            'Our diverse passions enrich our worldview, making us more empathetic, creative, and resolute advocates.',
        },
      ],
    },
    bottomCTA: {
      title: 'GIRLS AND LAW: MULTIFACETED WOMEN TRANSFORMING THE LAW.',
      description:
        'We do not seek for everyone to be the same. We seek for everyone to be themselves, without limits imposed by stereotypes. Join our international community.',
      ctaPrimary: 'Explore Courses & Training →',
      ctaSecondary: 'Enter Virtual Campus',
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
