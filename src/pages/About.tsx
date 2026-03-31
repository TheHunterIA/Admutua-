import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="sobre" className="section-padding bg-pearl flex-1 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-church-blue/[0.02] -skew-x-12 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-church-blue/[0.03] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-6 block">Nossa História</span>
            <h2 className="text-4xl md:text-7xl text-church-blue mb-10 leading-[0.9] font-serif italic">
              Nossa Casa, <br />Sua Família
            </h2>
            <div className="w-20 h-px bg-church-blue/20 mb-10"></div>
            <div className="space-y-8 text-lg text-church-text/80 font-light leading-relaxed">
              <p>
                A Assembleia de Deus Mutuá é uma comunidade cristã firmada na Palavra de Deus. 
                Nosso propósito é adorar ao Senhor, pregar o Evangelho e cuidar das pessoas, 
                proporcionando um ambiente de crescimento espiritual e acolhimento para todas as idades.
              </p>
              <p>
                Com décadas de história no coração de Mutuá, temos sido um farol de esperança e fé, 
                dedicados a transformar vidas através do amor de Cristo e do serviço à nossa comunidade.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border border-church-blue/5">
              <img 
                src="https://picsum.photos/seed/church-interior/800/1000" 
                alt="Interior da Igreja" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-church-blue/10 mix-blend-multiply"></div>
            </div>
            
            {/* Floating accent element */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-church-blue rounded-[2rem] z-20 flex items-center justify-center p-8 shadow-2xl shadow-church-blue/30 border border-white/5">
              <p className="text-pearl text-center font-serif italic text-xl leading-tight">
                "Até aqui nos ajudou o Senhor"
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
