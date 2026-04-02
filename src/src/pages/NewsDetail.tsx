import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFirestoreDoc } from '../hooks/useFirestore';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: news, loading } = useFirestoreDoc<any>('updates', id || '');

  if (loading) return <div className="py-20 text-center">Carregando...</div>;
  if (!news) return <div className="py-20 text-center">Notícia não encontrada.</div>;

  return (
    <div className="bg-pearl min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-church-vibrant mb-8 hover:text-church-blue transition-colors duration-300 group">
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" /> Voltar para o início
        </Link>
        
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl text-church-blue font-serif italic mb-6">{news.title}</h1>
          <div className="flex items-center text-church-muted text-sm space-x-6">
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {news.date}</div>
            <div className="flex items-center"><User className="w-4 h-4 mr-2" /> {news.author || 'Admin'}</div>
          </div>
        </header>

        <div className="aspect-video rounded-3xl overflow-hidden mb-10 shadow-xl group">
          <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
        </div>

        <div className="prose prose-lg max-w-none text-church-muted">
          {(() => {
            const description = news.description || '';
            const splitIndex = description.indexOf('\n\n', Math.floor(description.length * 0.3)) !== -1 ? description.indexOf('\n\n', Math.floor(description.length * 0.3)) : Math.floor(description.length * 0.6);
            const firstPart = description.substring(0, splitIndex);
            const secondPart = description.substring(splitIndex);

            return (
              <>
                <p className="whitespace-pre-wrap mb-4">{firstPart}</p>
                {news.secondaryImageUrl && (
                  <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg group">
                    <img src={news.secondaryImageUrl} alt="Detalhe da notícia" className="w-full h-auto transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                )}
                <p className="whitespace-pre-wrap">{secondPart}</p>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
