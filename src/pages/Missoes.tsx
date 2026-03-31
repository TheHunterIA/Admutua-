import React from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { orderBy, where } from 'firebase/firestore';
import { Mail, MapPin, Newspaper, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Missoes() {
  const { data: missionaries } = useFirestoreCollection<any>('missionaries', orderBy('name', 'asc'));
  const { data: news } = useFirestoreCollection<any>('updates', where('subject', '==', 'Missoes'), orderBy('createdAt', 'desc'));

  return (
    <div className="bg-pearl min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic mb-6">Nossos Missionários</h1>
          <p className="text-church-muted max-w-2xl mx-auto">
            Conheça aqueles que estão na linha de frente, levando a palavra de Deus a diferentes lugares. Acompanhe e ore por nossos missionários.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {missionaries.map((m: any) => (
            <div key={m.id} className="bg-white p-8 rounded-3xl shadow-sm border border-church-blue/5">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 mx-auto">
                <img src={m.imageUrl || '/placeholder-avatar.png'} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-2xl text-church-blue font-serif italic mb-2 text-center">{m.name}</h3>
              <p className="text-church-vibrant text-sm text-center mb-6 font-semibold uppercase tracking-wider">{m.field}</p>
              <p className="text-church-muted text-sm mb-6 text-center">{m.bio}</p>
              
              <div className="space-y-3 text-sm text-church-muted">
                {m.email && (
                  <div className="flex items-center justify-center gap-2">
                    <Mail size={16} className="text-church-vibrant" /> {m.email}
                  </div>
                )}
                {m.location && (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin size={16} className="text-church-vibrant" /> {m.location}
                  </div>
                )}
              </div>
            </div>
          ))}
          {missionaries.length === 0 && (
            <div className="col-span-full text-center py-20 text-church-muted">
              Nenhum missionário cadastrado no momento.
            </div>
          )}
        </div>

        {news.length > 0 && (
          <section className="py-16 bg-white rounded-[3rem] shadow-sm border border-church-blue/5 mb-20">
            <div className="max-w-7xl mx-auto px-8">
              <h3 className="text-2xl font-serif italic text-church-blue mb-12 flex items-center gap-3">
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
      </div>
    </div>
  );
}
