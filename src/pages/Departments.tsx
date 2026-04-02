import React from 'react';
import { User, Info, Users } from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';

export default function Departments() {
  const { data: departments, loading } = useFirestoreCollection<any>('departments', orderBy('order', 'asc'));

  return (
    <section id="departamentos" className="section-padding bg-pearl flex-1 relative overflow-hidden">
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
            <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Ministérios</span>
            <h2 className="text-4xl md:text-7xl text-church-blue leading-tight font-serif italic">Nossos Departamentos</h2>
            <p className="text-church-muted font-light mt-4 text-lg max-w-xl mx-auto">
              Conheça os grupos que fazem parte da nossa comunidade e descubra onde você pode servir.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.length === 0 ? (
              <div className="col-span-full text-center text-church-muted py-12 font-light italic">
                Nenhum departamento cadastrado no momento.
              </div>
            ) : (
              departments.map((dept: any, idx: number) => (
                <motion.div 
                  key={dept.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.05 }}
                  className="bg-white rounded-[2rem] shadow-lg border border-church-vibrant/5 overflow-hidden hover:shadow-xl hover:shadow-church-blue/10 hover:-translate-y-1 transition-all duration-500 group flex flex-col"
                >
                  <div className="h-40 w-full relative overflow-hidden">
                    {dept.imageUrl ? (
                      <img 
                        src={dept.imageUrl} 
                        alt={dept.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-church-blue/10 flex items-center justify-center">
                        <Users size={32} className="text-church-vibrant/30 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-church-blue/60 to-transparent group-hover:opacity-80 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col relative">
                    <div className="flex items-center gap-2 mb-4 transform group-hover:translate-x-1 transition-transform duration-300">
                      <div className="w-6 h-6 bg-church-blue/5 rounded-md flex items-center justify-center text-church-vibrant group-hover:bg-church-vibrant group-hover:text-pearl group-hover:rotate-12 transition-all duration-500">
                        <Users size={12} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-base text-church-blue font-serif italic leading-tight group-hover:text-church-vibrant transition-colors duration-300">{dept.name}</h3>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <div className="flex items-start gap-3 text-church-muted transform group-hover:translate-x-1 transition-transform duration-300 delay-75">
                        <User size={14} className="text-church-vibrant shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        <div>
                          <p className="text-[8px] font-semibold tracking-[0.2em] uppercase text-church-vibrant mb-0.5">Liderança</p>
                          <p className="text-xs text-church-blue font-light group-hover:text-church-vibrant transition-colors duration-300">{dept.pastor || 'Não informado'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-church-muted transform group-hover:translate-x-1 transition-transform duration-300 delay-150">
                        <Info size={14} className="text-church-vibrant shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        <p className="text-xs text-church-text/80 font-light leading-relaxed line-clamp-3">{dept.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
