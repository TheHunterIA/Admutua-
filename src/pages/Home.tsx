import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Youtube, Play, Calendar, ArrowRight, X, MapPin, Phone, ExternalLink, Newspaper, Quote, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const { data: specialEvents } = useFirestoreCollection<any>('events', orderBy('order', 'desc'));
  const { data: recentUpdates } = useFirestoreCollection<any>('updates', orderBy('createdAt', 'desc'));
  const { data: ebdLessons } = useFirestoreCollection<any>('ebdLessons', orderBy('createdAt', 'desc'));

  const filteredEvents = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return specialEvents.filter(event => {
      const start = event.displayStartDate;
      const end = event.displayEndDate;
      if (start && today < start) return false;
      if (end && today > end) return false;
      return true;
    });
  }, [specialEvents]);

  const navigate = useNavigate();

  // Auto-play timer for events (10 seconds)
  React.useEffect(() => {
    if (filteredEvents.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % filteredEvents.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [filteredEvents.length]);

  // Reset index if out of bounds
  React.useEffect(() => {
    if (currentEventIndex >= filteredEvents.length && filteredEvents.length > 0) {
      setCurrentEventIndex(0);
    }
  }, [filteredEvents.length, currentEventIndex]);

  const { data: siteConfig } = useFirestoreDoc<any>('config', 'site');
  const { data: leadership } = useFirestoreDoc<any>('config', 'leadership');

  // Combine updates from different sources
  const combinedUpdates = React.useMemo(() => {
    const items: any[] = [];

    // Add manual updates
    recentUpdates.forEach(u => items.push({ ...u, type: 'news' }));

    // Add latest events (only if they have createdAt)
    filteredEvents.forEach(e => {
      if (e.createdAt) {
        items.push({
          id: e.id,
          title: `Novo Evento: ${e.title}`,
          description: e.theme,
          date: e.date,
          imageUrl: e.imageUrl,
          createdAt: e.createdAt,
          type: 'event',
          original: e
        });
      }
    });

    // Add leadership message if updated
    if (leadership?.updatedAt) {
      const dateObj = leadership.updatedAt?.toDate ? leadership.updatedAt.toDate() : new Date();
      items.push({
        id: 'leadership-update',
        title: "Nova Mensagem Pastoral",
        description: leadership.message,
        date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
        imageUrl: leadership.imageUrl,
        createdAt: leadership.updatedAt,
        type: 'pastoral'
      });
    }

    // Add latest EBD lessons (only if they have createdAt)
    ebdLessons.forEach(l => {
      if (l.createdAt) {
        const dateObj = l.createdAt?.toDate ? l.createdAt.toDate() : new Date();
        items.push({
          id: l.id,
          title: `Nova Lição EBD: ${l.lessonTitle}`,
          description: `Trimestre ${l.quarterNumber} • Lição ${l.lessonNumber}`,
          date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
          createdAt: l.createdAt,
          type: 'ebd',
          original: l
        });
      }
    });

    // Sort by createdAt desc
    return items.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
      const timeB = b.createdAt?.toMillis?.() || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
      return timeB - timeA;
    }).slice(0, 8); // Show up to 8 recent updates
  }, [recentUpdates, specialEvents, leadership, ebdLessons]);

  const handleUpdateClick = (update: any) => {
    if (update.type === 'event') {
      setSelectedEvent(update.original);
    } else if (update.type === 'pastoral') {
      navigate('/lideranca');
    } else if (update.type === 'ebd') {
      navigate('/ebd');
    } else if (update.type === 'missionary') {
      navigate('/missoes');
    } else if (update.type === 'news') {
      navigate(`/noticias/${update.id}`);
    } else if (update.link) {
      window.open(update.link, '_blank');
    }
  };

  const heroTitle = siteConfig?.heroTitle || "Bem-vindo à Assembleia de Deus em Mutuá";
  const heroSubtitle = siteConfig?.heroSubtitle || "Um lugar de paz, fé e comunhão. Venha fazer parte da nossa família e viver o amor de Cristo.";
  const heroBackgroundImage = siteConfig?.heroBackgroundImage || "/hero-bg.png";
  const liveVideoId = siteConfig?.liveVideoId || "";
  const hasLiveStream = Boolean(liveVideoId && liveVideoId.trim() !== "");

  return (
    <div className="flex flex-col bg-pearl">
      {/* Hero Section */}
      <section id="inicio" className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBackgroundImage} 
            alt="Church" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-church-blue/70 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-church-blue/20 to-church-blue/90"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full pt-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.5em] uppercase mb-6 block">
                Assembleia de Deus em Mutuá
              </span>
              <h1 className="text-4xl md:text-7xl text-pearl mb-8 leading-[0.9] font-serif italic">
                {heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-pearl/70 mb-12 font-light leading-relaxed max-w-xl">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/cultos" className="btn-minimal bg-church-vibrant text-church-blue border-none">
                  Nossos Cultos
                </Link>
                <Link to="/contato" className="btn-minimal text-pearl border-pearl/30">
                  Como Chegar
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="flex items-center gap-4 text-pearl/20">
            <span className="text-[10px] tracking-[0.5em] uppercase vertical-text">Fé • Esperança • Amor</span>
            <div className="w-px h-32 bg-pearl/20"></div>
          </div>
        </div>
      </section>

      {/* Events & Updates Section */}
      {(filteredEvents.length > 0 || combinedUpdates.length > 0) && (
        <section className="pt-8 pb-12 px-6 md:px-12 lg:px-20 bg-pearl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-church-vibrant/20 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              
              {/* Left Side: Special Events */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Programação</span>
                  <h2 className="text-4xl md:text-6xl text-church-blue leading-tight mb-4">Eventos Especiais</h2>
                  <p className="text-church-muted font-light max-w-sm leading-relaxed">
                    Momentos únicos de comunhão e adoração. Participe de nossa jornada de fé.
                  </p>
                </div>

                <div className="relative h-[450px] w-full overflow-hidden flex flex-col items-center justify-center">
                  {/* Stage Container */}
                  <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                    <AnimatePresence initial={false}>
                      {filteredEvents.map((event: any, idx: number) => {
                        // Calculate relative position to current index
                        let position = idx - currentEventIndex;
                        
                        // Handle wrap-around for a continuous feel
                        const total = filteredEvents.length;
                        if (position > total / 2) position -= total;
                        if (position < -total / 2) position += total;

                        // Only render cards close to the center for performance
                        if (Math.abs(position) > 1) return null;

                        return (
                          <motion.div
                            key={event.id}
                            initial={false}
                            animate={{
                              x: position * 480, // Offset based on position
                              scale: position === 0 ? 1 : 0.8,
                              opacity: position === 0 ? 1 : 0.3,
                              zIndex: position === 0 ? 20 : 10,
                              rotateY: position * -15,
                              filter: position === 0 ? 'blur(0px)' : 'blur(4px)',
                            }}
                            transition={{
                              duration: 0.8,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                            className="absolute w-full max-w-[500px] cursor-pointer"
                            onClick={() => {
                              if (position !== 0) setCurrentEventIndex(idx);
                            }}
                          >
                            <div className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] bg-pearl border border-white/10">
                              <img 
                                src={event.imageUrl} 
                                alt={event.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-church-blue via-church-blue/20 to-transparent opacity-80"></div>
                              
                              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <span className="text-church-vibrant text-[9px] font-bold tracking-[0.3em] uppercase mb-3 block">
                                  {event.date}
                                </span>
                                <h3 className="text-2xl text-white font-serif italic leading-tight mb-4">
                                  {event.title}
                                </h3>
                                
                                {position === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                  >
                                    <p className="text-pearl/70 text-sm font-light italic line-clamp-2">
                                      "{event.theme}"
                                    </p>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEvent(event);
                                      }}
                                      className="w-full h-12 rounded-2xl bg-church-vibrant text-church-blue font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all duration-500"
                                    >
                                      Ver Detalhes
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Navigation Controls */}
                  {specialEvents.length > 1 && (
                    <div className="flex items-center gap-8 mt-4">
                      <button 
                        onClick={() => setCurrentEventIndex((prev) => (prev === 0 ? specialEvents.length - 1 : prev - 1))}
                        className="w-14 h-14 rounded-full border border-church-blue/10 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all group/btn"
                      >
                        <ChevronLeft size={24} strokeWidth={1.5} className="group-hover/btn:-translate-x-1 transition-transform" />
                      </button>
                      
                      <div className="flex gap-2">
                        {specialEvents.map((_: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => setCurrentEventIndex(i)}
                            className={`h-1 rounded-full transition-all duration-500 ${i === currentEventIndex ? 'w-10 bg-church-vibrant' : 'w-2 bg-church-blue/10'}`}
                          />
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentEventIndex((prev) => (prev === specialEvents.length - 1 ? 0 : prev + 1))}
                        className="w-14 h-14 rounded-full border border-church-blue/10 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all group/btn"
                      >
                        <ChevronRight size={24} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Recent Updates Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  <div className="mb-8">
                    <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Fique por dentro</span>
                    <h2 className="text-3xl text-church-blue leading-tight">Últimas Novidades</h2>
                  </div>

                  <div className="space-y-6">
                    {combinedUpdates.map((update: any, idx: number) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="group relative pl-8 border-l border-church-blue/10 hover:border-church-vibrant transition-colors duration-500 cursor-pointer"
                        onClick={() => handleUpdateClick(update)}
                      >
                        <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-church-blue/20 group-hover:bg-church-vibrant transition-colors"></div>
                        
                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-[9px] font-bold tracking-widest uppercase text-church-vibrant">
                            {update.type === 'event' ? 'Evento' : update.type === 'pastoral' ? 'Pastoral' : update.type === 'ebd' ? 'EBD' : update.type === 'missionary' ? 'Missões' : 'Notícia'}
                          </span>
                          <span className="text-[9px] text-church-muted/60 uppercase tracking-widest">{update.date}</span>
                        </div>

                        <h3 className="text-lg text-church-blue font-serif italic mb-3 leading-tight group-hover:text-church-vibrant transition-colors">
                          {update.title}
                        </h3>
                        
                        <p className="text-sm text-church-muted font-light leading-relaxed mb-2 line-clamp-2 italic">
                          {update.type === 'pastoral' ? `"${update.description}"` : update.description}
                        </p>

                        <div>
                          {update.type === 'event' ? (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ver Detalhes <ArrowRight size={12} />
                            </div>
                          ) : update.type === 'pastoral' ? (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ler Mensagem <Quote size={12} />
                            </div>
                          ) : update.type === 'ebd' ? (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ler Lição <BookOpen size={12} />
                            </div>
                          ) : update.type === 'missionary' ? (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ver Missões <ArrowRight size={12} />
                            </div>
                          ) : (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ler mais <ArrowRight size={12} />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-church-blue/5">
                    {/* Link removido temporariamente pois a página não existe */}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* News Banner Section */}
      {recentUpdates.length > 0 && (
        <section className="section-padding bg-pearl relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-4xl md:text-6xl text-church-blue leading-tight">Notícias</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentUpdates.slice(0, 3).map((news: any) => (
                <Link key={news.id} to={`/noticias/${news.id}`} className="group cursor-pointer">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-2">
                    <img 
                      src={news.imageUrl} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-xl text-church-blue font-serif italic mb-2 group-hover:text-church-vibrant transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-church-muted line-clamp-2">{news.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Stream Section */}
      <section className="section-padding bg-[#050B14] text-pearl relative overflow-hidden">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-church-blue/20 rounded-full blur-[150px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`flex flex-col ${hasLiveStream ? 'lg:flex-row' : 'items-center text-center'} items-center gap-12 lg:gap-16`}>
            <div className={`${hasLiveStream ? 'lg:w-1/2' : 'max-w-3xl'} space-y-6`}>
              {hasLiveStream && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold tracking-[0.3em] uppercase shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  Transmissão ao Vivo
                </motion.div>
              )}
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] font-serif italic text-white"
              >
                Acompanhe Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Cultos Online</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`text-lg text-pearl/60 font-light leading-relaxed ${hasLiveStream ? 'max-w-xl' : 'max-w-2xl mx-auto'}`}
              >
                Não pode estar presente fisicamente? Junte-se a nós em nossa transmissão ao vivo pelo YouTube. 
                Adore ao Senhor conosco de onde você estiver, com a mesma fé e comunhão.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className={`flex flex-wrap gap-4 pt-2 ${hasLiveStream ? '' : 'justify-center'}`}
              >
                {hasLiveStream && (
                  <a 
                    href={`https://www.youtube.com/watch?v=${liveVideoId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-red-600 rounded-2xl hover:bg-red-700 hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:-translate-y-1"
                  >
                    <Youtube size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                    Assistir no YouTube
                  </a>
                )}
                <Link 
                  to="/cultos" 
                  className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:-translate-y-1"
                >
                  Ver Horários
                </Link>
              </motion.div>
            </div>

            {hasLiveStream && (
              <div className="lg:w-1/2 w-full relative perspective-1000">
                {/* Decorative glow behind video */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/30 to-church-blue/30 blur-3xl rounded-[4rem] opacity-50 animate-pulse"></div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10, rotateX: 5 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
                  className="relative p-2 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
                >
                  <div className="aspect-video bg-[#0a0a0a] rounded-[2rem] overflow-hidden relative group">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=0&mute=0`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-700 relative z-10"
                    ></iframe>
                    
                    {/* Subtle overlay to blend iframe with the dark theme when not hovered */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/80 to-transparent pointer-events-none opacity-50 group-hover:opacity-0 transition-opacity duration-700 z-20"></div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-church-blue/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-pearl rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative"
            >
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-8 right-8 z-10 bg-pearl/80 backdrop-blur-sm p-3 rounded-full text-church-blue hover:bg-church-vibrant hover:text-pearl transition-all shadow-sm"
              >
                <X size={24} strokeWidth={1.5} />
              </button>

              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-church-blue/60 to-transparent lg:bg-gradient-to-r"></div>
                </div>

                <div className="lg:w-3/5 p-10 md:p-16">
                  <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Detalhes do Evento</span>
                  <h2 className="text-4xl md:text-5xl text-church-blue mb-10 leading-tight italic">{selectedEvent.title}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted flex items-center gap-2">
                        <Calendar size={14} className="text-church-vibrant" />
                        Data
                      </h4>
                      <p className="text-lg text-church-blue font-light">{selectedEvent.date}</p>
                    </div>
                    {selectedEvent.location && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted flex items-center gap-2">
                          <MapPin size={14} className="text-church-vibrant" />
                          Local
                        </h4>
                        <p className="text-lg text-church-blue font-light">{selectedEvent.location}</p>
                      </div>
                    )}
                    {selectedEvent.contactPhone && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted flex items-center gap-2">
                          <Phone size={14} className="text-church-vibrant" />
                          Contato
                        </h4>
                        <p className="text-lg text-church-blue font-light">{selectedEvent.contactPhone}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted">Tema</h4>
                      <p className="text-lg text-church-blue font-light italic">"{selectedEvent.theme}"</p>
                    </div>
                  </div>

                  {selectedEvent.details && (
                    <div className="mb-12">
                      <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted mb-4">Sobre o Evento</h4>
                      <div className="text-church-text/80 leading-relaxed font-light whitespace-pre-wrap text-lg">
                        {selectedEvent.details}
                      </div>
                    </div>
                  )}

                  {selectedEvent.additionalImages && selectedEvent.additionalImages.length > 0 && (
                    <div className="mb-12">
                      <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted mb-6">Galeria</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedEvent.additionalImages.map((img: string, idx: number) => (
                          <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-church-vibrant/10">
                            <img 
                              src={img} 
                              alt={`Galeria ${idx + 1}`} 
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-10 border-t border-church-vibrant/10 flex flex-col sm:flex-row gap-6">
                    {selectedEvent.isRegistrationOpen && selectedEvent.registrationLink ? (
                      <a 
                        href={selectedEvent.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-minimal bg-church-vibrant text-church-blue border-none flex-1 text-center"
                      >
                        Inscrição Online
                      </a>
                    ) : (
                      <Link 
                        to="/contato" 
                        onClick={() => setSelectedEvent(null)}
                        className="btn-minimal bg-church-blue text-pearl border-none flex-1 text-center"
                      >
                        Quero Participar
                      </Link>
                    )}
                    {selectedEvent.link && (
                      <a 
                        href={selectedEvent.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-minimal flex-1 text-center"
                      >
                        Site Oficial
                      </a>
                    ) || (
                      <button 
                        onClick={() => setSelectedEvent(null)}
                        className="btn-minimal flex-1 text-center"
                      >
                        Fechar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
