const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '      {/* News Banner Section */}';
const endMarker = '      {/* Live Stream Section */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found');
  process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newSection = `      {/* News & Updates Section */}
      {(recentUpdates.length > 0 || combinedUpdates.length > 0) && (
        <section className="pt-8 pb-12 px-6 md:px-12 lg:px-20 bg-pearl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-church-vibrant/20 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              
              {/* Left Side: News */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Fique Informado</span>
                  <h2 className="text-4xl md:text-6xl text-church-blue leading-tight mb-4">Notícias</h2>
                  <p className="text-church-muted font-light max-w-sm leading-relaxed">
                    Acompanhe as últimas novidades e acontecimentos da nossa comunidade.
                  </p>
                </div>

                <div className="relative h-[450px] w-full overflow-hidden flex flex-col items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                    <AnimatePresence initial={false}>
                      {recentUpdates.slice(0, 3).map((news: any, idx: number) => {
                        let position = idx - currentNewsIndex;
                        const total = Math.min(recentUpdates.length, 3);
                        if (position > total / 2) position -= total;
                        if (position < -total / 2) position += total;
                        if (Math.abs(position) > 1) return null;

                        return (
                          <motion.div
                            key={news.id}
                            initial={false}
                            animate={{
                              x: position * 480,
                              scale: position === 0 ? 1 : 0.8,
                              opacity: position === 0 ? 1 : 0.3,
                              zIndex: position === 0 ? 20 : 10,
                              rotateY: position * -15,
                              filter: position === 0 ? 'blur(0px)' : 'blur(4px)',
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute w-full max-w-[500px] cursor-pointer"
                            onClick={() => {
                              if (position !== 0) setCurrentNewsIndex(idx);
                            }}
                          >
                            <Link 
                              to={\`/noticias/\${news.id}\`} 
                              className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] bg-pearl border border-white/10 block"
                              onClick={(e) => {
                                if (position !== 0) e.preventDefault();
                              }}
                            >
                              <img 
                                src={news.imageUrl} 
                                alt={news.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-church-blue via-church-blue/20 to-transparent opacity-80"></div>
                              
                              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <span className="text-church-vibrant text-[9px] font-bold tracking-[0.3em] uppercase mb-3 block">
                                  {news.date}
                                </span>
                                <h3 className="text-2xl text-white font-serif italic leading-tight mb-4">
                                  {news.title}
                                </h3>
                                
                                {position === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                  >
                                    <p className="text-pearl/70 text-sm font-light italic line-clamp-2">
                                      {news.description}
                                    </p>
                                    <div className="w-full h-12 rounded-2xl bg-church-vibrant text-church-blue font-bold text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-white transition-all duration-500">
                                      Ler Notícia
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {Math.min(recentUpdates.length, 3) > 1 && (
                    <div className="flex items-center gap-8 mt-4">
                      <button 
                        onClick={() => setCurrentNewsIndex((prev) => (prev === 0 ? Math.min(recentUpdates.length, 3) - 1 : prev - 1))}
                        className="w-14 h-14 rounded-full border border-church-blue/10 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all group/btn"
                      >
                        <ChevronLeft size={24} strokeWidth={1.5} className="group-hover/btn:-translate-x-1 transition-transform" />
                      </button>
                      
                      <div className="flex gap-2">
                        {recentUpdates.slice(0, 3).map((_: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => setCurrentNewsIndex(i)}
                            className={\`h-1 rounded-full transition-all duration-500 \${i === currentNewsIndex ? 'w-10 bg-church-vibrant' : 'w-2 bg-church-blue/10'}\`}
                          />
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentNewsIndex((prev) => (prev === Math.min(recentUpdates.length, 3) - 1 ? 0 : prev + 1))}
                        className="w-14 h-14 rounded-full border border-church-blue/10 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all group/btn"
                      >
                        <ChevronRight size={24} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Recent Updates Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  <div className="mb-8">
                    <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Fique por dentro</span>
                    <h2 className="text-3xl text-church-blue leading-tight">Últimas Novidades</h2>
                  </div>

                  <div className="space-y-6">
                    {combinedUpdates.map((update: any, idx: number) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="group relative pl-8 border-l border-church-blue/10 hover:border-church-vibrant transition-colors duration-500 cursor-pointer"
                        onClick={() => handleUpdateClick(update)}
                      >
                        <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-church-blue/20 group-hover:bg-church-vibrant transition-colors"></div>
                        
                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-[9px] font-bold tracking-widest uppercase text-church-vibrant">
                            {update.type === 'event' ? 'Evento' : update.type === 'pastoral' ? 'Pastoral' : update.type === 'ebd' ? 'EBD' : update.type === 'missionary' ? 'Missões' : 'Notícia'}
                          </span>
                          <span className="text-[9px] text-church-muted/60 uppercase tracking-widest">{update.date}</span>
                        </div>

                        <h3 className="text-lg text-church-blue font-serif italic mb-3 leading-tight group-hover:text-church-vibrant transition-colors">
                          {update.title}
                        </h3>
                        
                        <p className="text-sm text-church-muted font-light leading-relaxed mb-2 line-clamp-2 italic">
                          {update.type === 'pastoral' ? \`"\${update.description}"\` : update.description}
                        </p>

                        <div>
                          {update.type === 'event' ? (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ver Detalhes <ArrowRight size={12} />
                            </div>
                          ) : update.type === 'pastoral' ? (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ler Mensagem <Quote size={12} />
                            </div>
                          ) : update.type === 'ebd' ? (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ler Lição <BookOpen size={12} />
                            </div>
                          ) : update.type === 'missionary' ? (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ver Missões <ArrowRight size={12} />
                            </div>
                          ) : (
                            <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                              Ler mais <ArrowRight size={12} />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-church-blue/5">
                    {/* Link removido temporariamente pois a página não existe */}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Events Banner Section */}
      {filteredEvents.length > 0 && (
        <section className="section-padding bg-pearl relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-4xl md:text-6xl text-church-blue leading-tight text-center">Eventos Especiais</h2>
            </div>
            <div className="relative h-[450px] w-full overflow-hidden flex flex-col items-center justify-center">
              {/* Stage Container */}
              <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                <AnimatePresence initial={false}>
                  {filteredEvents.map((event: any, idx: number) => {
                    // Calculate relative position to current index
                    let position = idx - currentEventIndex;
                    
                    // Handle wrap-around for a continuous feel
                    const total = filteredEvents.length;
                    if (position > total / 2) position -= total;
                    if (position < -total / 2) position += total;

                    // Only render cards close to the center for performance
                    if (Math.abs(position) > 1) return null;

                    return (
                      <motion.div
                        key={event.id}
                        initial={false}
                        animate={{
                          x: position * 480, // Offset based on position
                          scale: position === 0 ? 1 : 0.8,
                          opacity: position === 0 ? 1 : 0.3,
                          zIndex: position === 0 ? 20 : 10,
                          rotateY: position * -15,
                          filter: position === 0 ? 'blur(0px)' : 'blur(4px)',
                        }}
                        transition={{
                          duration: 0.8,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className="absolute w-full max-w-[500px] cursor-pointer"
                        onClick={() => {
                          if (position !== 0) setCurrentEventIndex(idx);
                        }}
                      >
                        <div className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] bg-pearl border border-white/10">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-church-blue via-church-blue/20 to-transparent opacity-80"></div>
                          
                          <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <span className="text-church-vibrant text-[9px] font-bold tracking-[0.3em] uppercase mb-3 block">
                              {event.date}
                            </span>
                            <h3 className="text-2xl text-white font-serif italic leading-tight mb-4">
                              {event.title}
                            </h3>
                            
                            {position === 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                              >
                                <p className="text-pearl/70 text-sm font-light italic line-clamp-2">
                                  "{event.theme}"
                                </p>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                  }}
                                  className="w-full h-12 rounded-2xl bg-church-vibrant text-church-blue font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all duration-500"
                                >
                                  Ver Detalhes
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Navigation Controls */}
              {specialEvents.length > 1 && (
                <div className="flex items-center gap-8 mt-4">
                  <button 
                    onClick={() => setCurrentEventIndex((prev) => (prev === 0 ? specialEvents.length - 1 : prev - 1))}
                    className="w-14 h-14 rounded-full border border-church-blue/10 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all group/btn"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} className="group-hover/btn:-translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex gap-2">
                    {specialEvents.map((_: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setCurrentEventIndex(i)}
                        className={\`h-1 rounded-full transition-all duration-500 \${i === currentEventIndex ? 'w-10 bg-church-vibrant' : 'w-2 bg-church-blue/10'}\`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentEventIndex((prev) => (prev === specialEvents.length - 1 ? 0 : prev + 1))}
                    className="w-14 h-14 rounded-full border border-church-blue/10 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all group/btn"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
\n`;

fs.writeFileSync(filePath, before + newSection + after, 'utf8');
console.log('Successfully replaced sections');
