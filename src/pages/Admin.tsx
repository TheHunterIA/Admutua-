import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Home as HomeIcon, 
  Calendar, 
  Clock, 
  Users, 
  Church, 
  Mail, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  MessageSquare,
  Database,
  ImagePlus,
  Loader2,
  Star,
  Newspaper,
  BookOpen
} from 'lucide-react';
import { auth, loginWithGoogle, logout, db } from '../lib/firebase';
import { useFirestoreCollection, useFirestoreDoc, firestoreService } from '../hooks/useFirestore';
import { seedInitialData, removeSeedData } from '../lib/seedData';
import { orderBy, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

const ADMIN_EMAIL = "cleitonprado003@gmail.com";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [modal, setModal] = useState<{ type: 'confirm' | 'success' | 'error', message: string, onConfirm?: () => void } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modal]);

  const handleLogin = async () => {
    if (loginLoading) return;
    setLoginLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        console.error('Login error:', error);
        setModal({ type: 'error', message: 'Erro ao fazer login: ' + error.message });
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSeed = async () => {
    setModal({
      type: 'confirm',
      message: 'Deseja carregar os dados iniciais? Isso irá configurar o site com informações de exemplo.',
      onConfirm: async () => {
        setModal(null);
        setIsSeeding(true);
        try {
          await seedInitialData();
          setModal({ type: 'success', message: 'Dados iniciais carregados com sucesso!' });
        } catch (error: any) {
          setModal({ type: 'error', message: 'Erro ao carregar dados: ' + error.message });
        } finally {
          setIsSeeding(false);
        }
      }
    });
  };

  const handleRemoveSeedData = async () => {
    setModal({
      type: 'confirm',
      message: 'ATENÇÃO: Isso irá apagar apenas os dados de exemplo (pré-definidos) de serviços, departamentos, eventos e atualizações. Os dados que você adicionou manualmente não serão afetados. Deseja continuar?',
      onConfirm: async () => {
        setModal(null);
        setIsSeeding(true);
        try {
          await removeSeedData();
          setModal({ type: 'success', message: 'Dados de exemplo removidos com sucesso!' });
        } catch (error: any) {
          setModal({ type: 'error', message: 'Erro ao remover dados de exemplo: ' + error.message });
        } finally {
          setIsSeeding(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pearl">
        <div className="w-12 h-12 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pearl p-4 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-church-vibrant blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-church-blue blur-[120px] rounded-full"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-church-blue rounded-[3rem] shadow-2xl p-12 text-center relative z-10 border border-church-vibrant/10"
        >
          <div className="w-24 h-24 bg-pearl/5 text-church-vibrant rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <LayoutDashboard size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-serif italic text-pearl mb-4">Área Administrativa</h1>
          <p className="text-pearl/60 font-light mb-10 leading-relaxed">
            Acesse o portal de gestão para gerenciar o conteúdo e a presença digital da AD Mutuá.
          </p>
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className={`w-full bg-church-blue-light text-pearl px-8 py-4 rounded-2xl font-bold tracking-widest uppercase text-[10px] transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl shadow-black/20 border border-white/5 ${loginLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-church-vibrant hover:text-church-blue hover:shadow-church-vibrant/30'}`}
          >
            {loginLoading ? (
              <div className="w-5 h-5 border-2 border-pearl border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Star size={16} className="text-church-vibrant group-hover:text-church-blue" />
                <span>Entrar com Google</span>
              </>
            )}
          </button>
          {user && user.email !== ADMIN_EMAIL && (
            <p className="mt-6 text-red-500 text-sm font-light italic">
              Acesso negado. Esta conta não possui privilégios de administrador.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row font-sans text-church-text overflow-hidden min-h-0">
      {/* Sidebar */}
      <aside className="w-full md:w-80 flex-shrink-0 h-full bg-church-blue text-pearl border-r border-church-vibrant/10 shadow-[0_0_50px_rgba(0,0,0,0.2)] relative overflow-y-auto custom-scrollbar">
        <div className="p-10 border-b border-church-vibrant/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-pearl/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
          <h2 className="text-2xl font-serif italic text-pearl flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-church-vibrant text-church-blue rounded-2xl flex items-center justify-center shadow-lg shadow-church-vibrant/20">
              <LayoutDashboard size={24} strokeWidth={1.5} />
            </div>
            <span className="tracking-tight">Painel AD Mutuá</span>
          </h2>
        </div>
        
        <nav className="p-8 space-y-4">
          <TabButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon size={20} strokeWidth={1.5} />} label="Início" />
          <TabButton active={activeTab === 'leadership'} onClick={() => setActiveTab('leadership')} icon={<Users size={20} strokeWidth={1.5} />} label="Liderança" />
          <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar size={20} strokeWidth={1.5} />} label="Eventos" />
          <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Clock size={20} strokeWidth={1.5} />} label="Cultos" />
          <TabButton active={activeTab === 'departments'} onClick={() => setActiveTab('departments')} icon={<Users size={20} strokeWidth={1.5} />} label="Departamentos" />
          <TabButton active={activeTab === 'ebd'} onClick={() => setActiveTab('ebd')} icon={<BookOpen size={20} strokeWidth={1.5} />} label="EBD" />
          <TabButton active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<Newspaper size={20} strokeWidth={1.5} />} label="Notícias" />
          <TabButton active={activeTab === 'congregations'} onClick={() => setActiveTab('congregations')} icon={<Church size={20} strokeWidth={1.5} />} label="Congregações" />
          <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} icon={<Mail size={20} strokeWidth={1.5} />} label="Contato" />
          <TabButton active={activeTab === 'missionaries'} onClick={() => setActiveTab('missionaries')} icon={<Users size={20} strokeWidth={1.5} />} label="Missionários" />
          <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} icon={<MessageSquare size={20} strokeWidth={1.5} />} label="Mensagens" />
          
          <div className="pt-8 mt-8 border-t border-church-vibrant/10">
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-pearl/60 hover:bg-white/5 hover:text-pearl transition-all font-medium disabled:opacity-50 group border border-transparent hover:border-church-vibrant/10"
            >
              <div className="w-10 h-10 rounded-xl bg-church-vibrant/10 flex items-center justify-center text-church-vibrant group-hover:scale-110 transition-transform shadow-sm">
                <Database size={20} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{isSeeding ? 'Carregando...' : 'Dados Iniciais'}</span>
            </button>

            <button
              onClick={handleRemoveSeedData}
              disabled={isSeeding}
              className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium disabled:opacity-50 group border border-transparent hover:border-red-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform shadow-sm">
                <Trash2 size={20} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{isSeeding ? 'Limpando...' : 'Remover Exemplo'}</span>
            </button>
          </div>
        </nav>

        <div className="p-8 border-t border-church-vibrant/10 bg-black/20">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="relative">
              <img src={user.photoURL || ''} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-church-vibrant/20 shadow-lg" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-church-blue rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-pearl truncate">{user.displayName}</p>
              <p className="text-[10px] text-pearl/40 truncate uppercase tracking-widest">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-semibold text-sm border border-red-500/20"
          >
            <LogOut size={18} strokeWidth={2} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative min-h-0">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === 'home' && <HomeEditor setModal={setModal} />}
              {activeTab === 'leadership' && <LeadershipEditor setModal={setModal} />}
              {activeTab === 'events' && <ListEditor collectionPath="events" title="Eventos Especiais" setModal={setModal} />}
              {activeTab === 'services' && <ListEditor collectionPath="services" title="Horários de Cultos" setModal={setModal} />}
              {activeTab === 'departments' && <ListEditor collectionPath="departments" title="Departamentos" setModal={setModal} />}
              {activeTab === 'ebd' && <EbdAdmin setModal={setModal} />}
              {activeTab === 'news' && <ListEditor collectionPath="updates" title="Notícias" setModal={setModal} />}
              {activeTab === 'congregations' && <ListEditor collectionPath="congregations" title="Congregações" setModal={setModal} />}
              {activeTab === 'contact' && <ContactEditor setModal={setModal} />}
              {activeTab === 'missionaries' && <MissionariesManager setModal={setModal} />}
              {activeTab === 'submissions' && <SubmissionsViewer setModal={setModal} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Custom Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 bg-church-blue/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-md p-6 md:p-12 shadow-2xl border border-church-vibrant/10"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 mx-auto ${
                modal.type === 'confirm' ? 'bg-church-blue/5 text-church-blue' : 
                modal.type === 'success' ? 'bg-green-50 text-green-600' : 
                'bg-red-50 text-red-600'
              }`}>
                {modal.type === 'confirm' ? <Database size={32} /> : 
                 modal.type === 'success' ? <Star size={32} /> : 
                 <X size={32} />}
              </div>
              <h3 className={`text-2xl font-serif italic text-center mb-4 ${modal.type === 'error' ? 'text-red-600' : 'text-church-blue'}`}>
                {modal.type === 'confirm' ? 'Confirmação' : modal.type === 'success' ? 'Sucesso!' : 'Atenção'}
              </h3>
              <p className="text-church-muted text-center font-light mb-10 leading-relaxed">{modal.message}</p>
              <div className="flex gap-4">
                {modal.type === 'confirm' ? (
                  <>
                    <button 
                      onClick={modal.onConfirm}
                      className="flex-1 bg-church-blue text-pearl py-4 rounded-2xl font-bold hover:bg-church-vibrant transition-all shadow-lg shadow-church-blue/20"
                    >
                      Confirmar
                    </button>
                    <button 
                      onClick={() => setModal(null)}
                      className="flex-1 bg-pearl text-church-blue py-4 rounded-2xl font-bold hover:bg-church-vibrant/10 transition-all border border-church-vibrant/20"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setModal(null)}
                    className="flex-1 bg-church-blue text-pearl py-4 rounded-2xl font-bold hover:bg-church-vibrant transition-all shadow-lg shadow-church-blue/20"
                  >
                    Entendido
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-500 font-medium group relative overflow-hidden ${
        active 
          ? 'bg-church-blue-light text-church-vibrant shadow-[0_10px_30px_rgba(0,0,0,0.3)] scale-[1.02] border border-white/5' 
          : 'text-pearl/40 hover:bg-white/5 hover:text-pearl'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute inset-0 bg-church-blue-light"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className={`relative z-10 transition-all duration-500 ${active ? 'text-church-vibrant scale-110' : 'text-church-vibrant/20 group-hover:text-church-vibrant group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className={`relative z-10 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {label}
      </span>
    </button>
  );
}

// --- Helpers ---

const compressImage = (file: File, maxSize = 1200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        if (dataUrl.length > 900000) {
          reject(new Error('Imagem ainda muito grande após compressão. Tente uma foto menor.'));
          return;
        }
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function MissionariesManager({ setModal }: { setModal: (m: any) => void }) {
  return (
    <div className="space-y-16">
      <ListEditor collectionPath="missionaries" title="Missionários" setModal={setModal} />
    </div>
  );
}

function HomeEditor({ setModal }: { setModal: (m: any) => void }) {
  const { data: config, loading } = useFirestoreDoc<any>('config', 'site');
  const [formData, setFormData] = useState({ 
    heroTitle: '', 
    heroSubtitle: '', 
    heroBackgroundImage: '', 
    liveVideoId: '',
    logoUrl: '',
    footerBannerUrl: ''
  });

  useEffect(() => {
    if (config) setFormData(prev => ({ ...prev, ...config }));
  }, [config]);

  const handleSave = async () => {
    try {
      await firestoreService.set('config', 'site', { ...formData, updatedAt: serverTimestamp() });
      setModal({ type: 'success', message: 'Configurações salvas com sucesso!' });
    } catch (error: any) {
      setModal({ type: 'error', message: 'Erro ao salvar: ' + error.message });
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <header className="relative">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-12 bg-church-vibrant rounded-full hidden md:block"></div>
        <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Administração</span>
        <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic">Configurações do Site</h1>
        <p className="text-church-muted font-light mt-4 max-w-2xl">Edite o conteúdo principal, a identidade visual e as configurações de transmissão da AD Mutuá.</p>
      </header>

      <div className="bg-white rounded-[4rem] shadow-2xl border border-church-vibrant/5 p-12 md:p-16 space-y-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-church-blue/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <section className="space-y-10 relative z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-serif italic text-church-blue">Seção Hero</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-church-vibrant/20 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 gap-10">
            <Field label="Título do Hero" value={formData.heroTitle} onChange={v => setFormData({...formData, heroTitle: v})} />
            <Field label="Subtítulo do Hero" value={formData.heroSubtitle} onChange={v => setFormData({...formData, heroSubtitle: v})} isTextArea />
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-serif italic text-church-blue">Transmissão ao Vivo</h2>
            <div className="flex-1 h-px bg-church-vibrant/10"></div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            <div>
              <label className="block text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px] mb-4">URL ou ID do Vídeo YouTube (Live)</label>
              <input 
                type="text" 
                value={formData.liveVideoId} 
                onChange={e => {
                  const val = e.target.value;
                  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                  const match = val.match(regExp);
                  const id = (match && match[7].length === 11) ? match[7] : val;
                  setFormData({...formData, liveVideoId: id});
                }}
                className="w-full px-6 py-4 rounded-2xl border border-church-vibrant/10 focus:ring-2 focus:ring-church-vibrant outline-none bg-pearl/30 text-church-blue font-light"
                placeholder="Cole a URL do vídeo ou apenas o ID (Ex: ABC123XYZ)"
              />
            </div>
          </div>
        </section>

        <div className="pt-6">
          <button 
            onClick={handleSave}
            className="bg-church-blue text-pearl px-10 py-4 rounded-2xl font-bold hover:bg-church-vibrant transition-all flex items-center gap-3 shadow-xl shadow-church-blue/20"
          >
            <Save size={20} strokeWidth={1.5} />
            Salvar Todas as Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

function LeadershipEditor({ setModal }: { setModal: (m: any) => void }) {
  const { data: config, loading } = useFirestoreDoc<any>('config', 'leadership');
  const [formData, setFormData] = useState({ 
    name: '', 
    role: '', 
    message: '', 
    imageUrl: ''
  });

  useEffect(() => {
    if (config) setFormData(prev => ({ ...prev, ...config }));
  }, [config]);

  const handleSave = async () => {
    try {
      await firestoreService.set('config', 'leadership', { ...formData, updatedAt: serverTimestamp() });
      setModal({ type: 'success', message: 'Liderança atualizada com sucesso!' });
    } catch (error: any) {
      setModal({ type: 'error', message: 'Erro ao salvar: ' + error.message });
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="relative">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-12 bg-church-vibrant rounded-full hidden md:block"></div>
        <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Administração</span>
        <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic">Gestão de Liderança</h1>
        <p className="text-church-muted font-light mt-4 max-w-2xl">Edite as informações e a mensagem pastoral do Pastor Presidente da AD Mutuá.</p>
      </header>

      <div className="bg-white rounded-[4rem] shadow-2xl border border-church-vibrant/5 p-12 md:p-16 space-y-12 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-church-vibrant/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="grid grid-cols-1 gap-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Field label="Nome do Pastor" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
            <Field label="Cargo / Título" value={formData.role} onChange={v => setFormData({...formData, role: v})} />
          </div>
          <Field label="Mensagem Pastoral" value={formData.message} onChange={v => setFormData({...formData, message: v})} isTextArea />
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-church-blue uppercase tracking-[0.2em] ml-1">Foto do Pastor</label>
            <ImageUploadField 
              value={formData.imageUrl} 
              onChange={v => setFormData({...formData, imageUrl: v})} 
            />
          </div>
        </div>
        <div className="pt-6 relative z-10">
          <button 
            onClick={handleSave}
            className="bg-church-blue text-pearl px-10 py-4 rounded-2xl font-bold hover:bg-church-vibrant transition-all flex items-center gap-3 shadow-xl shadow-church-blue/20"
          >
            <Save size={20} strokeWidth={1.5} />
            Salvar Liderança
          </button>
        </div>
      </div>
    </div>
  );
}

function ListEditor({ collectionPath, title, setModal }: { collectionPath: string, title: string, setModal: (m: any) => void }) {
  const { data, loading } = useFirestoreCollection<any>(collectionPath, orderBy('order', 'asc'));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (editingId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingId]);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({ order: data.length });
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...formData };
      if (editingId === 'new') {
        dataToSave.createdAt = serverTimestamp();
      } else {
        dataToSave.updatedAt = serverTimestamp();
      }
      
      if (editingId === 'new') {
        await firestoreService.add(collectionPath, dataToSave);
      } else if (editingId) {
        await firestoreService.update(collectionPath, editingId, dataToSave);
      }
      setEditingId(null);
      setModal({ type: 'success', message: 'Item salvo com sucesso!' });
    } catch (error: any) {
      setModal({ type: 'error', message: 'Erro ao salvar: ' + error.message });
    }
  };

  const handleDelete = async (id: string) => {
    setModal({
      type: 'confirm',
      message: 'Tem certeza que deseja excluir este item?',
      onConfirm: async () => {
        setModal(null);
        try {
          await firestoreService.delete(collectionPath, id);
          setModal({ type: 'success', message: 'Item excluído com sucesso!' });
        } catch (error: any) {
          setModal({ type: 'error', message: 'Erro ao excluir: ' + error.message });
        }
      }
    });
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 relative">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-12 bg-church-vibrant rounded-full hidden md:block"></div>
        <div>
          <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Gestão de Conteúdo</span>
          <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic">{title}</h1>
          <p className="text-church-muted font-light mt-4 max-w-2xl">Gerencie e organize os registros desta seção com elegância e precisão.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-church-blue text-pearl px-10 py-5 rounded-2xl font-bold hover:bg-church-vibrant transition-all flex items-center gap-3 shadow-xl shadow-church-blue/20 group"
        >
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={20} strokeWidth={1.5} />
          </div>
          <span className="uppercase tracking-widest text-xs">Adicionar Novo</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {data.map((item) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[3.5rem] border border-church-vibrant/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-pearl/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            <div className="flex items-center gap-8 relative z-10">
              <div className="relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-24 h-24 rounded-[2rem] object-cover border-2 border-church-vibrant/10 shadow-lg group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-24 h-24 rounded-[2rem] bg-church-blue/5 flex items-center justify-center text-church-vibrant/20 shadow-inner">
                    <Database size={40} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-church-vibrant text-[10px] font-bold">
                  #{item.order + 1}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-serif italic text-church-blue mb-2">{item.title || item.name || item.day}</h3>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-church-vibrant/40"></span>
                  <p className="text-sm text-church-muted font-light truncate max-w-md">{item.theme || item.address || item.time}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <button 
                onClick={() => handleEdit(item)} 
                className="p-4 text-church-blue hover:bg-church-blue hover:text-pearl rounded-2xl transition-all duration-300 border border-church-blue/10 shadow-sm"
                title="Editar"
              >
                <Edit2 size={20} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => handleDelete(item.id)} 
                className="p-4 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 border border-red-100 shadow-sm"
                title="Excluir"
              >
                <Trash2 size={20} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 bg-church-blue/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-12 shadow-2xl border border-church-vibrant/10"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Formulário</span>
                  <h2 className="text-3xl font-serif italic text-church-blue">
                    {editingId === 'new' ? 'Adicionar Registro' : 'Editar Registro'}
                  </h2>
                </div>
                <button onClick={() => setEditingId(null)} className="p-3 hover:bg-church-blue/5 rounded-full text-church-blue transition-colors"><X size={28} /></button>
              </div>

              <div className="space-y-8">
                {/* Dynamic Fields based on collection */}
                {collectionPath === 'events' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <Field label="Título do Evento" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                    </div>
                    <Field label="Tema" value={formData.theme} onChange={v => setFormData({...formData, theme: v})} />
                    <Field label="Data" value={formData.date} onChange={v => setFormData({...formData, date: v})} />
                    <Field label="Data de Início da Exibição" type="date" value={formData.displayStartDate || ''} onChange={v => setFormData({...formData, displayStartDate: v})} />
                    <Field label="Data de Fim da Exibição" type="date" value={formData.displayEndDate || ''} onChange={v => setFormData({...formData, displayEndDate: v})} />
                    <Field label="Localização" value={formData.location} onChange={v => setFormData({...formData, location: v})} />
                    <Field label="Telefone de Contato" value={formData.contactPhone} onChange={v => setFormData({...formData, contactPhone: v})} />
                    
                    <div className="md:col-span-2">
                      <Field label="Mais Informações (Detalhes)" value={formData.details} onChange={v => setFormData({...formData, details: v})} isTextArea />
                    </div>
                    
                    <div className="md:col-span-2 flex items-center gap-4 p-6 bg-pearl/30 rounded-2xl border border-church-vibrant/10">
                      <input 
                        type="checkbox" 
                        id="isRegistrationOpen"
                        checked={formData.isRegistrationOpen || false} 
                        onChange={e => setFormData({...formData, isRegistrationOpen: e.target.checked})}
                        className="w-6 h-6 rounded-lg border-church-vibrant/20 text-church-blue focus:ring-church-vibrant"
                      />
                      <label htmlFor="isRegistrationOpen" className="text-sm font-semibold text-church-blue cursor-pointer tracking-wide uppercase text-[10px]">Habilitar Inscrições Online?</label>
                    </div>

                    {formData.isRegistrationOpen && (
                      <div className="md:col-span-2">
                        <Field label="Link para Inscrição" value={formData.registrationLink} onChange={v => setFormData({...formData, registrationLink: v})} placeholder="Ex: Link do Google Forms ou Sympla" />
                      </div>
                    )}

                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px]">Imagem Principal</label>
                      <ImageUploadField value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} />
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      <label className="block text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px]">Galeria de Fotos Adicionais</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {(formData.additionalImages || []).map((img: string, idx: number) => (
                          <div key={idx} className="relative group">
                            <ImageUploadField 
                              value={img} 
                              onChange={v => {
                                const newImgs = [...(formData.additionalImages || [])];
                                if (v) newImgs[idx] = v;
                                else newImgs.splice(idx, 1);
                                setFormData({...formData, additionalImages: newImgs});
                              }} 
                            />
                            <button 
                              onClick={() => {
                                const newImgs = [...(formData.additionalImages || [])];
                                newImgs.splice(idx, 1);
                                setFormData({...formData, additionalImages: newImgs});
                              }}
                              className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-xl hover:bg-red-600 z-10 transition-transform hover:scale-110"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => setFormData({...formData, additionalImages: [...(formData.additionalImages || []), '']})}
                          className="border-2 border-dashed border-church-vibrant/20 rounded-3xl p-6 hover:border-church-vibrant hover:bg-church-vibrant/5 transition-all flex flex-col items-center justify-center min-h-[180px] bg-pearl/30 text-church-muted group"
                        >
                          <Plus size={32} className="group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold mt-3 uppercase tracking-widest">Adicionar Foto</span>
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Field label="Link Externo (Opcional)" value={formData.link} onChange={v => setFormData({...formData, link: v})} />
                    </div>
                  </div>
                )}
                {collectionPath === 'updates' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <Field label="Título da Atualização" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px] mb-2">Assunto</label>
                      <select 
                        value={formData.subject || ''} 
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl border border-church-vibrant/10 focus:ring-2 focus:ring-church-vibrant outline-none bg-pearl/30 text-church-blue font-light"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="EBD">EBD</option>
                        <option value="Missoes">Missões</option>
                        <option value="Cultos">Cultos</option>
                        <option value="Noticias">Notícias</option>
                        <option value="Eventos">Eventos</option>
                        <option value="Departamentos">Departamentos</option>
                        <option value="Jovens">Jovens</option>
                        <option value="Criancas">Crianças</option>
                        <option value="Social">Social</option>
                        <option value="Campanhas">Campanhas</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Descrição / Conteúdo" value={formData.description} onChange={v => setFormData({...formData, description: v})} isTextArea />
                    </div>
                    <Field label="Data de Exibição" value={formData.date} onChange={v => setFormData({...formData, date: v})} placeholder="Ex: 30 de Março, 2026" />
                    <Field label="Link Externo (Opcional)" value={formData.link} onChange={v => setFormData({...formData, link: v})} />
                    <Field label="Autor / Responsável" value={formData.author} onChange={v => setFormData({...formData, author: v})} />
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px]">Imagem da Atualização</label>
                      <ImageUploadField value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px]">Imagem Secundária (Meio da Notícia)</label>
                      <ImageUploadField value={formData.secondaryImageUrl} onChange={v => setFormData({...formData, secondaryImageUrl: v})} />
                    </div>
                  </div>
                )}
                {collectionPath === 'services' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Dia da Semana" value={formData.day} onChange={v => setFormData({...formData, day: v})} />
                    <Field label="Horário" value={formData.time} onChange={v => setFormData({...formData, time: v})} />
                    <div className="md:col-span-2">
                      <Field label="Nome do Culto / Atividade" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={!!formData.isLiveStream}
                        onChange={e => setFormData({...formData, isLiveStream: e.target.checked})}
                        className="w-6 h-6 rounded-lg border-church-vibrant/10 text-church-vibrant focus:ring-church-vibrant"
                      />
                      <label className="text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px]">Transmissão ao Vivo</label>
                    </div>
                  </div>
                )}
                {collectionPath === 'departments' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <Field label="Nome do Departamento" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Descrição" value={formData.description} onChange={v => setFormData({...formData, description: v})} isTextArea />
                    </div>
                    <Field label="Liderança Responsável" value={formData.pastor} onChange={v => setFormData({...formData, pastor: v})} />
                    <Field label="Telefone de Contato" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px]">Imagem do Departamento</label>
                      <ImageUploadField value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} />
                    </div>
                  </div>
                )}
                {collectionPath === 'congregations' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <Field label="Nome da Congregação" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Endereço Completo" value={formData.address} onChange={v => setFormData({...formData, address: v})} />
                    </div>
                    <Field label="Pastor Dirigente" value={formData.pastor} onChange={v => setFormData({...formData, pastor: v})} />
                    <Field label="Telefone de Contato" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px]">Imagem da Congregação</label>
                      <ImageUploadField value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} />
                    </div>
                  </div>
                )}
                {collectionPath === 'missionaries' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <Field label="Nome do Missionário" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Campo Missionário" value={formData.field} onChange={v => setFormData({...formData, field: v})} />
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Biografia" value={formData.bio} onChange={v => setFormData({...formData, bio: v})} isTextArea />
                    </div>
                    <Field label="Email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                    <Field label="Localização" value={formData.location} onChange={v => setFormData({...formData, location: v})} />
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-sm font-semibold text-church-blue tracking-wide uppercase text-[10px]">Foto do Missionário</label>
                      <ImageUploadField value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} />
                    </div>
                  </div>
                )}
                <div className="max-w-[200px]">
                  <Field label="Ordem de Exibição" value={formData.order} onChange={v => setFormData({...formData, order: parseInt(v)})} type="number" />
                </div>
              </div>

              <div className="mt-16 flex gap-6">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-church-blue text-pearl py-5 rounded-2xl font-bold hover:bg-church-vibrant transition-all shadow-xl shadow-church-blue/20 flex items-center justify-center gap-3"
                >
                  <Save size={24} strokeWidth={1.5} />
                  Salvar Registro
                </button>
                <button 
                  onClick={() => setEditingId(null)}
                  className="flex-1 bg-pearl text-church-blue py-5 rounded-2xl font-bold hover:bg-church-vibrant/10 transition-all border border-church-vibrant/20"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactEditor({ setModal }: { setModal: (m: any) => void }) {
  const { data: config, loading } = useFirestoreDoc<any>('config', 'contact');
  const [formData, setFormData] = useState({ 
    address: '', 
    phone: '', 
    email: '', 
    whatsapp: '',
    instagramUrl: '',
    youtubeChannelUrl: ''
  });

  useEffect(() => {
    if (config) setFormData(config);
  }, [config]);

  const handleSave = async () => {
    try {
      await firestoreService.set('config', 'contact', formData);
      setModal({ type: 'success', message: 'Informações de contato salvas!' });
    } catch (error: any) {
      setModal({ type: 'error', message: 'Erro ao salvar: ' + error.message });
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Administração</span>
        <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic">Informações de Contato</h1>
        <p className="text-church-muted font-light mt-4">Edite os dados de contato e redes sociais da sede.</p>
      </header>

      <div className="bg-white rounded-[3rem] shadow-xl border border-church-vibrant/5 p-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Field label="Endereço Completo" value={formData.address} onChange={v => setFormData({...formData, address: v})} />
          <Field label="Telefone Sede" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
          <Field label="Email Oficial" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
          <Field label="WhatsApp" value={formData.whatsapp} onChange={v => setFormData({...formData, whatsapp: v})} />
          <Field label="URL do Canal YouTube" value={formData.youtubeChannelUrl} onChange={v => setFormData({...formData, youtubeChannelUrl: v})} placeholder="Ex: https://youtube.com/@seucanal" />
        </div>
        <div className="pt-6">
          <button 
            onClick={handleSave}
            className="bg-church-blue text-pearl px-10 py-4 rounded-2xl font-bold hover:bg-church-vibrant transition-all flex items-center gap-3 shadow-xl shadow-church-blue/20"
          >
            <Save size={20} strokeWidth={1.5} />
            Salvar Informações
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmissionsViewer({ setModal }: { setModal: (m: any) => void }) {
  const { data, loading } = useFirestoreCollection<any>('contactSubmissions', orderBy('createdAt', 'desc'));

  const handleDelete = async (id: string) => {
    setModal({
      type: 'confirm',
      message: 'Excluir esta mensagem permanentemente?',
      onConfirm: async () => {
        setModal(null);
        try {
          await firestoreService.delete('contactSubmissions', id);
          setModal({ type: 'success', message: 'Mensagem excluída com sucesso!' });
        } catch (error: any) {
          setModal({ type: 'error', message: 'Erro ao excluir: ' + error.message });
        }
      }
    });
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="relative">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-12 bg-church-vibrant rounded-full hidden md:block"></div>
        <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Administração</span>
        <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic">Mensagens Recebidas</h1>
        <p className="text-church-muted font-light mt-4 max-w-2xl">Pedidos de oração, dúvidas e contatos realizados pelo site oficial da AD Mutuá.</p>
      </header>

      <div className="space-y-8">
        {data.length === 0 ? (
          <div className="bg-white p-24 rounded-[4rem] border border-church-vibrant/5 text-center shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-pearl/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-church-blue/5 rounded-[2rem] flex items-center justify-center text-church-vibrant/20 mx-auto mb-6">
                <MessageSquare size={40} strokeWidth={1} />
              </div>
              <p className="text-church-muted italic font-light text-lg">Nenhuma mensagem recebida até o momento.</p>
            </div>
          </div>
        ) : (
          data.map(sub => (
            <motion.div 
              key={sub.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[3.5rem] border border-church-vibrant/5 shadow-xl hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-church-blue/5 rounded-[2rem] flex items-center justify-center text-church-vibrant shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <Mail size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif italic text-church-blue mb-1">{sub.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-church-vibrant"></div>
                      <p className="text-sm text-church-blue/60 font-medium tracking-wide">{sub.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="px-4 py-1.5 bg-pearl text-church-muted text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-church-vibrant/10">
                    {sub.createdAt?.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={() => handleDelete(sub.id)} 
                    className="p-4 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-100"
                    title="Excluir mensagem"
                  >
                    <Trash2 size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="bg-pearl/30 p-10 rounded-[2.5rem] border border-church-vibrant/5 relative">
                <div className="absolute top-6 right-8 opacity-5 text-church-blue">
                  <MessageSquare size={64} strokeWidth={1} />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-church-vibrant uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-church-vibrant/30"></span>
                    Assunto: {sub.subject}
                  </p>
                  <p className="text-church-text/90 text-lg font-light leading-relaxed whitespace-pre-wrap italic font-serif">
                    "{sub.message}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function ImageUploadField({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await compressImage(file);
      onChange(base64);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer border-2 border-dashed border-church-vibrant/20 rounded-[2rem] p-6 hover:border-church-vibrant transition-all flex flex-col items-center justify-center min-h-[180px] bg-pearl/30 overflow-hidden shadow-inner"
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-10 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-church-vibrant shadow-lg group-hover:scale-110 transition-transform">
                <ImagePlus size={32} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold text-church-blue uppercase tracking-[0.2em] bg-white/90 px-4 py-2 rounded-full shadow-sm">Trocar Imagem</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center">
                <Loader2 size={32} className="text-church-vibrant animate-spin" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center text-church-vibrant/40 group-hover:text-church-vibrant transition-colors">
                <ImagePlus size={32} strokeWidth={1.5} />
              </div>
            )}
            <span className="text-[10px] font-bold text-church-muted uppercase tracking-[0.2em]">
              {isUploading ? 'Processando...' : 'Clique para fazer upload'}
            </span>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*"
        />
      </div>
      {value && (
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ou cole a URL da imagem aqui"
            className="flex-1 px-6 py-3 text-xs rounded-xl border border-church-vibrant/10 outline-none focus:ring-2 focus:ring-church-vibrant bg-pearl/20 text-church-blue font-light"
          />
          <button 
            onClick={() => onChange('')}
            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-100"
            title="Remover imagem"
          >
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}

function EbdAdmin({ setModal }: { setModal: (m: any) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'lessons' | 'classes'>('lessons');

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b border-church-vibrant/10 pb-4">
        <button 
          onClick={() => setActiveSubTab('lessons')}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeSubTab === 'lessons' ? 'bg-church-blue text-white shadow-md' : 'text-church-blue hover:bg-church-blue/5'}`}
        >
          Lições
        </button>
        <button 
          onClick={() => setActiveSubTab('classes')}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeSubTab === 'classes' ? 'bg-church-blue text-white shadow-md' : 'text-church-blue hover:bg-church-blue/5'}`}
        >
          Classes
        </button>
      </div>

      {activeSubTab === 'lessons' ? (
        <EbdLessonEditor setModal={setModal} />
      ) : (
        <EbdClassEditor setModal={setModal} />
      )}
    </div>
  );
}

function EbdLessonEditor({ setModal }: { setModal: (m: any) => void }) {
  const { data: lessons, loading } = useFirestoreCollection<any>('ebdLessons', orderBy('createdAt', 'desc'));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    quarterNumber: '', 
    lessonNumber: '', 
    magazineTitle: '', 
    lessonTitle: '',
    authorName: '',
    authorPhotoUrl: '',
    content: ''
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({
      quarterNumber: '', 
      lessonNumber: '', 
      magazineTitle: '', 
      lessonTitle: '',
      authorName: '',
      authorPhotoUrl: '',
      content: ''
    });
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...formData };
      if (editingId === 'new') {
        dataToSave.createdAt = serverTimestamp();
        await firestoreService.add('ebdLessons', dataToSave);
      } else if (editingId) {
        dataToSave.updatedAt = serverTimestamp();
        await firestoreService.update('ebdLessons', editingId, dataToSave);
      }
      setEditingId(null);
      setModal({ type: 'success', message: 'Lição da EBD salva com sucesso!' });
    } catch (error: any) {
      setModal({ type: 'error', message: 'Erro ao salvar: ' + error.message });
    }
  };

  const handleDelete = async (id: string) => {
    setModal({
      type: 'confirm',
      message: 'Tem certeza que deseja excluir esta lição?',
      onConfirm: async () => {
        setModal(null);
        try {
          await firestoreService.delete('ebdLessons', id);
          setModal({ type: 'success', message: 'Lição excluída com sucesso!' });
        } catch (error: any) {
          setModal({ type: 'error', message: 'Erro ao excluir: ' + error.message });
        }
      }
    });
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (editingId) {
    return (
      <div className="space-y-12">
        <header className="flex items-center justify-between">
          <div>
            <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Administração</span>
            <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic">
              {editingId === 'new' ? 'Nova Lição' : 'Editar Lição'}
            </h1>
          </div>
          <button 
            onClick={() => setEditingId(null)}
            className="w-12 h-12 rounded-full bg-pearl flex items-center justify-center text-church-blue hover:bg-church-vibrant hover:text-white transition-all shadow-md"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </header>

        <div className="bg-white rounded-[3rem] shadow-xl border border-church-vibrant/5 p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="Número do Trimestre" value={formData.quarterNumber} onChange={v => setFormData({...formData, quarterNumber: v})} placeholder="Ex: 1º Trimestre de 2026" />
            <Field label="Número da Lição" value={formData.lessonNumber} onChange={v => setFormData({...formData, lessonNumber: v})} placeholder="Ex: Lição 1" />
            <Field label="Título da Revista" value={formData.magazineTitle} onChange={v => setFormData({...formData, magazineTitle: v})} placeholder="Ex: O Evangelho de João" />
            <Field label="Título da Lição" value={formData.lessonTitle} onChange={v => setFormData({...formData, lessonTitle: v})} placeholder="Ex: A Palavra se fez carne" />
            <Field label="Nome do Responsável" value={formData.authorName} onChange={v => setFormData({...formData, authorName: v})} placeholder="Ex: Pr. João Silva" />
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-church-blue uppercase tracking-[0.2em] ml-1">Foto do Responsável</label>
              <ImageUploadField value={formData.authorPhotoUrl} onChange={v => setFormData({...formData, authorPhotoUrl: v})} />
            </div>
          </div>
          
          <div className="w-full">
            <Field label="Texto da Lição" value={formData.content} onChange={v => setFormData({...formData, content: v})} isTextArea={true} placeholder="Escreva o texto completo da lição aqui..." />
          </div>

          <div className="pt-6">
            <button 
              onClick={handleSave}
              className="bg-church-blue text-pearl px-10 py-4 rounded-2xl font-bold hover:bg-church-vibrant transition-all flex items-center gap-3 shadow-xl shadow-church-blue/20"
            >
              <Save size={20} strokeWidth={1.5} />
              Salvar Lição
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Administração</span>
          <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic">Lições da EBD</h1>
          <p className="text-church-muted font-light mt-4">Gerencie as lições bíblicas semanais da Escola Bíblica Dominical.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-church-vibrant text-white px-8 py-4 rounded-2xl font-bold hover:bg-church-blue transition-all flex items-center gap-3 shadow-xl shadow-church-vibrant/20"
        >
          <Plus size={20} strokeWidth={2} />
          Nova Lição
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((item: any) => (
          <div key={item.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-church-vibrant/5 group relative overflow-hidden">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="w-10 h-10 rounded-xl bg-church-blue/5 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all">
                <Edit2 size={16} strokeWidth={2} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-church-blue/5 flex items-center justify-center text-church-blue mb-6">
              <BookOpen size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-serif italic text-church-blue mb-2">{item.lessonTitle}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-church-vibrant mb-2">{item.quarterNumber} • {item.lessonNumber}</p>
            <p className="text-church-muted text-sm line-clamp-2">{item.magazineTitle}</p>
          </div>
        ))}
        {lessons.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-church-blue/10 rounded-[3rem]">
            <BookOpen size={48} strokeWidth={1} className="mx-auto text-church-blue/20 mb-4" />
            <p className="text-church-muted font-light">Nenhuma lição cadastrada ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EbdClassEditor({ setModal }: { setModal: (m: any) => void }) {
  const { data: classes, loading } = useFirestoreCollection<any>('ebdClasses', orderBy('createdAt', 'desc'));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '', 
    teacher: '', 
    location: '', 
    schedule: '',
    description: '',
    imageUrl: ''
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({
      name: '', 
      teacher: '', 
      location: '', 
      schedule: '',
      description: '',
      imageUrl: ''
    });
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...formData };
      if (editingId === 'new') {
        dataToSave.createdAt = serverTimestamp();
        await firestoreService.add('ebdClasses', dataToSave);
      } else if (editingId) {
        dataToSave.updatedAt = serverTimestamp();
        await firestoreService.update('ebdClasses', editingId, dataToSave);
      }
      setEditingId(null);
      setModal({ type: 'success', message: 'Classe salva com sucesso!' });
    } catch (error: any) {
      setModal({ type: 'error', message: 'Erro ao salvar: ' + error.message });
    }
  };

  const handleDelete = async (id: string) => {
    setModal({
      type: 'confirm',
      message: 'Tem certeza que deseja excluir esta classe?',
      onConfirm: async () => {
        setModal(null);
        try {
          await firestoreService.delete('ebdClasses', id);
          setModal({ type: 'success', message: 'Classe excluída com sucesso!' });
        } catch (error: any) {
          setModal({ type: 'error', message: 'Erro ao excluir: ' + error.message });
        }
      }
    });
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-2 border-church-vibrant border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (editingId) {
    return (
      <div className="space-y-12">
        <header className="flex items-center justify-between">
          <div>
            <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Administração de Classes</span>
            <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic">
              {editingId === 'new' ? 'Nova Classe' : 'Editar Classe'}
            </h1>
          </div>
          <button 
            onClick={() => setEditingId(null)}
            className="w-12 h-12 rounded-full bg-pearl flex items-center justify-center text-church-blue hover:bg-church-vibrant hover:text-white transition-all shadow-md"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </header>

        <div className="bg-white rounded-[3rem] shadow-xl border border-church-vibrant/5 p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="Nome da Classe" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="Ex: Jovens" />
            <Field label="Professor(a)" value={formData.teacher} onChange={v => setFormData({...formData, teacher: v})} placeholder="Ex: Pr. João Silva" />
            <Field label="Local" value={formData.location} onChange={v => setFormData({...formData, location: v})} placeholder="Ex: Templo Principal" />
            <Field label="Horário" value={formData.schedule} onChange={v => setFormData({...formData, schedule: v})} placeholder="Ex: Domingos, 09:00" />
            <div className="space-y-3 md:col-span-2">
              <label className="block text-[10px] font-bold text-church-blue uppercase tracking-[0.2em] ml-1">Imagem da Classe (Opcional)</label>
              <ImageUploadField value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} />
            </div>
          </div>
          
          <div className="w-full">
            <Field label="Descrição" value={formData.description} onChange={v => setFormData({...formData, description: v})} isTextArea={true} placeholder="Breve descrição sobre o público-alvo ou foco da classe..." />
          </div>

          <div className="pt-6">
            <button 
              onClick={handleSave}
              className="bg-church-blue text-pearl px-10 py-4 rounded-2xl font-bold hover:bg-church-vibrant transition-all flex items-center gap-3 shadow-xl shadow-church-blue/20"
            >
              <Save size={20} strokeWidth={1.5} />
              Salvar Classe
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-2 block">Administração de Classes</span>
          <h1 className="text-4xl md:text-6xl text-church-blue font-serif italic">Classes da EBD</h1>
          <p className="text-church-muted font-light mt-4">Gerencie as classes da Escola Bíblica Dominical.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-church-vibrant text-white px-8 py-4 rounded-2xl font-bold hover:bg-church-blue transition-all flex items-center gap-3 shadow-xl shadow-church-vibrant/20"
        >
          <Plus size={20} strokeWidth={2} />
          Nova Classe
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((item: any) => (
          <div key={item.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-church-vibrant/5 group relative overflow-hidden">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="w-10 h-10 rounded-xl bg-church-blue/5 flex items-center justify-center text-church-blue hover:bg-church-blue hover:text-white transition-all">
                <Edit2 size={16} strokeWidth={2} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-church-blue/5 flex items-center justify-center text-church-blue mb-6">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Users size={24} strokeWidth={1.5} />
              )}
            </div>
            <h3 className="text-xl font-serif italic text-church-blue mb-2">{item.name}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-church-vibrant mb-2">{item.teacher}</p>
            <p className="text-church-muted text-sm line-clamp-2">{item.description}</p>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-church-blue/10 rounded-[3rem]">
            <Users size={48} strokeWidth={1} className="mx-auto text-church-blue/20 mb-4" />
            <p className="text-church-muted font-light">Nenhuma classe cadastrada ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", isTextArea = false, placeholder = "" }: { label: string, value: any, onChange: (v: string) => void, type?: string, isTextArea?: boolean, placeholder?: string }) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-bold text-church-blue uppercase tracking-[0.2em] ml-1">{label}</label>
      {isTextArea ? (
        <textarea 
          value={value || ''} 
          onChange={e => onChange(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full px-6 py-4 rounded-2xl border border-church-vibrant/10 focus:ring-2 focus:ring-church-vibrant outline-none bg-pearl/30 text-church-blue font-light leading-relaxed transition-all focus:bg-white"
        />
      ) : (
        <input 
          type={type} 
          value={value || ''} 
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 rounded-2xl border border-church-vibrant/10 focus:ring-2 focus:ring-church-vibrant outline-none bg-pearl/30 text-church-blue font-light transition-all focus:bg-white"
        />
      )}
    </div>
  );
}
