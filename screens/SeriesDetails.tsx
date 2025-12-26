
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { xtream } from '../services/XtreamService';
import { XtreamSeriesInfo, XtreamEpisode } from '../types';
import VideoPlayer from '../components/VideoPlayer';

const SeriesDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<XtreamSeriesInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [currentEpisode, setCurrentEpisode] = useState<XtreamEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const episodeListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) loadSeriesInfo();
  }, [id]);

  const loadSeriesInfo = async () => {
    setLoading(true);
    try {
      const response = await xtream.getSeriesInfo(id!);
      setData(response);
      const seasons = Object.keys(response.episodes).sort((a, b) => parseInt(a) - parseInt(b));
      if (seasons.length > 0) setSelectedSeason(seasons[0]);
    } catch (e) {
      console.error("Erro ao carregar série", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    if (episodeListRef.current) {
      episodeListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateEpisode = (direction: 'next' | 'prev') => {
    if (!data || !currentEpisode) return;
    const episodes = data.episodes[selectedSeason] || [];
    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    
    if (direction === 'next' && currentIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentEpisode(episodes[currentIndex - 1]);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_20px_rgba(212,17,66,0.3)]"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 animate-pulse">Sincronizando Episódios</p>
      </div>
    );
  }

  const { info, episodes } = data;
  const seasons = Object.keys(episodes).sort((a, b) => parseInt(a) - parseInt(b));
  const currentEpisodes = episodes[selectedSeason] || [];

  const currentEpIndex = currentEpisode ? currentEpisodes.findIndex(ep => ep.id === currentEpisode.id) : -1;
  const hasPrevEp = currentEpIndex > 0;
  const hasNextEp = currentEpIndex < currentEpisodes.length - 1;

  return (
    <div className="min-h-screen bg-[#0f0a0c] text-white pb-32 overflow-x-hidden">
      {isPlaying && currentEpisode && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-500">
           <VideoPlayer 
             contentId={`series_ep_${currentEpisode.id}`}
             url={xtream.buildStreamUrl(currentEpisode.id, 'series')}
             title={`${info.name} - S${selectedSeason} E${currentEpisode.episode_num}`}
             onClose={() => setIsPlaying(false)}
             onNext={hasNextEp ? () => navigateEpisode('next') : undefined}
             onPrev={hasPrevEp ? () => navigateEpisode('prev') : undefined}
           />
        </div>
      )}

      <div className="relative w-full aspect-video sm:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-105" style={{ backgroundImage: `url(${info.cover})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a0c] via-[#0f0a0c]/40 to-transparent"></div>
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-50 size-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col gap-4">
           <h1 className="text-4xl sm:text-7xl font-black italic tracking-tighter uppercase drop-shadow-2xl">{info.name}</h1>
           <p className="text-sm text-gray-400 font-medium line-clamp-3 max-w-2xl">{info.plot}</p>
        </div>
      </div>

      <div className="px-8 mt-8 flex flex-col gap-10">
        <section>
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {seasons.map(s => (
                <button 
                  key={s}
                  onClick={() => handleSeasonChange(s)}
                  className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${selectedSeason === s ? 'bg-primary border-primary shadow-xl shadow-primary/30' : 'bg-surface-dark border-white/5 text-gray-500'}`}
                >
                  Temporada {s}
                </button>
              ))}
           </div>
        </section>

        <section ref={episodeListRef}>
           <div className="flex flex-col gap-4">
              {currentEpisodes.map((ep) => (
                <div 
                  key={ep.id}
                  onClick={() => { setCurrentEpisode(ep); setIsPlaying(true); }}
                  className="flex items-center gap-5 bg-surface-dark/40 p-3 rounded-3xl border border-white/5 hover:border-primary/40 transition-all group cursor-pointer"
                >
                   <div className="size-24 shrink-0 rounded-2xl overflow-hidden relative">
                      <img src={ep.info?.movie_image || info.cover} className="w-full h-full object-cover" alt={ep.title} />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="material-symbols-outlined text-white filled text-3xl">play_arrow</span>
                      </div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-base font-black truncate uppercase group-hover:text-primary transition-colors">{ep.episode_num}. {ep.title || `Episódio ${ep.episode_num}`}</h4>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-1 italic">{ep.info?.plot || `Assista ao episódio ${ep.episode_num}.`}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default SeriesDetails;
