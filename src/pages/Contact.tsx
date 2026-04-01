import React, { useState } from 'react';
import { MapPin, Phone, Send, CheckCircle, Mail } from 'lucide-react';
import { useFirestoreDoc, firestoreService } from '../hooks/useFirestore';
import { serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: contactConfig, loading } = useFirestoreDoc<any>('config', 'contact');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      createdAt: serverTimestamp()
    };

    try {
      await firestoreService.add('contactSubmissions', data);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      setError('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const address = contactConfig?.address || "R. Dr. Cumplido de Santana, 42, Mutua, São Gonçalo - RJ";
  const phone = contactConfig?.phone || "(21) 2713-5394";
  const email = contactConfig?.email || "contato@admutua.com.br";

  return (
    <section id="contato" className="section-padding bg-pearl flex-1 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-church-blue/20 to-transparent"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-church-blue/[0.03] rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Conecte-se</span>
            <h2 className="text-4xl md:text-7xl text-church-blue leading-tight font-serif italic">Fale Conosco</h2>
            <p className="text-church-muted font-light mt-4 text-lg max-w-xl mx-auto">
              Estamos aqui para ouvir, orar e caminhar ao seu lado.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulário de Contato */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-church-blue/5"
          >
            <h3 className="text-2xl text-church-blue mb-8 font-serif italic">Envie sua Mensagem</h3>
            
            {submitted ? (
              <div className="bg-church-blue/5 border border-church-blue/10 p-12 rounded-[2.5rem] text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle className="w-20 h-20 text-church-vibrant mx-auto mb-6" strokeWidth={1} />
                <h4 className="text-2xl text-church-blue mb-4 font-serif italic">Mensagem Enviada!</h4>
                <p className="text-church-muted font-light leading-relaxed">Recebemos seu contato. Em breve nossa equipe entrará em contato com você.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-church-blue font-bold uppercase tracking-widest text-[10px] hover:text-church-vibrant transition-colors"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-700 text-sm font-medium">
                    {error}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted ml-2">Nome Completo</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      required
                      className="w-full px-6 py-4 rounded-2xl border border-church-blue/10 bg-pearl/50 focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/20 outline-none transition-all duration-300 font-light"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted ml-2">E-mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      required
                      className="w-full px-6 py-4 rounded-2xl border border-church-blue/10 bg-pearl/50 focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/20 outline-none transition-all duration-300 font-light"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted ml-2">Assunto</label>
                  <select 
                    id="subject" 
                    name="subject"
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-church-blue/10 bg-pearl/50 focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/20 outline-none transition-all duration-300 font-light appearance-none"
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="Pedido de Oração">Pedido de Oração</option>
                    <option value="Solicitação de Visita">Solicitação de Visita</option>
                    <option value="Informações sobre a Igreja">Informações sobre a Igreja</option>
                    <option value="Contar um Testemunho">Contar um Testemunho</option>
                    <option value="Outros Assuntos">Outros Assuntos</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted ml-2">Sua Mensagem / Pedido</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows={5} 
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-church-blue/10 bg-pearl/50 focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/20 outline-none transition-all duration-300 font-light resize-none"
                    placeholder="Escreva aqui sua mensagem ou pedido de oração..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-minimal w-full bg-church-blue text-pearl border-none py-5 text-lg shadow-xl shadow-church-blue/20 hover:bg-church-blue-light ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}</span>
                  {!isSubmitting && <Send size={18} className="ml-3 inline" />}
                </button>
              </form>
            )}
          </motion.div>

          {/* Informações e Mapa */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-church-blue/5">
              <h3 className="text-2xl text-church-blue mb-8 font-serif italic">Informações de Contato</h3>
              <ul className="space-y-8">
                <li className="flex items-start gap-6 text-church-muted group">
                  <div className="w-14 h-14 bg-church-blue text-pearl rounded-2xl flex items-center justify-center shadow-lg shadow-church-blue/20 group-hover:scale-110 transition-transform duration-500">
                    <MapPin size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-vibrant mb-1">Endereço</p>
                    <p className="text-lg text-church-blue font-light leading-relaxed">{address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-6 text-church-muted group">
                  <div className="w-14 h-14 bg-church-blue text-pearl rounded-2xl flex items-center justify-center shadow-lg shadow-church-blue/20 group-hover:scale-110 transition-transform duration-500">
                    <Phone size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-vibrant mb-1">Telefone</p>
                    <p className="text-lg text-church-blue font-light leading-relaxed">{phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-6 text-church-muted group">
                  <div className="w-14 h-14 bg-church-blue text-pearl rounded-2xl flex items-center justify-center shadow-lg shadow-church-blue/20 group-hover:scale-110 transition-transform duration-500">
                    <Mail size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-vibrant mb-1">E-mail</p>
                    <p className="text-lg text-church-blue font-light leading-relaxed">{email}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-8 border-t border-church-blue/5">
                <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted mb-6">Redes Sociais</h4>
                <div className="flex gap-6">
                  {contactConfig?.youtubeChannelUrl && (
                    <a href={contactConfig.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-[1.5rem] bg-church-blue text-pearl flex items-center justify-center hover:bg-church-vibrant transition-all duration-500 shadow-xl shadow-church-blue/10 overflow-hidden">
                      <img 
                        src="/botao-de-reproducao-do-youtube-com-renderizacao-3d.png" 
                        alt="YouTube" 
                        className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500" 
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white p-3 rounded-[3rem] shadow-2xl border border-church-vibrant/5 h-[350px] overflow-hidden relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.845873215278!2d-43.0566378!3d-22.8451999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x99906669869697%3A0x698696986969869!2sR.%20Dr.%20Cumplido%20de%20Santana%2C%2042%20-%20Mutu%C3%A1%2C%20S%C3%A3o%20Gon%C3%A7alo%20-%20RJ%2C%2024460-000!5e0!3m2!1spt-BR!2sbr!4v1711750000000!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da Igreja"
                className="rounded-[2.5rem] grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
