
import React, { useState, useEffect, useContext } from 'react';
import { xtream } from '../services/XtreamService';
import { reiService } from '../services/ReiService';
import { portugalService } from '../services/PortugalService';
import { XtreamStream, XtreamCategory, ReiChannel } from '../types';
import { AppContext } from '../App';
import VideoPlayer from '../components/VideoPlayer';

const LiveTVScreen: React.FC = () => {
  const { liveCategories } = useContext(AppContext);
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any | null>(null);
  const [activeCat, setActiveCat] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const REI_CAT_ID = 'rei_dos_canais';
  const PT_CAT_ID = 'portugal_free';

  useEffect(() => {
    // Carrega a primeira categoria de Portugal por padrão
    setActiveCat(PT_CAT_ID);
    loadChannels(PT_CAT_ID);
  }, []);

  const loadChannels = async (catId: string) => {
    setLoading(true);
    try {
      let data: any[] = [];
      if (catId === REI_CAT_ID) {
        data = await reiService.getChannels();
      } else if (catId === PT_CAT_ID) {
        data = await portugalService.getChannels();
      } else {
        data = await xtream.getLiveStreams(catId);
      }
      
      setChannels(data);
      if (data.length > 0) {
        setActiveChannel(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCatChange = (id: string) => {
    if (id === activeCat) return;
    setActiveCat(id);
    loadChannels(id);
  };

  const navigateChannel = (direction: 'next' | 'prev') => {
    if (channels.length === 0 || !activeChannel) return;
    
    const currentIndex = channels.findIndex(ch => 
      (ch.stream_id && String(ch.stream_id) === String(activeChannel.stream_id)) || 
      (ch.name === activeChannel.name)
    );

    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % channels.length;
    } else {
      nextIndex = (currentIndex - 1 + channels.length) % channels.length;
    }
    
    setActiveChannel(channels[nextIndex]);
  };

  const getStreamUrl = (ch: any) => {
    if (!ch) return '';
    if (ch.stream && typeof ch.stream === 'string') return ch.stream;
    return xtream.buildStreamUrl(ch.stream_id, 'live');
  };

  return (
    <div className="min-h-screen bg-background-dark pb-24 flex flex-col">
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-background-dark/95 backdrop-blur-md sticky top-0 z-30">
        <h1 className="text-xl font-black uppercase italic tracking-tighter">TV AO VIVO<span className="text-primary">.</span></h1>
        <button onClick={() => loadChannels(activeCat)} className="text-white opacity-40 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </header>

      <div className="sticky top-[68px] z-40 aspect-video w-full bg-black shadow-2xl">
         {activeChannel ? (
           <VideoPlayer 
             key={activeChannel.stream_id || activeChannel.name}
             url={getStreamUrl(activeChannel)}
             title={activeChannel.name}
             poster={activeChannel.stream_icon || activeChannel.cover}
             isLive={true}
             onNext={() => navigateChannel('next')}
             onPrev={() => navigateChannel('prev')}
           />
         ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-dark gap-4">
               <div className="w-10 h-10 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Aguardando sinal...</p>
            </div>
         )}
      </div>

      <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-white/5 bg-surface-dark/30">
        <button 
          onClick={() => handleCatChange(PT_CAT_ID)}
          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${activeCat === PT_CAT_ID ? 'bg-gradient-to-r from-green-600 to-red-600 text-white shadow-lg' : 'bg-surface-dark text-green-500 border border-green-500/20'}`}
        >
          <span className="material-symbols-outlined text-sm filled">flag</span>
          PORTUGAL
        </button>

        <button 
          onClick={() => handleCatChange(REI_CAT_ID)}
          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${activeCat === REI_CAT_ID ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-lg' : 'bg-surface-dark text-yellow-500 border border-yellow-500/20'}`}
        >
          <span className="material-symbols-outlined text-sm filled">crown</span>
          REI DOS CANAIS
        </button>

        {liveCategories.map((cat) => (
          <button 
            key={cat.category_id}
            onClick={() => handleCatChange(cat.category_id)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCat === cat.category_id ? 'bg-primary text-white shadow-lg' : 'bg-surface-dark text-gray-500 border border-white/5'}`}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      <div className="flex-1 px-2 pt-2 space-y-1 overflow-y-auto">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase text-gray-500">Sintonizando...</p>
          </div>
        ) : (
          channels.map((ch) => {
            const isSelected = (activeChannel?.stream_id === ch.stream_id) || (activeChannel?.name === ch.name);
            const logo = ch.stream_icon || ch.cover || 'https://via.placeholder.com/100?text=TV';
            
            return (
              <div 
                key={ch.stream_id || ch.name} 
                onClick={() => setActiveChannel(ch)}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer border border-transparent ${isSelected ? 'bg-primary/10 border-primary/20 shadow-xl' : 'hover:bg-white/5'}`}
              >
                <div className="w-16 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                   <img 
                    src={logo} 
                    className="w-full h-full object-contain p-1" 
                    alt={ch.name} 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=TV'; }}
                    loading="lazy" 
                   />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className={`font-bold text-sm truncate uppercase tracking-tighter ${isSelected ? 'text-primary' : 'text-white'}`}>{ch.name}</h4>
                   <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{ch.folder || 'Digital'}</span>
                </div>
                {isSelected && <div className="size-2 rounded-full bg-primary animate-pulse"></div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LiveTVScreen;
