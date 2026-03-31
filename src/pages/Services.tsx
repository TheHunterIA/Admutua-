import { Clock, Calendar, Youtube } from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';

export default function Services() {
  const { data: services, loading } = useFirestoreCollection<any>('services', orderBy('order', 'asc'));

  return (
    <section id="cultos" className="section-padding bg-pearl flex-1 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-church-vibrant/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Comunhão</span>
            <h2 className="text-4xl md:text-7xl text-church-blue leading-tight font-serif italic">Horários de Culto</h2>
            <p className="text-church-muted font-light mt-6 text-lg max-w-xl mx-auto">
              Junte-se a nós em nossos encontros semanais de adoração e aprendizado da Palavra.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {services.length === 0 ? (
              <div className="col-span-2 text-center text-church-muted py-20 font-light italic">
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
                  className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-church-vibrant/5 flex flex-col items-start gap-8 hover:shadow-2xl transition-all duration-500 group relative"
                >
                  {service.isLiveStream && (
                    <div className="absolute top-8 right-8 text-red-600">
                      <Youtube size={32} />
                    </div>
                  )}
                  <div className="w-16 h-16 bg-church-blue/5 rounded-2xl flex items-center justify-center text-church-vibrant group-hover:bg-church-vibrant group-hover:text-pearl transition-colors duration-500">
                    <Calendar size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl text-church-blue font-serif italic">{service.name}</h3>
                    <div className="flex items-center gap-3 text-church-vibrant font-medium tracking-wide">
                      <Clock size={18} strokeWidth={2} />
                      <span className="text-lg">{service.day} às {service.time}</span>
                    </div>
                    {service.description && (
                      <p className="text-church-muted font-light leading-relaxed">
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
  );
}
