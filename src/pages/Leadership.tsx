import React from 'react';
import { useFirestoreDoc } from '../hooks/useFirestore';
import { motion } from 'motion/react';

export default function Leadership() {
  const { data: leadership, loading } = useFirestoreDoc<any>('config', 'leadership');

  if (loading) return (
    <div className="py-40 text-center bg-pearl flex-1">
      <div className="w-12 h-12 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  );

  const name = leadership?.name || "Pr. Adilson Faria Soares";
  const role = leadership?.role || "Pastor Presidente";
  const message = leadership?.message || "Nossa missão é pastorear com amor, guiando cada ovelha ao conhecimento profundo de Cristo. Acreditamos que a igreja é um hospital para a alma e uma escola para o espírito. Você e sua família são nossos convidados de honra para adorar a Deus conosco.";
  const imageUrl = leadership?.imageUrl || "https://picsum.photos/seed/pastor/800/1000";

  return (
    <section id="lideranca" className="section-padding bg-pearl flex-1 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-church-vibrant/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-white rounded-[4rem] shadow-xl border border-church-vibrant/5 overflow-hidden flex flex-col lg:flex-row hover:shadow-2xl hover:shadow-church-blue/10 transition-shadow duration-500"
        >
          <div className="lg:w-2/5 h-[500px] lg:h-auto relative group overflow-hidden">
            <img 
              src={imageUrl} 
              alt={name} 
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-church-blue/40 to-transparent group-hover:opacity-80 transition-opacity duration-500"></div>
          </div>
          <div className="lg:w-3/5 p-12 md:p-16 flex flex-col justify-center relative group/content">
            {/* Decorative quote mark */}
            <div className="absolute top-10 right-10 text-church-vibrant/10 text-9xl font-serif select-none group-hover/content:text-church-vibrant/20 transition-colors duration-500">"</div>
            
            <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block transform group-hover/content:-translate-y-1 transition-transform duration-300">{role}</span>
            <h3 className="text-4xl md:text-6xl text-church-blue mb-6 font-serif italic leading-tight transform group-hover/content:-translate-y-1 transition-transform duration-300 delay-75">{name}</h3>
            <div className="w-20 h-px bg-church-vibrant mb-6 transform group-hover/content:scale-x-150 origin-left transition-transform duration-500 delay-100"></div>
            <p className="text-xl text-church-text/80 leading-relaxed mb-6 font-light italic transform group-hover/content:-translate-y-1 transition-transform duration-300 delay-150">
              "{message}"
            </p>
            <div className="flex items-center gap-4 transform group-hover/content:-translate-y-1 transition-transform duration-300 delay-200">
              <div className="w-12 h-px bg-church-blue/20 group-hover/content:bg-church-vibrant transition-colors duration-500"></div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-church-muted group-hover/content:text-church-blue transition-colors duration-500">Mensagem Pastoral</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
