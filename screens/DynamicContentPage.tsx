
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { xtream } from '../services/XtreamService';
import { AppContext } from '../App';

const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 Horas de Cache

const DynamicContentPage: React.FC = () => {
  const { type, catId } = useParams();
  const navigate = useNavigate();
  const { vodCategories, seriesCategories } = useContext(AppContext);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = type === 'series' ? seriesCategories : vodCategories;
  const currentCat = categories.find(c => c.category_id === catId);

  useEffect(() => {
    if (catId) loadContent();
  }, [catId, type]);

  const loadContent = async () => {
    const cacheKey = `uni_cache_${type}_${catId}`;
    const cached = localStorage.getItem(cacheKey);
    
    // 1. Tentar carregar do cache primeiro (Instantâneo)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      setItems(data);
      setLoading(false);

      // 2. Se o cache for antigo, atualiza em background
      if (Date.now() - timestamp > CACHE_TTL) {
        fetchFreshData(cacheKey, true);
      }
      return;
    }

    // 3. Sem cache: carregamento inicial completo
    setLoading(true);
    await fetchFreshData(cacheKey);
  };

  const fetchFreshData = async (cacheKey: string, silent = false) => {
    try {
      const data = type === 'series' 
        ? await xtream.getSeries(catId) 
        : await xtream.getVodStreams(catId);
      
      setItems(data);
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {
      console.error("Erro ao atualizar cache:", e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark pb-32">
      <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md p-6 border-b border-white/5 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="size-10 bg-white/5 rounded-2xl flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter italic leading-none">{currentCat?.category_name}</h1>
          <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 italic">{items.length} Títulos Carregados</p>
        </div>
      </header>

      {loading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="size-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 animate-pulse">Sincronizando Biblioteca Digital</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 p-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {items.map((item) => (
            <div 
              key={item.stream_id || item.series_id} 
              onClick={() => navigate(type === 'series' ? `/series-details/${item.series_id}` : `/details/movie/${item.stream_id}`)}
              className="flex flex-col gap-3 group cursor-pointer"
            >
              <div className="aspect-[2/3] rounded-[2rem] overflow-hidden bg-surface-dark border border-white/5 relative shadow-2xl transition-all duration-500 hover:scale-105 hover:border-primary/40">
                 <img src={item.stream_icon || item.cover} className="w-full h-full object-cover" loading="lazy" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="size-12 rounded-full bg-primary flex items-center justify-center">
                       <span className="material-symbols-outlined text-white filled">play_arrow</span>
                    </div>
                 </div>
              </div>
              <h4 className="text-[11px] font-black truncate uppercase tracking-tighter text-gray-300 group-hover:text-primary transition-colors">{item.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicContentPage;
