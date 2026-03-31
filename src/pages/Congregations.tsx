import React from 'react';
import { MapPin, Phone, User } from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';

export default function Congregations() {
  const { data: congregations, loading } = useFirestoreCollection<any>('congregations', orderBy('order', 'asc'));

  return (
    <section id="congregacoes" className="section-padding bg-pearl flex-1 relative overflow-hidden">
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
            <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Expansão</span>
            <h2 className="text-4xl md:text-7xl text-church-blue leading-tight font-serif italic">Nossas Congregações</h2>
            <p className="text-church-muted font-light mt-4 text-lg max-w-xl mx-auto">
              Estamos presentes em diversos bairros, levando a Palavra de Deus mais perto de você.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {congregations.length === 0 ? (
              <div className="col-span-full text-center text-church-muted py-12 font-light italic">
                Nenhuma congregação cadastrada no momento.
              </div>
            ) : (
              congregations.map((cong: any, idx: number) => (
                <motion.div 
                  key={cong.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="bg-white rounded-[3rem] shadow-xl border border-church-vibrant/5 overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="h-64 w-full relative overflow-hidden">
                    {cong.imageUrl ? (
                      <img 
                        src={cong.imageUrl} 
                        alt={cong.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-church-blue/10 flex items-center justify-center">
                        <MapPin size={48} className="text-church-vibrant/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-church-blue/60 to-transparent"></div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl text-church-blue mb-8 font-serif italic">{cong.name}</h3>
                    <ul className="space-y-6">
                      <li className="flex items-start gap-4 text-church-muted">
                        <div className="w-10 h-10 bg-church-blue/5 rounded-xl flex items-center justify-center text-church-vibrant shrink-0">
                          <User size={20} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-vibrant mb-1">Dirigente</p>
                          <p className="text-lg text-church-blue font-light">{cong.pastor}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 text-church-muted">
                        <div className="w-10 h-10 bg-church-blue/5 rounded-xl flex items-center justify-center text-church-vibrant shrink-0">
                          <MapPin size={20} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-vibrant mb-1">Endereço</p>
                          <p className="text-lg text-church-blue font-light leading-relaxed">{cong.address}</p>
                        </div>
                      </li>
                      {cong.phone && (
                        <li className="flex items-start gap-4 text-church-muted">
                          <div className="w-10 h-10 bg-church-blue/5 rounded-xl flex items-center justify-center text-church-vibrant shrink-0">
                            <Phone size={20} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-vibrant mb-1">Contato</p>
                            <p className="text-lg text-church-blue font-light">{cong.phone}</p>
                          </div>
                        </li>
                      )}
                    </ul>
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
