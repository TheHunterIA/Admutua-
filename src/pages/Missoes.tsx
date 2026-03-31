import React from 'react';
import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestore';
import { orderBy, where } from 'firebase/firestore';
import { Mail, MapPin, Newspaper, Heart, CreditCard, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Missoes() {
  const { data: missionaries } = useFirestoreCollection<any>('missionaries', orderBy('name', 'asc'));
  const { data: news } = useFirestoreCollection<any>('updates', where('subject', '==', 'Missoes'), orderBy('createdAt', 'desc'));
  const { data: contactConfig } = useFirestoreDoc<any>('config', 'contact');

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {missionaries.map((m: any) => (
            <div key={m.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-church-blue/5 hover:shadow-md transition-all flex flex-col">
              <div className="w-48 h-48 rounded-[2rem] overflow-hidden mb-8 mx-auto shadow-xl border-4 border-church-vibrant/10">
                <img src={m.imageUrl || '/placeholder-avatar.png'} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-2xl text-church-blue font-serif italic mb-2 text-center">{m.name}</h3>
              <p className="text-church-vibrant text-[10px] text-center mb-6 font-bold uppercase tracking-[0.2em]">{m.field}</p>
              <p className="text-church-muted text-sm mb-8 text-center font-light leading-relaxed flex-1">{m.bio}</p>
              
              <div className="space-y-4 pt-6 border-t border-church-blue/5">
                {m.email && (
                  <div className="flex items-center justify-center gap-3 text-xs text-church-muted">
                    <Mail size={14} className="text-church-vibrant" /> {m.email}
                  </div>
                )}
                {m.location && (
                  <div className="flex items-center justify-center gap-3 text-xs text-church-muted">
                    <MapPin size={14} className="text-church-vibrant" /> {m.location}
                  </div>
                )}
              </div>
            </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item: any) => (
                  <Link key={item.id} to={`/noticias/${item.id}`} className="group bg-pearl p-6 rounded-3xl shadow-sm border border-church-blue/5 hover:shadow-lg transition-all">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="text-lg text-church-blue font-serif italic mb-2 group-hover:text-church-vibrant transition-colors">{item.title}</h4>
                    <p className="text-sm text-church-muted line-clamp-2">{item.description}</p>
                  </Link>
                ))}
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
    </div>
  );
}
