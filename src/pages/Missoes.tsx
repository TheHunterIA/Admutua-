import React, { useState, useEffect } from 'react';
import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestore';
import { orderBy, where } from 'firebase/firestore';
import { Mail, MapPin, Newspaper, Heart, CreditCard, Copy, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Missoes() {
  const { data: missionaries } = useFirestoreCollection<any>('missionaries', orderBy('name', 'asc'));
  const { data: news } = useFirestoreCollection<any>('updates', where('subject', '==', 'Missoes'), orderBy('createdAt', 'desc'));
  const { data: contactConfig } = useFirestoreDoc<any>('config', 'contact');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here if available
  };

  return (
    <div className="bg-pearl min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Background Decorative Flags */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] overflow-hidden">
        <div className="absolute top-20 left-10 transform -rotate-12">
          <img src="https://flagcdn.com/w160/br.png" alt="" className="w-32" />
        </div>
        <div className="absolute bottom-40 left-20 transform rotate-6">
          <img src="https://flagcdn.com/w160/il.png" alt="" className="w-36" />
        </div>
        <div className="absolute bottom-20 right-40 transform -rotate-6">
          <img src="https://flagcdn.com/w160/pt.png" alt="" className="w-28" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-45">
          <img src="https://flagcdn.com/w160/ao.png" alt="" className="w-64" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 text-center">
          <div className="flex justify-center gap-4 mb-8 overflow-hidden py-4">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {['br', 'us', 'il', 'pt', 'ao', 'mz', 'py', 'ar', 'es', 'it', 'fr', 'jp'].map(code => (
                <img 
                  key={code} 
                  src={`https://flagcdn.com/w80/${code}.png`} 
                  alt="" 
                  className="h-6 md:h-8 rounded-sm shadow-sm transition-all duration-500 cursor-default" 
                />
              ))}
              {/* Duplicate for seamless loop */}
              {['br', 'us', 'il', 'pt', 'ao', 'mz', 'py', 'ar', 'es', 'it', 'fr', 'jp'].map(code => (
                <img 
                  key={`${code}-2`} 
                  src={`https://flagcdn.com/w80/${code}.png`} 
                  alt="" 
                  className="h-6 md:h-8 rounded-sm shadow-sm transition-all duration-500 cursor-default" 
                />
              ))}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic mb-6">Nossos Missionários</h1>
          <p className="text-church-muted max-w-2xl mx-auto">
            Conheça aqueles que estão na linha de frente, levando a palavra de Deus a diferentes lugares. Acompanhe e ore por nossos missionários.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20">
          {missionaries.map((m: any, idx: number) => (
            <motion.div 
              key={m.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="bg-white rounded-[1.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:shadow-church-blue/10 transition-all duration-700 flex flex-col relative group/card border border-church-blue/5 overflow-visible"
            >
              {/* Flag "Stamp" - Centered and clean */}
              {m.countryCode && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 transform -rotate-2 group-hover/card:rotate-0 transition-all duration-700 group-hover/card:scale-110">
                  <div className="relative p-1 bg-white rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-church-blue/5 ring-2 ring-pearl">
                    <div className="relative overflow-hidden rounded-sm">
                      <img 
                        src={`https://flagcdn.com/w160/${m.countryCode.toLowerCase()}.png`} 
                        alt="" 
                        className="h-8 w-auto block" 
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Image Section with Editorial Frame */}
              <div className="p-4 pb-0">
                <div 
                  className="relative aspect-square rounded-xl overflow-hidden shadow-xl border-4 border-pearl group-hover/card:border-white transition-all duration-500 cursor-zoom-in"
                  onClick={() => setSelectedImage(m.imageUrl || '/placeholder-avatar.png')}
                >
                  <img src={m.imageUrl || '/placeholder-avatar.png'} alt={m.name} className="w-full h-full object-cover group-hover/card:scale-110 group-hover/card:rotate-1 transition-transform duration-1000" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-church-blue/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6 pt-4 flex flex-col flex-1 text-center">
                <h3 className="text-xl text-church-blue font-serif italic mb-1 group-hover/card:text-church-vibrant transition-colors duration-500 transform group-hover/card:-translate-y-1">{m.name}</h3>
                
                <div className="flex items-center justify-center gap-2 mb-4 transform group-hover/card:-translate-y-1 transition-transform duration-500 delay-75">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-church-vibrant/20"></div>
                  <p className="text-church-vibrant text-[8px] font-bold uppercase tracking-[0.3em] whitespace-nowrap">{m.field}</p>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-church-vibrant/20"></div>
                </div>
                
                <div className="relative mb-6 flex-1 transform group-hover/card:-translate-y-1 transition-transform duration-500 delay-100">
                  <p className="text-church-muted text-xs font-light leading-relaxed italic font-serif relative z-10 px-2 group-hover/card:text-church-blue/80 transition-colors duration-300 line-clamp-3">
                    "{m.bio}"
                  </p>
                  {/* Decorative quote mark */}
                  <span className="absolute top-0 left-0 text-4xl text-church-blue/5 font-serif -translate-x-1 -translate-y-2 select-none group-hover/card:text-church-vibrant/10 transition-colors duration-500">“</span>
                </div>
                
                {/* Contact Rail - Professional Grid */}
                <div className="grid grid-cols-1 gap-2 pt-4 border-t border-church-blue/5 transform group-hover/card:-translate-y-1 transition-transform duration-500 delay-150">
                  {m.email && (
                    <div className="flex items-center justify-center gap-2 text-[10px] text-church-muted group/link cursor-pointer hover:text-church-blue transition-colors">
                      <div className="w-5 h-5 rounded-full bg-pearl flex items-center justify-center group-hover/link:bg-church-vibrant group-hover/link:text-white transition-colors duration-300">
                        <Mail size={10} className="text-church-vibrant group-hover/link:text-white transition-colors duration-300" />
                      </div>
                      <span className="font-light tracking-wide group-hover/link:text-church-vibrant transition-colors duration-300 truncate max-w-[150px]">{m.email}</span>
                    </div>
                  )}
                  {m.location && (
                    <div className="flex items-center justify-center gap-2 text-[10px] text-church-muted group/link cursor-pointer hover:text-church-blue transition-colors">
                      <div className="w-5 h-5 rounded-full bg-pearl flex items-center justify-center group-hover/link:bg-church-vibrant group-hover/link:text-white transition-colors duration-300">
                        <MapPin size={10} className="text-church-vibrant group-hover/link:text-white transition-colors duration-300" />
                      </div>
                      <span className="font-light tracking-wide group-hover/link:text-church-vibrant transition-colors duration-300">{m.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bottom Decorative Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-church-blue via-church-vibrant to-church-blue rounded-b-[1.5rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
            </motion.div>
          ))}
          {missionaries.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-church-blue/5 text-church-muted font-light italic">
              Nenhum missionário cadastrado no momento.
            </div>
          )}
        </div>

        {news.length > 0 && (
          <section className="py-12 bg-white rounded-[3rem] shadow-sm border border-church-blue/5 mb-12">
            <div className="max-w-7xl mx-auto px-8">
              <h3 className="text-2xl font-serif italic text-church-blue mb-8 flex items-center gap-3">
                <Newspaper size={24} className="text-church-vibrant" />
                Notícias de Missões
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
                            className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] bg-pearl border border-white/10 block hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-shadow duration-500"
                            onClick={(e) => {
                              if (position !== 0) e.preventDefault();
                            }}
                          >
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-church-blue via-church-blue/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                              <span className="text-church-vibrant text-[9px] font-bold tracking-[0.3em] uppercase mb-3 block transform group-hover:-translate-y-1 transition-transform duration-300">
                                {item.date}
                              </span>
                              <h3 className="text-2xl text-white font-serif italic leading-tight mb-4 transform group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                                {item.title}
                              </h3>
                              
                              {position === 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="space-y-6 transform group-hover:-translate-y-1 transition-transform duration-300 delay-100"
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

        {/* Contribuições Section - More Compact */}
        <section className="mb-20 relative overflow-hidden bg-church-blue rounded-[3rem] p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-church-vibrant/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-church-vibrant/10 rounded-full text-church-vibrant text-[9px] font-bold uppercase tracking-[0.2em] mb-4">
                <Heart size={10} />
                Faça a Diferença
              </div>
              <h2 className="text-3xl md:text-4xl text-pearl font-serif italic mb-4">Contribua com Missões</h2>
              <p className="text-pearl/60 text-sm font-light leading-relaxed max-w-lg">
                Sua contribuição ajuda a manter nossos missionários no campo e a expandir o Reino de Deus. Cada oferta é uma semente de esperança.
              </p>
            </div>

            <div className="w-full lg:w-[400px] bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-church-vibrant text-church-blue rounded-xl flex items-center justify-center shadow-lg shadow-church-vibrant/20">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h4 className="text-pearl font-serif italic text-lg">Dados Bancários</h4>
                  <p className="text-pearl/40 text-[9px] uppercase tracking-widest font-bold">Ofertas e Dízimos</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                  <p className="text-[9px] uppercase tracking-widest text-church-vibrant font-bold mb-1">Chave PIX (CNPJ)</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-pearl font-mono text-xs tracking-wider">30.123.456/0001-00</span>
                    <button 
                      onClick={() => copyToClipboard('30.123.456/0001-00')}
                      className="p-1.5 text-pearl/40 hover:text-church-vibrant transition-colors"
                      title="Copiar PIX"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-church-vibrant font-bold mb-1">Conta Bancária</p>
                  <div className="space-y-0.5 text-pearl/80 text-xs font-light">
                    <p>Bradesco (237) | Ag: 1234-5 | CC: 98765-4</p>
                    <p className="text-[10px] text-pearl/40 italic">Assembleia de Deus em Mutuá</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-church-blue/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-pearl/60 hover:text-pearl transition-colors p-2 bg-white/10 rounded-full backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          <div className="relative max-w-5xl w-full aspect-square md:aspect-auto md:h-[80vh] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 animate-in zoom-in-95 duration-500">
            <img 
              src={selectedImage} 
              alt="Enlarged view" 
              className="w-full h-full object-contain bg-black/20"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
