
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { xtream } from '../services/XtreamService';
import VideoPlayer from '../components/VideoPlayer';

const DetailsScreen: React.FC = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadDetails();
    window.scrollTo(0, 0);
  }, [id, type]);

  const loadDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      if (type === 'movie') {
        const response = await xtream.getVodInfo(id);
        const info = response.info || response;
        setContent({
          ...info,
          stream_id: id,
          name: info.name || info.title,
          plot: info.plot || info.description,
          thumbnail: info.movie_image || info.stream_icon
        });
      }
    } catch (e) {
      console.error("Erro ao carregar detalhes:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(212,17,66,0.3)]"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recuperando Metadados...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-700 mb-4">error</span>
        <h2 className="text-xl font-bold mb-2">Conteúdo não encontrado</h2>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-primary rounded-xl font-bold uppercase text-xs">Voltar</button>
      </div>
    );
  }

  const streamUrl = xtream.buildStreamUrl(id!, 'movie');

  return (
    <div className="min-h-screen bg-background-dark pb-24 transition-all duration-500">
      {isPlaying ? (
        <div className="fixed inset-0 z-[100] bg-black">
           <VideoPlayer 
             contentId={`vod_${id}`}
             url={streamUrl}
             title={content.name}
             poster={content.thumbnail}
             isLive={false}
             onClose={() => setIsPlaying(false)}
           />
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          <div className="relative w-full h-[60vh]">
            <div className="absolute top-0 left-0 w-full z-20 p-4 flex justify-between items-center">
              <button onClick={() => navigate(-1)} className="size-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-transform text-white">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            </div>
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-[8s] scale-105" 
              style={{backgroundImage: `url(${content.thumbnail})`}}
            ></div>
            <div className="absolute inset-0 hero-gradient"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start gap-4">
               <div className="flex items-center gap-3">
                 <span className="bg-green-500 text-black font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">Disponível</span>
                 <span className="text-gray-400 text-xs font-bold">{content.releasedate || content.year || '2024'}</span>
                 <span className="border border-white/20 rounded px-1.5 py-0.5 text-[9px] text-white font-black">4K UHD</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black leading-none drop-shadow-2xl uppercase italic tracking-tighter text-white">{content.name}</h1>
               <div className="flex w-full gap-3 mt-2">
                 <button 
                   onClick={() => setIsPlaying(true)}
                   className="flex-1 bg-primary text-white font-black h-14 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transform active:scale-95 transition-all uppercase"
                 >
                    <span className="material-symbols-outlined filled">play_arrow</span> Assistir Agora
                 </button>
                 <button className="size-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white">
                   <span className="material-symbols-outlined">favorite</span>
                 </button>
               </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-white">
               <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Sinopse</h3>
               <p className="text-gray-400 text-sm font-medium leading-relaxed opacity-80">
                 {content.plot || 'Nenhuma descrição disponível para este título.'}
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-surface-dark p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Gênero</p>
                  <p className="text-xs font-bold text-white truncate">{content.genre || 'Filme'}</p>
               </div>
               <div className="bg-surface-dark p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Avaliação</p>
                  <div className="flex items-center gap-1 text-yellow-500 font-black text-sm">
                     <span className="material-symbols-outlined text-sm filled">star</span>
                     {content.rating || '8.5'}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsScreen;
