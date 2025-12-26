
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const KidsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isKidsMode, setKidsMode, requestExitKidsMode } = useContext(AppContext);
  const [cartoonIndex, setCartoonIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Sample data for drawings
  const drawings = [1, 2, 3, 4, 5, 6, 7, 8];
  const itemsPerPage = 2; // Showing 2 items at a time on mobile
  const maxIndex = Math.ceil(drawings.length / itemsPerPage) - 1;

  const handleParentalClick = () => {
    if (isKidsMode) {
      requestExitKidsMode();
    } else {
      setKidsMode(true);
      navigate('/home');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const nextCartoon = () => {
    setCartoonIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const prevCartoon = () => {
    setCartoonIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  return (
    <div className="min-h-screen bg-[#0f0a0c] pb-24">
      <header className="p-4 flex items-center justify-between sticky top-0 z-30 bg-[#0f0a0c]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter italic uppercase">Aventura das <span className="text-primary">Crianças</span></h1>
        </div>
        <button 
          onClick={handleParentalClick}
          className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-white/10 active:scale-95"
        >
          <span>{isKidsMode ? 'Sair' : 'Pais'}</span>
          <span className="material-symbols-outlined text-sm">{isKidsMode ? 'exit_to_app' : 'lock'}</span>
        </button>
      </header>

      {/* Internal Navigation Shortcuts */}
      <div className="px-4 py-3 flex gap-3 overflow-x-auto no-scrollbar sticky top-[72px] z-20 bg-[#0f0a0c]/80 backdrop-blur-sm border-b border-white/5">
        <button 
          onClick={() => scrollToSection('personagens')}
          className="px-5 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 whitespace-nowrap transition-all hover:bg-blue-500/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm filled">face</span>
          Personagens
        </button>
        <button 
          onClick={() => scrollToSection('desenhos')}
          className="px-5 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 whitespace-nowrap transition-all hover:bg-yellow-500/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm filled">movie</span>
          Desenhos
        </button>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-8">
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-white/5">
           <img src="https://picsum.photos/id/102/800/450" className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt="Banner" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a0c] via-transparent to-transparent"></div>
           <div className="absolute bottom-6 left-6 flex flex-col items-start gap-2">
              <span className="px-2 py-1 bg-yellow-400 text-black text-[10px] font-black rounded-full uppercase tracking-wider">Super Novidade</span>
              <h2 className="text-3xl font-black text-white drop-shadow-lg uppercase italic tracking-tighter">Aventura Mágica</h2>
              <button className="mt-2 bg-white text-black px-6 py-2.5 rounded-xl font-black flex items-center gap-2 transform active:scale-95 shadow-lg shadow-white/10 uppercase text-xs">
                <span className="material-symbols-outlined filled text-primary">play_arrow</span> Assistir Agora
              </button>
           </div>
        </div>

        <section id="personagens" className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-400 text-lg filled">face</span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase italic">Nossos Amigos</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
             {[
               { n: 'Mickey', c: 'blue' },
               { n: 'Elsa', c: 'cyan' },
               { n: 'Batman', c: 'yellow' },
               { n: 'Spider', c: 'red' },
               { n: 'Bob', c: 'green' }
             ].map((char, i) => (
               <div key={i} className="flex flex-col items-center gap-2 shrink-0 group">
                  <div className="size-24 rounded-full p-1 border-2 border-transparent group-hover:border-primary transition-all cursor-pointer bg-white/5">
                    <img src={`https://picsum.photos/id/${i+50}/200/200`} className="w-full h-full rounded-full object-cover shadow-lg transform group-hover:scale-90 transition-transform" alt={char.n} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-blue-400 transition-colors">{char.n}</span>
               </div>
             ))}
          </div>
        </section>

        <section id="desenhos" className="scroll-mt-32 relative group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-400 text-lg filled">movie</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight uppercase italic">Desenhos Animados</h3>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex gap-2">
               <button 
                 onClick={prevCartoon}
                 className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
               >
                 <span className="material-symbols-outlined text-sm">chevron_left</span>
               </button>
               <button 
                 onClick={nextCartoon}
                 className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
               >
                 <span className="material-symbols-outlined text-sm">chevron_right</span>
               </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="overflow-hidden relative rounded-2xl">
            <div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${cartoonIndex * 100}%)` }}
            >
              {/* Rendering in batches of 2 for mobile compatibility */}
              {Array.from({ length: Math.ceil(drawings.length / itemsPerPage) }).map((_, pageIdx) => (
                <div key={pageIdx} className="grid grid-cols-2 gap-4 w-full shrink-0">
                  {drawings.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).map((i) => (
                    <div key={i} className="aspect-video bg-surface-dark rounded-2xl overflow-hidden relative border border-white/5 active:scale-95 transition-all group cursor-pointer shadow-lg hover:border-yellow-500/50">
                      <img src={`https://picsum.photos/id/${i+60}/400/225`} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" alt={`Desenho ${i}`} />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                        <span className="material-symbols-outlined text-white text-4xl filled opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">play_circle</span>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-[10px] font-black text-white uppercase truncate">Episódio Especial {i}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
             {Array.from({ length: Math.ceil(drawings.length / itemsPerPage) }).map((_, i) => (
               <div 
                 key={i} 
                 className={`h-1 rounded-full transition-all duration-300 ${cartoonIndex === i ? 'w-6 bg-primary' : 'w-2 bg-white/10'}`} 
               />
             ))}
          </div>
        </section>
      </div>
      <div className="h-10"></div>
    </div>
  );
};

export default KidsScreen;
