import { firestoreService } from '../hooks/useFirestore';
import { serverTimestamp } from 'firebase/firestore';

export const seedInitialData = async () => {
  try {
    // Config Site
    await firestoreService.set('config', 'site', {
      heroTitle: "Bem-vindo à Assembleia de Deus em Mutuá",
      heroSubtitle: "Um lugar de paz, fé e comunhão. Venha fazer parte da nossa família e viver o amor de Cristo.",
      heroBackgroundImage: "/hero-bg.png",
      liveVideoId: "live",
      logoUrl: "/logo-nova.png",
      footerBannerUrl: "/banner.png"
    });

    // Config About
    await firestoreService.set('config', 'about', {
      titleLine1: "Nossa Casa,",
      titleLine2: "Sua Família",
      text: "A Assembleia de Deus Mutuá é uma comunidade cristã firmada na Palavra de Deus. Nosso propósito é adorar ao Senhor, pregar o Evangelho e cuidar das pessoas, proporcionando um ambiente de crescimento espiritual e acolhimento para todas as idades.\n\nCom décadas de história no coração de Mutuá, temos sido um farol de esperança e fé, dedicados a transformar vidas através do amor de Cristo e do serviço à nossa comunidade.",
      imageUrl: "https://picsum.photos/seed/church-interior/800/1000",
      quote: "\"Até aqui nos ajudou o Senhor\""
    });

    // Config Leadership
    await firestoreService.set('config', 'leadership', {
      name: "Pr. Adilson Faria Soares",
      role: "Pastor Presidente",
      message: "Nossa missão é pastorear com amor, guiando cada ovelha ao conhecimento profundo de Cristo. Acreditamos que a igreja é um hospital para a alma e uma escola para o espírito. Você e sua família são nossos convidados de honra para adorar a Deus conosco.",
      imageUrl: "/pr-adilson.png",
      updatedAt: serverTimestamp()
    });

    // Config Contact
    await firestoreService.set('config', 'contact', {
      address: "R. Dr. Cumplido de Santana, 42, Mutua, São Gonçalo - RJ",
      phone: "(21) 2713-5394",
      email: "contato@admutua.com.br",
      whatsapp: "(21) 99999-9999",
      instagramUrl: "https://www.instagram.com",
      youtubeChannelUrl: "https://www.youtube.com/@igrejaevangelicaassembleia6483"
    });

    // Services
    const services = [
      { day: "Terça-feira", time: "19:30", name: "Culto de Oração", order: 0 },
      { day: "Quinta-feira", time: "19:30", name: "Culto de Doutrina", order: 1 },
      { day: "Domingo", time: "09:00", name: "Escola Bíblica Dominical", order: 2 },
      { day: "Domingo", time: "18:30", name: "Culto da Família", order: 3 },
    ];
    for (const s of services) {
      await firestoreService.set('services', `seed-service-${s.order}`, s);
    }

    // Departments
    const departments = [
      { name: "UMADEM", description: "União de Mocidade da Assembleia de Deus em Mutuá. Um espaço para jovens crescerem na fé e comunhão.", pastor: "Líder da Mocidade", phone: "(21) 2713-5394", imageUrl: "https://picsum.photos/seed/youth/800/600", order: 0 },
      { name: "Círculo de Oração", description: "Grupo de intercessão e oração das mulheres da igreja.", pastor: "Líder das Mulheres", phone: "(21) 2713-5394", imageUrl: "https://picsum.photos/seed/prayer/800/600", order: 1 },
      { name: "Departamento Infantil", description: "Ensinando o caminho do Senhor para as crianças desde cedo.", pastor: "Líder Infantil", phone: "(21) 2713-5394", imageUrl: "https://picsum.photos/seed/kids/800/600", order: 2 },
    ];
    for (const d of departments) {
      await firestoreService.set('departments', `seed-dept-${d.order}`, d);
    }

    // Congregations
    const congregations = [
      { name: "Sede - Mutuá", address: "R. Dr. Cumplido de Santana, 42, Mutua, São Gonçalo - RJ", pastor: "Pr. Adilson Faria Soares", phone: "(21) 2713-5394", imageUrl: "https://picsum.photos/seed/church/800/600", order: 0 },
    ];
    for (const c of congregations) {
      await firestoreService.set('congregations', `seed-cong-${c.order}`, c);
    }

    // Events (Sample)
    await firestoreService.set('events', 'seed-event-0', {
      title: "Congresso de Jovens 2026",
      theme: "Firmados na Rocha",
      date: "15 a 17 de Maio",
      location: "Templo Sede - AD Mutuá",
      contactPhone: "(21) 2713-5394",
      imageUrl: "https://picsum.photos/seed/event/1920/1080",
      link: "/contato",
      details: "O Congresso de Jovens 2026 será um marco em nossa igreja. Teremos preletores convidados, bandas de adoração e momentos profundos de oração. \n\nProgramação:\n- Sexta: 19:30 - Abertura\n- Sábado: 09:00 - Workshops / 19:00 - Culto de Celebração\n- Domingo: 18:30 - Encerramento\n\nNão perca!",
      hasLimitedSpots: true,
      additionalImages: [
        "https://picsum.photos/seed/event1/800/600",
        "https://picsum.photos/seed/event2/800/600",
        "https://picsum.photos/seed/event3/800/600"
      ],
      order: 0,
      createdAt: serverTimestamp()
    });

    // Updates (Sample)
    const updates = [
      { 
        title: "Novo Horário de Culto", 
        description: "A partir do próximo mês, teremos um novo horário para o Culto de Oração nas terças-feiras. Agora começaremos às 19:00.", 
        date: "30 de Março, 2026", 
        imageUrl: "https://picsum.photos/seed/news1/800/600", 
        createdAt: serverTimestamp() 
      },
      { 
        title: "Campanha de Doação de Alimentos", 
        description: "Estamos arrecadando alimentos não perecíveis para ajudar as famílias carentes de nossa comunidade. Entregue sua doação na secretaria.", 
        date: "28 de Março, 2026", 
        imageUrl: "https://picsum.photos/seed/news2/800/600", 
        createdAt: serverTimestamp() 
      },
      { 
        title: "Reforma do Templo Sede", 
        description: "As obras de revitalização do nosso templo sede continuam avançando. Agradecemos a todos pelas contribuições e orações.", 
        date: "25 de Março, 2026", 
        imageUrl: "https://picsum.photos/seed/news3/800/600", 
        createdAt: serverTimestamp() 
      },
    ];
    for (let i = 0; i < updates.length; i++) {
      await firestoreService.set('updates', `seed-update-${i}`, updates[i]);
    }

    // EBD Classes
    const ebdClasses = [
      {
        name: "Crianças (Kids)",
        teacher: "Tia Maria",
        location: "Sala 1",
        schedule: "Domingos, 09:00",
        description: "Ensino lúdico e bíblico, preparando os pequeninos para uma vida com Cristo desde cedo.",
        order: 0,
        createdAt: serverTimestamp()
      },
      {
        name: "Adolescentes",
        teacher: "Pr. João",
        location: "Sala 2",
        schedule: "Domingos, 09:00",
        description: "Abordagem de temas atuais à luz da Bíblia, ajudando-os a enfrentar os desafios da juventude.",
        order: 1,
        createdAt: serverTimestamp()
      },
      {
        name: "Jovens",
        teacher: "Pr. Pedro",
        location: "Sala 3",
        schedule: "Domingos, 09:00",
        description: "Estudos aprofundados sobre vocação, relacionamentos e vida cristã na sociedade moderna.",
        order: 2,
        createdAt: serverTimestamp()
      },
      {
        name: "Adultos",
        teacher: "Pr. Adilson",
        location: "Templo Principal",
        schedule: "Domingos, 09:00",
        description: "Aprofundamento teológico e prático para a vida familiar, profissional e ministério cristão.",
        order: 3,
        createdAt: serverTimestamp()
      }
    ];
    for (const c of ebdClasses) {
      await firestoreService.set('ebdClasses', `seed-ebd-class-${c.order}`, c);
    }

    // Historical Moments
    const historicalMoments = [
      {
        date: "1980",
        title: "O Início de Tudo",
        description: "A fundação da nossa congregação no bairro do Mutuá. Um pequeno grupo de irmãos unidos pela fé e pelo desejo de espalhar a palavra de Deus.",
        imageUrl: "https://picsum.photos/seed/history1/800/600",
        order: 0,
        createdAt: serverTimestamp()
      },
      {
        date: "1995",
        title: "Construção do Templo",
        description: "Com muito esforço e oração, inauguramos nosso templo principal. Um marco de crescimento e consolidação do nosso ministério.",
        imageUrl: "https://picsum.photos/seed/history2/800/1000",
        order: 1,
        createdAt: serverTimestamp()
      },
      {
        date: "2010",
        title: "Expansão Missionária",
        description: "O envio dos nossos primeiros missionários. A visão de alcançar vidas além das nossas fronteiras se tornou realidade.",
        imageUrl: "https://picsum.photos/seed/history3/1000/800",
        order: 2,
        createdAt: serverTimestamp()
      },
      {
        date: "2020",
        title: "Igreja Digital",
        description: "Em meio aos desafios globais, iniciamos nossas transmissões online, levando esperança e conforto para dentro dos lares.",
        imageUrl: "https://picsum.photos/seed/history4/800/800",
        order: 3,
        createdAt: serverTimestamp()
      },
      {
        date: "2023",
        title: "Novo Departamento Infantil",
        description: "Inauguração do novo espaço dedicado às nossas crianças, investindo na próxima geração de adoradores.",
        imageUrl: "https://picsum.photos/seed/history5/800/600",
        order: 4,
        createdAt: serverTimestamp()
      },
      {
        date: "Dias Atuais",
        title: "Uma Família em Crescimento",
        description: "Continuamos nossa jornada, firmados na rocha que é Cristo, acolhendo novas famílias e vivendo o propósito de Deus.",
        imageUrl: "https://picsum.photos/seed/history6/1000/1000",
        order: 5,
        createdAt: serverTimestamp()
      }
    ];
    for (const h of historicalMoments) {
      await firestoreService.set('history', `seed-history-${h.order}`, h);
    }

    return true;
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};

export const removeSeedData = async () => {
  try {
    const seedIds = {
      services: [0, 1, 2, 3].map(i => `seed-service-${i}`),
      departments: [0, 1, 2].map(i => `seed-dept-${i}`),
      congregations: [0].map(i => `seed-cong-${i}`),
      events: ['seed-event-0'],
      updates: [0, 1, 2].map(i => `seed-update-${i}`),
      ebdClasses: [0, 1, 2, 3].map(i => `seed-ebd-class-${i}`),
      history: [0, 1, 2, 3, 4, 5].map(i => `seed-history-${i}`)
    };

    for (const [collection, ids] of Object.entries(seedIds)) {
      for (const id of ids) {
        await firestoreService.delete(collection, id);
      }
    }
    return true;
  } catch (error) {
    console.error("Error removing seed data:", error);
    throw error;
  }
};

export const clearAllData = async () => {
  try {
    const collections = ['services', 'departments', 'congregations', 'events', 'updates', 'contactSubmissions', 'ebdLessons', 'ebdClasses', 'history'];
    for (const coll of collections) {
      await firestoreService.clearCollection(coll);
    }
    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
};
