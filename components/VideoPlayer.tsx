
import React, { useState, useRef, useEffect } from 'react';
import Hls from 'https://esm.sh/hls.js@1';

interface Props {
  contentId?: string;
  url: string;
  poster?: string;
  title?: string;
  isLive?: boolean;
  onClose?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const VideoPlayer: React.FC<Props> = ({ contentId, url, poster, title, isLive = false, onClose, onNext, onPrev }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [osd, setOsd] = useState<{ type: 'skip' | 'back', show: boolean }>({ type: 'skip', show: false });
  
  const controlsTimeoutRef = useRef<number | null>(null);
  const loadingTimeoutRef = useRef<number | null>(null);

  // Sistema de Favoritos Persistente
  useEffect(() => {
    if (contentId) {
      const favs = JSON.parse(localStorage.getItem('uni_favorites') || '[]');
      setIsFavorite(favs.includes(contentId));
    }
  }, [contentId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentId) return;
    const favs = JSON.parse(localStorage.getItem('uni_favorites') || '[]');
    const newFavs = isFavorite ? favs.filter((id: string) => id !== contentId) : [...favs, contentId];
    localStorage.setItem('uni_favorites', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  // Lógica de Reprodução e HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Reset de estado ao trocar de URL
    setIsLoading(true);
    setErrorCount(0);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Segurança: Se em 12 segundos não carregar, remove o loading para não travar a UI
    if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
    }, 12000);

    const isHls = url.toLowerCase().includes('.m3u8') || url.toLowerCase().includes('.ts');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({ 
        enableWorker: true, 
        lowLatencyMode: true,
        backBufferLength: 60,
        manifestLoadingMaxRetry: 4,
        manifestLoadingRetryDelay: 1000,
        xhrSetup: (xhr) => { xhr.withCredentials = false; }
      });

      hls.loadSource(url);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);
        video.play().catch(() => { 
          video.muted = true; 
          setIsMuted(true); 
          video.play(); 
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setErrorCount(prev => prev + 1);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("Erro de rede fatal, tentando recuperar...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("Erro de mídia fatal, tentando recuperar...");
              hls.recoverMediaError();
              break;
            default:
              console.error("Erro irrecuperável:", data);
              setIsLoading(false);
              hls.destroy();
              break;
          }
        }
      });
    } else {
      // Fallback para streams nativos (Safari ou MP4)
      video.src = url;
      video.load();
      
      const onCanPlay = () => { 
        setIsLoading(false); 
        if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);
        video.play().catch(() => {}); 
      };
      
      const onError = () => {
        setIsLoading(false);
        if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);
      };

      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('error', onError);
      
      return () => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('error', onError);
      };
    }

    return () => { 
      if (hlsRef.current) hlsRef.current.destroy(); 
      if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);
    };
  }, [url]);

  const triggerControls = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 4000);
  };

  const seek = (seconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && !isLive) {
      videoRef.current.currentTime += seconds;
      setOsd({ type: seconds > 0 ? 'skip' : 'back', show: true });
      setTimeout(() => setOsd(p => ({ ...p, show: false })), 600);
      triggerControls();
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
      triggerControls();
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-black group overflow-hidden touch-none select-none"
      onClick={handlePlayPause}
      onMouseMove={triggerControls}
    >
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        crossOrigin="anonymous"
        className="w-full h-full object-contain pointer-events-none"
        onTimeUpdate={() => {
          if (videoRef.current && videoRef.current.duration) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onStalled={() => setIsLoading(true)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Loading Centralizado Proeminente */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-[60] bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-300">
             <div className="relative">
                <div className="size-24 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="size-12 bg-primary/40 rounded-full blur-2xl animate-pulse"></div>
                </div>
             </div>
             <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Sintonizando Sinal</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 animate-pulse">
                  {errorCount > 0 ? `Tentativa de Recuperação #${errorCount}` : 'Otimizando Buffer...'}
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Feedback de Skip (OSD) */}
      {osd.show && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
           <div className="size-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-5xl text-white">
                {osd.type === 'skip' ? 'forward_10' : 'replay_10'}
              </span>
           </div>
        </div>
      )}

      <div className={`absolute inset-0 z-30 transition-opacity duration-700 bg-gradient-to-t from-black/95 via-transparent to-black/70 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between pointer-events-auto">
           <div className="flex items-center gap-5">
             {onClose && (
               <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="size-12 bg-white/5 hover:bg-primary/20 rounded-2xl transition-all border border-white/10 backdrop-blur-md flex items-center justify-center active:scale-90">
                 <span className="material-symbols-outlined text-white">arrow_back</span>
               </button>
             )}
             <div className="min-w-0">
               <h3 className="text-lg font-black uppercase tracking-tighter text-white truncate drop-shadow-lg">{title || 'Transmitindo...'}</h3>
               {isLive && (
                 <span className="text-[10px] font-black text-primary flex items-center gap-2 mt-1 uppercase tracking-widest">
                   <div className="size-2 rounded-full bg-primary animate-ping"></div> SINAL AO VIVO
                 </span>
               )}
             </div>
           </div>

           <button 
             onClick={toggleFavorite}
             className={`size-12 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-center transition-all active:scale-90 ${isFavorite ? 'bg-primary/20 border-primary' : 'bg-white/5 hover:bg-white/10'}`}
           >
             <span className={`material-symbols-outlined ${isFavorite ? 'text-primary filled' : 'text-white'}`}>favorite</span>
           </button>
        </div>

        {/* Center Play/Skip Buttons */}
        {!isLive && (
          <div className="absolute inset-0 flex items-center justify-center gap-16 pointer-events-none">
            <button onClick={(e) => seek(-10, e)} className="pointer-events-auto size-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all active:scale-90 group/skip">
              <span className="material-symbols-outlined text-3xl">replay_10</span>
            </button>
            <div className="size-20 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="material-symbols-outlined text-white text-5xl filled">{isPlaying ? 'pause' : 'play_arrow'}</span>
            </div>
            <button onClick={(e) => seek(10, e)} className="pointer-events-auto size-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all active:scale-90 group/skip">
              <span className="material-symbols-outlined text-3xl">forward_10</span>
            </button>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-6 pointer-events-auto" onClick={e => e.stopPropagation()}>
          {!isLive && (
            <div className="relative w-full h-3 group/progress flex items-center cursor-pointer">
               <div className="absolute inset-0 h-1 bg-white/10 rounded-full my-auto"></div>
               <div className="absolute left-0 h-1 rounded-full bg-primary my-auto" style={{ width: `${progress}%` }}></div>
               <div 
                 className="absolute size-4 bg-white rounded-full border-2 border-primary shadow-xl opacity-0 group-hover/progress:opacity-100 transition-opacity" 
                 style={{ left: `calc(${progress}% - 8px)` }}
               ></div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button onClick={handlePlayPause} className="text-white hover:text-primary transition-all scale-125 active:scale-100">
                <span className="material-symbols-outlined text-5xl filled">{isPlaying ? 'pause' : 'play_arrow'}</span>
              </button>
              
              <div className="flex items-center gap-4">
                 <button onClick={() => { setIsMuted(!isMuted); if(videoRef.current) videoRef.current.muted = !isMuted; }} className="text-white/60 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">{isMuted ? 'volume_off' : 'volume_up'}</span>
                 </button>
                 {isLive && (
                   <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Direto</span>
                   </div>
                 )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               {onNext && (
                 <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="text-white/60 hover:text-white">
                    <span className="material-symbols-outlined">skip_next</span>
                 </button>
               )}
               <button onClick={() => videoRef.current?.requestFullscreen()} className="text-white/60 hover:text-white active:scale-90 transition-transform">
                 <span className="material-symbols-outlined">fullscreen</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
