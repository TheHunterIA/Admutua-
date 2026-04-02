import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';

export default function About() {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const { data: historicalMoments, loading: historyLoading } = useFirestoreCollection<any>('history', orderBy('order', 'asc'));
  const { data: aboutConfig, loading: aboutLoading } = useFirestoreDoc<any>('config', 'about');

  const defaultAbout = {
    titleLine1: "Nossa Casa,",
    titleLine2: "Sua Família",
    text: "A Assembleia de Deus Mutuá é uma comunidade cristã firmada na Palavra de Deus. Nosso propósito é adorar ao Senhor, pregar o Evangelho e cuidar das pessoas, proporcionando um ambiente de crescimento espiritual e acolhimento para todas as idades.\n\nCom décadas de história no coração de Mutuá, temos sido um farol de esperança e fé, dedicados a transformar vidas através do amor de Cristo e do serviço à nossa comunidade.",
    imageUrl: "https://picsum.photos/seed/church-interior/800/1000",
    quote: "\"Até aqui nos ajudou o Senhor\""
  };

  const aboutData = aboutConfig || defaultAbout;

  return (
    <div className="flex-1 bg-pearl">
      <section id="sobre" className="section-padding relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-church-blue/[0.02] -skew-x-12 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-church-blue/[0.03] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-6 block">Nossa História</span>
              <h2 className="text-4xl md:text-7xl text-church-blue mb-6 leading-[0.9] font-serif italic">
                {aboutData.titleLine1} <br />{aboutData.titleLine2}
              </h2>
              <div className="w-20 h-px bg-church-blue/20 mb-6"></div>
              <div className="space-y-8 text-lg text-church-text/80 font-light leading-relaxed whitespace-pre-wrap">
                {aboutData.text}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border border-church-blue/5 group">
                <img 
                  src={aboutData.imageUrl} 
                  alt="Interior da Igreja" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-church-blue/10 mix-blend-multiply group-hover:bg-church-blue/5 transition-colors duration-500"></div>
              </div>
              
              {/* Floating accent element */}
              {aboutData.quote && (
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -left-10 w-48 h-48 bg-church-blue rounded-[2rem] z-20 flex items-center justify-center p-8 shadow-2xl shadow-church-blue/30 border border-white/5"
                >
                  <p className="text-pearl text-center font-serif italic text-xl leading-tight">
                    {aboutData.quote}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Historical Gallery Section */}
      <section className="section-padding bg-white relative">
        <div className="max-w-[1440px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Nossa Trajetória</span>
            <h2 className="text-4xl md:text-5xl text-church-blue font-serif italic mb-6">Momentos Históricos</h2>
            <div className="w-24 h-px bg-church-blue/20 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-church-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : historicalMoments.map((moment, index) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-church-blue/20 transition-all duration-500"
                onClick={() => setSelectedImage(moment)}
              >
                <img 
                  src={moment.imageUrl} 
                  alt={moment.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-church-blue/95 via-church-blue/50 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90"></div>
                
                {/* Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100 z-10">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-2xl">
                    <ZoomIn className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500 z-20">
                  <div className="flex items-center gap-2 text-church-vibrant mb-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wider">{moment.date}</span>
                  </div>
                  <h3 className="text-2xl text-white font-serif italic mb-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75 ease-out">
                    {moment.title}
                  </h3>
                  <div className="w-0 group-hover:w-12 h-px bg-church-vibrant transition-all duration-500 delay-100 mb-3"></div>
                  <p className="text-white/80 text-sm line-clamp-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150 ease-out">
                    {moment.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-church-blue/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
              <button 
                className="absolute top-6 right-6 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl overflow-hidden max-w-6xl w-full max-h-[90vh] shadow-2xl flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              <div className="md:w-3/5 lg:w-2/3 aspect-video md:aspect-auto relative min-h-[300px] md:min-h-[600px] group">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.title}
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:w-2/5 lg:w-1/3 p-8 md:p-12 flex flex-col justify-center bg-pearl overflow-y-auto">
                <div className="inline-flex items-center gap-2 text-church-vibrant mb-4 px-3 py-1 bg-church-vibrant/10 rounded-full w-fit">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium tracking-wider">{selectedImage.date}</span>
                </div>
                <h3 className="text-3xl text-church-blue font-serif italic mb-6">
                  {selectedImage.title}
                </h3>
                <div className="w-12 h-px bg-church-blue/20 mb-6"></div>
                <p className="text-church-text/80 leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
