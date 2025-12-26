
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { xtream } from '../services/XtreamService';
import { XtreamStream } from '../types';

const MoviesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { vodCategories } = useContext(AppContext);
  const [activeCat, setActiveCat] = useState<string>('');
  const [movies, setMovies] = useState<XtreamStream[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vodCategories.length > 0 && !activeCat) {
      const firstId = vodCategories[0].category_id;
      setActiveCat(firstId);
      loadMovies(firstId);
    }
  }, [vodCategories]);

  const loadMovies = async (catId: string) => {
    setLoading(true);
    try {
      const data = await xtream.getVodStreams(catId);
      setMovies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('ação')) return 'bolt';
    if (n.includes('comédia')) return 'sentiment_very_satisfied';
    if (n.includes('terror')) return 'skull';
    if (n.includes('drama')) return 'mask';
    if (n.includes('ficção')) return 'rocket_launch';
    return 'category';
  };

  return (
    <div className="min-h-screen bg-background-dark pb-32">
      <header className="p-6 sticky top-0 z-40 bg-background-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Cine<span className="text-primary">Box</span></h1>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">VOD Premium 4K</p>
          </div>
          <button className="size-11 rounded-2xl bg-surface-dark border border-white/10 flex items-center justify-center text-gray-400">
             <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        {/* Navegação por Categorias */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 snap-x">
          {vodCategories.map((cat) => (
            <button 
              key={cat.category_id}
              onClick={() => { setActiveCat(cat.category_id); loadMovies(cat.category_id); }}
              className={`
                snap-start shrink-0 h-11 flex items-center gap-3 px-5 rounded-2xl transition-all duration-300 border
                ${activeCat === cat.category_id 
                  ? 'bg-primary border-primary shadow-xl shadow-primary/30 text-white' 
                  : 'bg-surface-dark/50 border-white/5 text-gray-500 hover:text-white'
                }
              `}
            >
              <span className={`material-symbols-outlined text-lg ${activeCat === cat.category_id ? 'filled' : ''}`}>
                {getCategoryIcon(cat.category_name)}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                {cat.category_name}
              </span>
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
             <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Sincronizando Filmes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div 
                key={movie.stream_id} 
                onClick={() => navigate(`/details/movie/${movie.stream_id}`)}
                className="flex flex-col gap-3 group cursor-pointer"
              >
                <div className="aspect-[2/3] rounded-[1.8rem] overflow-hidden bg-surface-dark border border-white/5 relative shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-primary/40">
                  <img src={movie.stream_icon} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Play Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
                     <div className="size-12 rounded-full bg-primary flex items-center justify-center shadow-2xl">
                        <span className="material-symbols-outlined text-white filled">play_arrow</span>
                     </div>
                  </div>
                </div>
                <h4 className="text-[11px] font-black truncate uppercase tracking-tighter text-gray-200 group-hover:text-primary transition-colors">{movie.name}</h4>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MoviesScreen;
