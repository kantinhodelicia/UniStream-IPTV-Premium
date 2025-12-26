
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { xtream } from '../services/XtreamService';
import { XtreamSeries } from '../types';

const SeriesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { seriesCategories } = useContext(AppContext);
  const [activeCat, setActiveCat] = useState<string>('');
  const [seriesList, setSeriesList] = useState<XtreamSeries[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seriesCategories.length > 0 && !activeCat) {
      const firstId = seriesCategories[0].category_id;
      setActiveCat(firstId);
      loadSeries(firstId);
    }
  }, [seriesCategories]);

  const loadSeries = async (catId: string) => {
    setLoading(true);
    try {
      const data = await xtream.getSeries(catId);
      setSeriesList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCatChange = (id: string) => {
    if (id === activeCat) return;
    setActiveCat(id);
    loadSeries(id);
    // Scroll para o topo ao trocar categoria
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função auxiliar para ícones de categoria
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('ação') || n.includes('action')) return 'bolt';
    if (n.includes('comédia') || n.includes('comedy')) return 'sentiment_very_satisfied';
    if (n.includes('terror') || n.includes('horror')) return 'skull';
    if (n.includes('drama')) return 'mask';
    if (n.includes('ficção') || n.includes('sci-fi')) return 'rocket_launch';
    if (n.includes('romance')) return 'favorite';
    if (n.includes('documentário')) return 'history_edu';
    if (n.includes('kids') || n.includes('infantil')) return 'child_care';
    if (n.includes('anime')) return 'animation';
    return 'category';
  };

  return (
    <div className="min-h-screen bg-background-dark pb-32">
      <header className="p-6 pb-2 sticky top-0 z-30 bg-background-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Séries<span className="text-primary">.</span></h1>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Premium Library</p>
          </div>
          <button className="size-12 rounded-2xl bg-surface-dark border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90">
             <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>

        {/* Categories Selector Melhorado */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-4 -mx-6 px-6 snap-x">
          {seriesCategories.map((cat, idx) => (
            <button 
              key={cat.category_id}
              onClick={() => handleCatChange(cat.category_id)}
              className={`
                snap-start shrink-0 h-12 flex items-center gap-3 px-5 rounded-2xl transition-all duration-300 border
                ${activeCat === cat.category_id 
                  ? 'bg-gradient-to-br from-primary to-primary-dark border-primary shadow-[0_8px_20px_rgba(212,17,66,0.3)] scale-105 text-white' 
                  : 'bg-surface-dark/60 border-white/5 text-gray-400 hover:bg-surface-lighter hover:text-white hover:border-white/10'
                }
              `}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <span className={`material-symbols-outlined text-lg ${activeCat === cat.category_id ? 'filled' : ''}`}>
                {getCategoryIcon(cat.category_name)}
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                {cat.category_name}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Hero Mini-Stats */}
      {!loading && seriesList.length > 0 && (
        <div className="px-6 py-2 flex items-center gap-4 animate-in fade-in duration-1000">
           <div className="flex -space-x-3 overflow-hidden">
             {seriesList.slice(0, 4).map((s, i) => (
               <img key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-background-dark object-cover" src={s.cover} alt="" />
             ))}
           </div>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
             <span className="text-white">{seriesList.length}</span> Títulos nesta seção
           </p>
        </div>
      )}

      {/* Series Grid */}
      <main className="px-6 mt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
             <div className="relative">
                <div className="size-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="size-8 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                </div>
             </div>
             <div className="text-center">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] block mb-2">Sincronizando</span>
                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Aguarde um instante...</span>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {seriesList.map((series) => (
              <div 
                key={series.series_id} 
                onClick={() => navigate(`/series-details/${series.series_id}`)}
                className="flex flex-col gap-3 group cursor-pointer"
              >
                <div className="aspect-[2/3] w-full rounded-[2rem] overflow-hidden bg-surface-dark border border-white/5 relative shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:border-primary/50 group-hover:shadow-primary/20">
                  <img src={series.cover} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={series.name} loading="lazy" />
                  
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-2 py-1 rounded-xl text-[9px] font-black text-yellow-500 flex items-center gap-1 border border-white/10">
                    <span className="material-symbols-outlined text-[11px] filled">star</span>
                    {series.rating}
                  </div>

                  {/* Play Hover Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
                     <div className="size-14 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl shadow-primary/40 backdrop-blur-md">
                        <span className="material-symbols-outlined text-white text-3xl filled">play_arrow</span>
                     </div>
                  </div>
                </div>
                <div className="px-2">
                   <h4 className="text-[12px] font-black truncate uppercase tracking-tighter text-gray-100 group-hover:text-primary transition-colors duration-300">{series.name}</h4>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{series.releaseDate?.split('-')[0] || '2024'}</span>
                      <div className="size-1 rounded-full bg-white/10"></div>
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest">FHD</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Empty State */}
      {!loading && seriesList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 px-10 text-center gap-4 opacity-50">
           <span className="material-symbols-outlined text-6xl">search_off</span>
           <div>
             <h3 className="text-sm font-black uppercase tracking-widest mb-1">Nenhuma série encontrada</h3>
             <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">Tente outra categoria ou atualize a lista</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default SeriesScreen;
