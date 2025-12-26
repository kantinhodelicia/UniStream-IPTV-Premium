
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { xtream } from '../services/XtreamService';
import { reiService } from '../services/ReiService';
import { XtreamStream, ReiChannel } from '../types';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isKidsMode, auth, vodCategories } = useContext(AppContext);
  const [featuredMovies, setFeaturedMovies] = useState<XtreamStream[]>([]);
  const [kidsMovies, setKidsMovies] = useState<XtreamStream[]>([]);
  const [openChannels, setOpenChannels] = useState<ReiChannel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth) {
      loadInitialData();
    }
  }, [auth]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [movies, channels] = await Promise.all([
        xtream.getVodStreams(),
        reiService.getChannels()
      ]);

      setFeaturedMovies(movies.slice(0, 10));
      setOpenChannels(channels.slice(0, 12));

      const kidsCategory = vodCategories.find(c => 
        ['kids', 'infantil', 'desenhos', 'animação'].some(k => c.category_name.toLowerCase().includes(k))
      );
      
      if (kidsCategory) {
        const kids = await xtream.getVodStreams(kidsCategory.category_id);
        setKidsMovies(kids.slice(0, 10));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const featured = featuredMovies[0] || {
    name: 'Carregando...',
    plot: 'Carregando destaques do servidor...',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200'
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col pb-32">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md px-4 py-4 flex flex-col gap-4 border-b border-white/5">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <span className={`material-symbols-outlined text-3xl filled ${isKidsMode ? 'text-yellow-400' : 'text-primary'}`}>{isKidsMode ? 'face' : 'smart_display'}</span>
             <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">UniStream</h1>
             {isKidsMode && <span className="ml-1 px-2 py-0.5 rounded bg-yellow-400 text-black text-[10px] font-black uppercase">Kids</span>}
           </div>
           <div className="flex items-center gap-4">
             <button className="text-white opacity-40 hover:opacity-100 transition-opacity"><span className="material-symbols-outlined">search</span></button>
             <button onClick={loadInitialData} className="text-white opacity-40 hover:opacity-100 transition-opacity"><span className="material-symbols-outlined">refresh</span></button>
           </div>
        </div>
        {!isKidsMode && (
          <div className="flex gap-6 overflow-x-auto no-scrollbar font-black text-[11px] tracking-[0.15em] text-text-secondary uppercase">
            <span className="text-white border-b-2 border-primary pb-2">Destaques</span>
            <span onClick={() => navigate('/livetv')} className="cursor-pointer hover:text-white pb-2">TV Ao Vivo</span>
            <span onClick={() => navigate('/movies')} className="cursor-pointer hover:text-white pb-2">Filmes</span>
            <span onClick={() => navigate('/series')} className="cursor-pointer hover:text-white pb-2">Séries</span>
            <span onClick={() => navigate('/kids')} className="cursor-pointer hover:text-white pb-2 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">Kids</span>
          </div>
        )}
      </header>

      {/* Hero Banner */}
      <section className="relative w-full aspect-[4/5] sm:aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000" style={{backgroundImage: `url(${featured.thumbnail || featured.stream_icon})`}}></div>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
             <span className={`${isKidsMode ? 'bg-yellow-400 text-black' : 'bg-primary text-white'} text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider`}>Tendência</span>
             <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">{featured.year || '2024'} • VOD Premium</span>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight drop-shadow-2xl uppercase italic tracking-tighter">{featured.name}</h2>
          <p className="text-gray-300 text-sm line-clamp-2 max-w-lg mb-2 opacity-80">{featured.plot || 'Aproveite o melhor do cinema e da TV com qualidade ultra HD.'}</p>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(`/details/movie/${featured.stream_id}`)}
              className={`${isKidsMode ? 'bg-yellow-400 text-black' : 'bg-primary text-white'} flex-1 sm:flex-none px-10 py-3.5 rounded-xl font-black flex items-center justify-center gap-2 shadow-xl transform active:scale-95 transition-all uppercase text-sm tracking-widest`}
            >
              <span className="material-symbols-outlined filled">play_arrow</span> Assistir
            </button>
            <button className="size-14 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"><span className="material-symbols-outlined">add</span></button>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-8 pb-10">
        {/* Nova Rail: Canais Abertos */}
        {!isKidsMode && openChannels.length > 0 && (
          <section className="px-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-500 flex items-center gap-2">
                 <span className="material-symbols-outlined text-lg filled">crown</span>
                 Canais Abertos (Rei)
               </h3>
               <span onClick={() => navigate('/livetv')} className="text-[9px] font-black text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white">Ver Grade Completa</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {openChannels.map((channel) => (
                <div 
                  key={channel.name} 
                  onClick={() => navigate('/livetv')} 
                  className="w-24 shrink-0 flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="aspect-square w-full rounded-2xl bg-white p-2 border-2 border-transparent group-hover:border-yellow-500 transition-all shadow-lg overflow-hidden">
                    <img src={channel.cover} className="w-full h-full object-contain" alt={channel.name} />
                  </div>
                  <h4 className="text-[9px] font-black text-center truncate uppercase tracking-tighter text-gray-400 group-hover:text-yellow-500">{channel.name}</h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isKidsMode && featuredMovies.length > 1 && (
          <section className="px-4 flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Filmes Recentes</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {featuredMovies.slice(1).map((movie) => (
                <div key={movie.stream_id} onClick={() => navigate(`/details/movie/${movie.stream_id}`)} className="w-32 shrink-0 flex flex-col gap-2 group cursor-pointer">
                  <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden relative shadow-xl bg-surface-dark border border-white/5">
                    <img src={movie.stream_icon} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  </div>
                  <h4 className="text-[10px] font-black truncate uppercase tracking-tighter group-hover:text-primary transition-colors">{movie.name}</h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {(isKidsMode || kidsMovies.length > 0) && (
          <section className="px-4 flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-pink-500">Universo Kids</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {kidsMovies.map((k) => (
                <div key={k.stream_id} onClick={() => navigate(`/details/movie/${k.stream_id}`)} className="w-40 shrink-0 flex flex-col gap-2 group cursor-pointer">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden relative shadow-lg bg-surface-dark border-2 border-transparent group-hover:border-pink-500 transition-all">
                    <img src={k.stream_icon} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h4 className="text-[10px] font-black truncate uppercase text-gray-400 group-hover:text-pink-500">{k.name}</h4>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {loading && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-surface-dark/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-white">Sincronizando...</span>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
