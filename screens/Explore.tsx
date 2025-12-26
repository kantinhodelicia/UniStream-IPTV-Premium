
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { xtream } from '../services/XtreamService';
import { XtreamSeries, XtreamStream } from '../types';

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { vodCategories, seriesCategories } = useContext(AppContext);
  
  // States para Busca de Séries
  const [seriesSearch, setSeriesSearch] = useState('');
  const [seriesResults, setSeriesResults] = useState<XtreamSeries[]>([]);
  const [lastSeriesQuery, setLastSeriesQuery] = useState('');
  const [isSearchingSeries, setIsSearchingSeries] = useState(false);

  // States para Busca de TV Ao Vivo
  const [tvSearch, setTvSearch] = useState('');
  const [tvResults, setTvResults] = useState<XtreamStream[]>([]);
  const [lastTvQuery, setLastTvQuery] = useState('');
  const [isSearchingTv, setIsSearchingTv] = useState(false);

  const handleSeriesSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = seriesSearch.trim();
    if (!query) return;

    setIsSearchingSeries(true);
    setSeriesResults([]);
    setLastSeriesQuery(query);
    
    try {
      const allSeries = await xtream.getSeries();
      const filtered = allSeries.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      setSeriesResults(filtered);
      setSeriesSearch(''); 
    } catch (e) {
      console.error("Erro na busca de séries:", e);
    } finally {
      setIsSearchingSeries(false);
    }
  };

  const handleTvSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = tvSearch.trim();
    if (!query) return;

    setIsSearchingTv(true);
    setTvResults([]);
    setLastTvQuery(query);

    try {
      // Busca todos os canais ao vivo e filtra pelo nome
      const allStreams = await xtream.getLiveStreams();
      const filtered = allStreams.filter(ch => 
        ch.name.toLowerCase().includes(query.toLowerCase())
      );
      setTvResults(filtered);
      setTvSearch('');
    } catch (e) {
      console.error("Erro na busca de TV:", e);
    } finally {
      setIsSearchingTv(false);
    }
  };

  const clearSeriesResults = () => {
    setSeriesResults([]);
    setLastSeriesQuery('');
  };

  const clearTvResults = () => {
    setTvResults([]);
    setLastTvQuery('');
  };

  return (
    <div className="min-h-screen bg-background-dark pb-32">
      <header className="p-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-6">Explorar<span className="text-primary">.</span></h1>
        
        <div className="flex flex-col gap-6">
          {/* Busca de Séries */}
          <div className="bg-surface-dark/40 border border-white/5 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col items-start mb-4">
               <h2 className="text-xl font-black uppercase tracking-tighter italic leading-none text-white">Busca de Séries</h2>
               <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-2">Encontre sua próxima maratona</p>
            </div>
            
            <form onSubmit={handleSeriesSearch} className="relative">
              <input 
                type="text"
                value={seriesSearch}
                onChange={(e) => setSeriesSearch(e.target.value)}
                placeholder="Nome da série e Enter..."
                className="w-full bg-black/40 border border-white/10 rounded-xl h-12 pl-10 pr-4 text-xs font-bold text-white focus:border-primary transition-all"
              />
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-gray-500 text-sm">theaters</span>
              <button type="submit" className="hidden">Buscar</button>
            </form>

            {isSearchingSeries && (
              <div className="mt-8 flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in">
                <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}

            {seriesResults.length > 0 && !isSearchingSeries && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-[10px] font-black text-primary uppercase tracking-widest italic">Séries: "{lastSeriesQuery}"</h3>
                  <button onClick={clearSeriesResults} className="text-[9px] font-black text-gray-500 uppercase hover:text-white transition-colors">Limpar</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {seriesResults.map(series => (
                    <div 
                      key={series.series_id}
                      onClick={() => navigate(`/series-details/${series.series_id}`)}
                      className="flex flex-col gap-2 group cursor-pointer"
                    >
                      <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-surface-dark border border-white/5 relative shadow-xl transform transition-transform group-hover:scale-[1.02]">
                        <img src={series.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={series.name} />
                        <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md px-1 py-0.5 rounded text-[7px] font-black text-yellow-500 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[9px] filled">star</span>
                          {series.rating}
                        </div>
                      </div>
                      <h4 className="text-[10px] font-black truncate uppercase tracking-tighter px-1 group-hover:text-primary transition-colors">{series.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Busca de Canais TV */}
          <div className="bg-surface-dark/40 border border-white/5 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col items-start mb-4">
               <h2 className="text-xl font-black uppercase tracking-tighter italic leading-none text-white">Busca de Canais TV</h2>
               <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mt-2">Sintonize sua programação</p>
            </div>
            
            <form onSubmit={handleTvSearch} className="relative">
              <input 
                type="text"
                value={tvSearch}
                onChange={(e) => setTvSearch(e.target.value)}
                placeholder="Nome do canal e Enter..."
                className="w-full bg-black/40 border border-white/10 rounded-xl h-12 pl-10 pr-4 text-xs font-bold text-white focus:border-yellow-500 transition-all"
              />
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-gray-500 text-sm">live_tv</span>
              <button type="submit" className="hidden">Buscar</button>
            </form>

            {isSearchingTv && (
              <div className="mt-8 flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in">
                <div className="size-8 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
              </div>
            )}

            {tvResults.length > 0 && !isSearchingTv && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest italic">Canais: "{lastTvQuery}"</h3>
                  <button onClick={clearTvResults} className="text-[9px] font-black text-gray-500 uppercase hover:text-white transition-colors">Limpar</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {tvResults.map(ch => (
                    <div 
                      key={ch.stream_id}
                      onClick={() => navigate('/livetv')}
                      className="flex flex-col gap-2 group cursor-pointer"
                    >
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-white p-4 border border-white/5 relative shadow-xl transform transition-all group-hover:scale-[1.02] group-hover:border-yellow-500/50">
                        <img 
                          src={ch.stream_icon || 'https://via.placeholder.com/300x169?text=TV'} 
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                          alt={ch.name} 
                        />
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">HD</div>
                      </div>
                      <h4 className="text-[10px] font-black truncate uppercase tracking-tighter px-1 group-hover:text-yellow-500 transition-colors">{ch.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lastTvQuery && tvResults.length === 0 && !isSearchingTv && (
              <div className="mt-8 py-6 flex flex-col items-center text-center gap-2 bg-black/20 rounded-2xl border border-white/5">
                 <span className="material-symbols-outlined text-gray-600 text-3xl">tv_off</span>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">Nenhum canal encontrado</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Categorias - Exibidas apenas se não houver buscas ativas */}
      {!lastSeriesQuery && !lastTvQuery && !isSearchingSeries && !isSearchingTv && (
        <main className="px-6 flex flex-col gap-8 mt-4 animate-in fade-in duration-700">
          <section>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Categorias de Filmes</h3>
               <span className="text-[9px] font-black text-primary uppercase tracking-widest">Ver Tudo</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
               {vodCategories.slice(0, 6).map(cat => (
                 <div 
                   key={cat.category_id}
                   onClick={() => navigate(`/dynamic-content/movie/${cat.category_id}`)}
                   className="h-20 rounded-2xl bg-surface-dark border border-white/5 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-xs font-black uppercase tracking-tighter text-gray-300 group-hover:text-white truncate px-4">{cat.category_name}</span>
                 </div>
               ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Top Séries</h3>
               <span className="text-[9px] font-black text-primary uppercase tracking-widest">Ver Tudo</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
               {seriesCategories.slice(0, 6).map(cat => (
                 <div 
                   key={cat.category_id}
                   onClick={() => navigate(`/dynamic-content/series/${cat.category_id}`)}
                   className="h-20 rounded-2xl bg-surface-dark border border-white/5 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-xs font-black uppercase tracking-tighter text-gray-300 group-hover:text-white truncate px-4">{cat.category_name}</span>
                 </div>
               ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default Explore;
