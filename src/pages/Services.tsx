import React, { useState } from 'react';
import { Clock, Calendar, Play } from 'lucide-react';
import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';

const extractYoutubeId = (urlOrId: string) => {
  if (!urlOrId) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/|shorts\/)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId;
};

export default function Services() {
  const { data: services, loading } = useFirestoreCollection<any>('services', orderBy('order', 'asc'));
  const { data: siteConfig } = useFirestoreDoc<any>('config', 'site');

  const rawLiveVideoId = siteConfig?.liveVideoId || "";
  const liveVideoId = extractYoutubeId(rawLiveVideoId);
  const hasLiveStream = Boolean(liveVideoId && liveVideoId.length === 11);

  return (
    <div className="flex flex-col bg-pearl min-h-screen">
      <section id="cultos" className="section-padding bg-pearl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-church-vibrant/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Comunhão</span>
              <h2 className="text-4xl md:text-7xl text-church-blue leading-tight font-serif italic">Horários de Culto</h2>
              <p className="text-church-muted font-light mt-4 text-lg max-w-xl mx-auto">
                Junte-se a nós em nossos encontros semanais de adoração e aprendizado da Palavra.
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {services.length === 0 ? (
                <div className="col-span-full text-center text-church-muted py-12 font-light italic">
                  Nenhum horário cadastrado no momento.
                </div>
              ) : (
                services.map((service: any, idx: number) => (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-[2rem] shadow-lg border border-church-vibrant/5 flex flex-col items-start gap-4 hover:shadow-xl hover:shadow-church-blue/10 hover:-translate-y-1 transition-all duration-500 group h-full relative min-h-[180px]"
                  >
                    {service.isLiveStream && (
                      <div className="absolute top-6 right-6 transform group-hover:scale-110 transition-transform duration-300">
                        <img src="/botao-de-reproducao-do-youtube-com-renderizacao-3d.png" alt="YouTube Live" className="w-8 h-8 object-contain" title="Com transmissão ao vivo" />
                      </div>
                    )}
                    <div className="space-y-4 w-full pr-8">
                      <h3 className="text-xl text-church-blue font-serif italic group-hover:text-church-vibrant transition-colors duration-300">{service.name}</h3>
                      
                      <div className="flex items-center gap-3 text-church-vibrant font-medium tracking-wide">
                        <div className="w-10 h-10 bg-church-blue/5 rounded-xl flex items-center justify-center text-church-vibrant group-hover:bg-church-vibrant group-hover:text-pearl group-hover:rotate-6 transition-all duration-500 shrink-0">
                          <Calendar size={20} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col gap-0.5 transform group-hover:translate-x-1 transition-transform duration-300">
                          <span className="text-base leading-none group-hover:text-church-blue transition-colors duration-300">{service.day}</span>
                          <span className="text-xs opacity-80 flex items-center gap-1 leading-none group-hover:text-church-blue/80 transition-colors duration-300"><Clock size={12} className="group-hover:animate-pulse" /> às {service.time}</span>
                        </div>
                      </div>

                      {service.description && (
                        <p className="text-xs text-church-muted font-light leading-relaxed transform group-hover:translate-x-1 transition-transform duration-300 delay-75 line-clamp-3">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Live Stream Section */}
      {hasLiveStream && (
        <section className="section-padding bg-church-dark relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-church-purple/20 via-transparent to-church-dark/90"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Ao Vivo</span>
                  <h2 className="text-4xl md:text-6xl text-pearl leading-tight font-serif italic mb-6">Assista Nossos Cultos Online</h2>
                  <p className="text-pearl/70 font-light text-lg leading-relaxed mb-8">
                    Não pode estar presente fisicamente? Acompanhe nossas transmissões ao vivo e seja edificado onde quer que você esteja.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-pearl text-sm font-bold uppercase tracking-widest">Transmissão Disponível</span>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 w-full relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/30 to-church-purple/30 blur-3xl rounded-[4rem] opacity-50 animate-pulse"></div>
                
                <div className="relative p-2 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                  <div className="aspect-video bg-[#0a0a0a] rounded-[2rem] overflow-hidden relative group">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube-nocookie.com/embed/${liveVideoId}?autoplay=0&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
                      title="Transmissão ao Vivo - AD Mutuá"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
