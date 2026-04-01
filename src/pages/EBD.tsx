import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Users, Clock, MapPin, ArrowRight, Heart, Sparkles, GraduationCap, Quote, ChevronRight, ChevronLeft, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { orderBy, where } from 'firebase/firestore';

export default function EBD() {
  const { data: lessons, loading: loadingLessons } = useFirestoreCollection<any>('ebdLessons', orderBy('createdAt', 'desc'));
  const { data: ebdClasses, loading: loadingClasses } = useFirestoreCollection<any>('ebdClasses', orderBy('createdAt', 'asc'));
  const { data: news } = useFirestoreCollection<any>('updates', where('subject', '==', 'EBD'), orderBy('createdAt', 'desc'));
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const currentLesson = lessons.find((l: any) => l.id === selectedLessonId) || lessons[0];
  const pastLessons = lessons.filter((l: any) => l.id !== currentLesson?.id);

  // Scroll to top when lesson changes
  useEffect(() => {
    if (selectedLessonId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedLessonId]);

  // Auto-play timer for news (10 seconds)
  useEffect(() => {
    const newsCount = news.length;
    if (newsCount <= 1) return;
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsCount);
    }, 10000);
    return () => clearInterval(timer);
  }, [news.length]);

  // Reset index if out of bounds
  useEffect(() => {
    const newsCount = news.length;
    if (currentNewsIndex >= newsCount && newsCount > 0) {
      setCurrentNewsIndex(0);
    }
  }, [news.length, currentNewsIndex]);

  return (
    <div className="min-h-screen bg-pearl pt-20">
      {/* Lesson of the Week Section (Now the Hero/Top Section) */}
      {currentLesson && currentLesson.content ? (
        <section className="relative pt-8 pb-16 bg-white border-b border-church-blue/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-church-vibrant/30 text-church-vibrant text-[10px] font-bold tracking-[0.3em] uppercase mb-6"
              >
                <BookOpen size={14} />
                Escola Bíblica Dominical
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-serif italic text-church-blue"
              >
                {selectedLessonId && selectedLessonId !== lessons[0]?.id ? 'Lição Anterior' : 'Lição da Semana'}
              </motion.h1>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentLesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row gap-12 md:gap-20 items-start"
              >
                {/* Author Info */}
                <div className="md:w-1/3 w-full shrink-0">
                  <div className="sticky top-32 space-y-6">
                    <div>
                      <h3 className="text-3xl font-serif italic text-church-blue mb-2">{currentLesson.lessonTitle}</h3>
                      <p className="text-church-vibrant font-bold text-sm uppercase tracking-wider mb-1">{currentLesson.quarterNumber}</p>
                      <p className="text-church-muted text-sm">{currentLesson.lessonNumber} • {currentLesson.magazineTitle}</p>
                    </div>

                    <div className="pt-6 border-t border-church-blue/10 flex items-center gap-4">
                      {currentLesson.authorPhotoUrl ? (
                        <img src={currentLesson.authorPhotoUrl} alt={currentLesson.authorName} className="w-16 h-16 rounded-full object-cover shadow-md" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-church-blue/5 flex items-center justify-center text-church-blue/40">
                          <Users size={24} />
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-church-muted mb-1">Responsável</p>
                        <p className="font-bold text-church-blue">{currentLesson.authorName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="md:w-2/3 w-full">
                  <div className="prose prose-lg prose-church max-w-none">
                    <Quote size={40} className="text-church-vibrant/20 mb-6" />
                    <div className="text-church-blue/80 font-light leading-relaxed whitespace-pre-wrap">
                      {currentLesson.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      ) : (
        <section className="relative pt-8 pb-16 bg-white border-b border-church-blue/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-church-vibrant/30 text-church-vibrant text-[10px] font-bold tracking-[0.3em] uppercase mb-6"
              >
                <BookOpen size={14} />
                Escola Bíblica Dominical
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-serif italic text-church-blue"
              >
                Lição da Semana
              </motion.h1>
            </div>
            <div className="text-center py-12 bg-pearl/50 rounded-[3rem] border border-church-blue/5">
              <BookOpen size={48} strokeWidth={1} className="mx-auto text-church-blue/20 mb-6" />
              <h3 className="text-2xl font-serif italic text-church-blue mb-2">Nenhuma lição disponível</h3>
              <p className="text-church-muted font-light">A lição desta semana ainda não foi publicada. Volte em breve!</p>
            </div>
          </div>
        </section>
      )}

      {/* Past Lessons Section */}
      {pastLessons.length > 0 && (
        <section className="py-12 bg-pearl relative border-b border-church-blue/5">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <h3 className="text-2xl font-serif italic text-church-blue mb-6 flex items-center gap-3">
              <BookOpen size={24} className="text-church-vibrant" />
              Lições Anteriores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastLessons.map((lesson: any) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-church-blue/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group flex flex-col h-full"
                >
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-church-vibrant mb-2">{lesson.quarterNumber} • {lesson.lessonNumber}</p>
                    <h4 className="text-lg font-serif italic text-church-blue mb-2 group-hover:text-church-vibrant transition-colors">{lesson.lessonTitle}</h4>
                    <p className="text-church-muted text-sm line-clamp-2">{lesson.magazineTitle}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-church-blue/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {lesson.authorPhotoUrl ? (
                        <img src={lesson.authorPhotoUrl} alt={lesson.authorName} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-church-blue/5 flex items-center justify-center text-church-blue/40">
                          <Users size={12} />
                        </div>
                      )}
                      <span className="text-xs text-church-muted font-medium">{lesson.authorName}</span>
                    </div>
                    <ChevronRight size={16} className="text-church-vibrant opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Classes Section */}
      <section className="section-padding bg-pearl relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-6xl font-serif italic text-church-blue mb-6">
              Classes para <span className="text-church-vibrant">Todas as Idades</span>
            </h2>
            <p className="text-church-muted text-lg leading-relaxed">
              Nossas classes são divididas por faixa etária para garantir que o ensino 
              seja adequado, relevante e transformador para cada fase da vida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ebdClasses.map((cls: any, index: number) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden min-h-[360px] flex flex-col justify-end border border-church-blue/5"
              >
                {/* Background Image & Overlay */}
                {cls.imageUrl ? (
                  <>
                    <img 
                      src={cls.imageUrl} 
                      alt={cls.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-church-blue/95 via-church-blue/70 to-church-blue/10"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-church-blue overflow-hidden">
                    <Users size={160} className="absolute -right-8 -bottom-8 text-white/5 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12" />
                    <div className="absolute inset-0 bg-gradient-to-t from-church-blue via-church-blue/80 to-transparent"></div>
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif italic text-white mb-2">{cls.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-church-vibrant mb-4">{cls.teacher}</p>
                  <p className="text-white/80 leading-relaxed text-sm mb-6 line-clamp-3">
                    {cls.description}
                  </p>
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-2 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-church-vibrant/80" />
                      {cls.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-church-vibrant/80" />
                      {cls.schedule}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {ebdClasses.length === 0 && !loadingClasses && (
              <div className="col-span-full py-12 text-center text-church-muted font-light">
                Nenhuma classe cadastrada no momento.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News Section */}
      {news.length > 0 && (
        <section className="py-12 bg-white border-t border-church-blue/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h3 className="text-2xl font-serif italic text-church-blue mb-8 flex items-center gap-3">
              <Newspaper size={24} className="text-church-vibrant" />
              Notícias da EBD
            </h3>
            <div className="relative h-[450px] w-full overflow-hidden flex flex-col items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                <AnimatePresence initial={false}>
                  {news.map((item: any, idx: number) => {
                    let position = idx - currentNewsIndex;
                    const total = news.length;
                    if (position > total / 2) position -= total;
                    if (position < -total / 2) position += total;
                    if (Math.abs(position) > 1) return null;

                    return (
                      <motion.div
                        key={item.id}
                        initial={false}
                        animate={{
                          x: position * 480,
                          scale: position === 0 ? 1 : 0.8,
                          opacity: position === 0 ? 1 : 0.3,
                          zIndex: position === 0 ? 20 : 10,
                          rotateY: position * -15,
                          filter: position === 0 ? 'blur(0px)' : 'blur(4px)',
                        }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute w-full max-w-[500px] cursor-pointer"
                        onClick={() => {
                          if (position !== 0) setCurrentNewsIndex(idx);
                        }}
                      >
                        <Link 
                          to={`/noticias/${item.id}`} 
                          className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] bg-pearl border border-white/10 block"
                          onClick={(e) => {
                            if (position !== 0) e.preventDefault();
                          }}
                        >
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-church-blue via-church-blue/20 to-transparent opacity-80"></div>
                          
                          <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <span className="text-church-vibrant text-[9px] font-bold tracking-[0.3em] uppercase mb-3 block">
                              {item.date}
                            </span>
                            <h3 className="text-2xl text-white font-serif italic leading-tight mb-4">
                              {item.title}
                            </h3>
                            
                            {position === 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                              >
                                <p className="text-pearl/70 text-sm font-light italic line-clamp-2">
                                  {item.description}
                                </p>
                                <div className="w-full h-12 rounded-2xl bg-church-vibrant text-church-blue font-bold text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-white transition-all duration-500">
                                  Ler Notícia
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {news.length > 1 && (
                <div className="flex items-center gap-8 mt-4">
                  <button 
                    onClick={() => setCurrentNewsIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1))}
                    className="w-14 h-14 rounded-full border border-church-blue/10 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all group/btn"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} className="group-hover/btn:-translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex gap-2">
                    {news.map((_: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setCurrentNewsIndex(i)}
                        className={`h-1 rounded-full transition-all duration-500 ${i === currentNewsIndex ? 'w-10 bg-church-vibrant' : 'w-2 bg-church-blue/10'}`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentNewsIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1))}
                    className="w-14 h-14 rounded-full border border-church-blue/10 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all group/btn"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-church-blue text-pearl p-12 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-church-vibrant/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <BookOpen size={48} className="mx-auto text-church-vibrant mb-8 opacity-80" />
            <h2 className="text-3xl md:text-5xl font-serif italic mb-6">
              Participe da EBD neste Domingo!
            </h2>
            <p className="text-pearl/70 text-lg mb-10 max-w-2xl mx-auto">
              Não importa se você é um novo convertido ou se já estuda a Bíblia há anos, 
              sempre há mais para aprender sobre Deus. Estamos esperando por você.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contato" className="btn-primary bg-church-vibrant text-white border-none w-full sm:w-auto">
                Fale Conosco
              </Link>
              <Link to="/cultos" className="btn-minimal text-pearl border-pearl/20 w-full sm:w-auto">
                Ver Horários <ArrowRight size={16} className="inline ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
