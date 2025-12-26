
import React, { useContext, useState } from 'react';
import { MOCK_USER } from '../constants';
import { AppContext } from '../App';

const ProfileScreen: React.FC = () => {
  const { isKidsMode, setKidsMode, requestExitKidsMode, kidsPin, updateKidsPin } = useContext(AppContext);
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [pinForm, setPinForm] = useState({ current: '', new: '' });
  const [pinError, setPinError] = useState('');

  const toggleKidsMode = () => {
    if (isKidsMode) {
      requestExitKidsMode();
    } else {
      setKidsMode(true);
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    
    if (pinForm.current !== kidsPin) {
      setPinError('PIN atual incorreto');
      return;
    }
    
    if (pinForm.new.length !== 4 || isNaN(Number(pinForm.new))) {
      setPinError('O novo PIN deve ter 4 dígitos');
      return;
    }

    updateKidsPin(pinForm.new);
    setIsEditingPin(false);
    setPinForm({ current: '', new: '' });
    alert('PIN Parental atualizado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background-dark pb-32">
      <header className="p-4 flex items-center justify-between border-b border-white/5 sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md">
        <h1 className="text-xl font-bold">Meu Perfil</h1>
        <span className="material-symbols-outlined">settings</span>
      </header>

      <div className="flex flex-col items-center pt-8 pb-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative mb-4">
           <div className={`size-28 rounded-full border-2 p-1 bg-surface-dark shadow-2xl ${isKidsMode ? 'border-yellow-400 shadow-yellow-400/20' : 'border-primary shadow-primary/20'}`}>
             <img src={isKidsMode ? 'https://picsum.photos/id/102/200/200' : MOCK_USER.avatar} className="w-full h-full rounded-full object-cover" />
           </div>
           <div className={`absolute bottom-1 right-1 size-8 rounded-full border-2 border-background-dark flex items-center justify-center shadow-lg ${isKidsMode ? 'bg-yellow-400' : 'bg-primary'}`}>
             <span className="material-symbols-outlined text-white text-sm">edit</span>
           </div>
        </div>
        <h2 className="text-2xl font-black text-white">{isKidsMode ? 'Pequeno Explorador' : MOCK_USER.name}</h2>
        <div className="mt-2 flex items-center gap-2">
           <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${isKidsMode ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'}`}>
             {isKidsMode ? 'PERFIL KIDS' : 'VIP PREMIUM'}
           </span>
           {!isKidsMode && <span className="text-gray-500 text-xs font-medium">Até {MOCK_USER.expiryDate}</span>}
        </div>
      </div>

      <div className="px-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 mb-2">Segurança</h3>
           <div className="bg-surface-dark border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
              <div 
                onClick={toggleKidsMode}
                className="flex items-center justify-between p-5 hover:bg-white/5 cursor-pointer transition-colors group"
              >
                 <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined transition-colors ${isKidsMode ? 'text-yellow-400' : 'text-gray-400 group-hover:text-primary'}`}>child_care</span>
                    <span className="text-sm font-bold text-gray-200">Modo Kids (Parental)</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase ${isKidsMode ? 'text-yellow-400' : 'text-gray-500'}`}>{isKidsMode ? 'ATIVADO' : 'DESATIVADO'}</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${isKidsMode ? 'bg-yellow-400' : 'bg-white/10'}`}>
                       <div className={`absolute top-1 size-3 rounded-full bg-white transition-all ${isKidsMode ? 'left-6' : 'left-1'}`} />
                    </div>
                 </div>
              </div>

              {!isKidsMode && (
                <div className="flex flex-col">
                  <div 
                    onClick={() => setIsEditingPin(!isEditingPin)}
                    className="flex items-center justify-between p-5 hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">lock_open</span>
                        <span className="text-sm font-bold text-gray-200">Alterar PIN Parental</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-600 text-lg">{isEditingPin ? 'expand_less' : 'chevron_right'}</span>
                  </div>
                  
                  {isEditingPin && (
                    <div className="p-5 bg-black/20 animate-in fade-in slide-in-from-top-2">
                       <form onSubmit={handleUpdatePin} className="flex flex-col gap-4">
                          <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1 block">PIN Atual</label>
                                <input 
                                  type="password" 
                                  maxLength={4}
                                  value={pinForm.current}
                                  onChange={(e) => setPinForm({...pinForm, current: e.target.value})}
                                  className="w-full bg-surface-dark border border-white/10 rounded-xl h-10 px-3 text-center font-bold text-primary focus:border-primary focus:ring-0"
                                  placeholder="****"
                                />
                             </div>
                             <div>
                                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1 block">Novo PIN</label>
                                <input 
                                  type="password" 
                                  maxLength={4}
                                  value={pinForm.new}
                                  onChange={(e) => setPinForm({...pinForm, new: e.target.value})}
                                  className="w-full bg-surface-dark border border-white/10 rounded-xl h-10 px-3 text-center font-bold text-primary focus:border-primary focus:ring-0"
                                  placeholder="****"
                                />
                             </div>
                          </div>
                          {pinError && <p className="text-[10px] text-primary font-bold uppercase text-center">{pinError}</p>}
                          <button type="submit" className="w-full py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 transform active:scale-95 transition-all">Salvar Novo PIN</button>
                       </form>
                    </div>
                  )}
                </div>
              )}
           </div>
        </div>

        {!isKidsMode && (
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 mb-2">Preferências</h3>
            <div className="bg-surface-dark border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                {[
                  { n: 'Minha Conta', i: 'person', s: '' },
                  { n: 'Idioma', i: 'language', s: 'Português (BR)' },
                  { n: 'Teste de Velocidade', i: 'speed', s: '' },
                  { n: 'Sobre o App', i: 'info', s: 'v4.2.0' }
                ].map(item => (
                  <div key={item.n} className="flex items-center justify-between p-5 hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">{item.i}</span>
                        <span className="text-sm font-bold text-gray-200">{item.n}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">{item.s}</span>
                        <span className="material-symbols-outlined text-gray-600 text-lg">chevron_right</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <button 
          onClick={() => isKidsMode ? toggleKidsMode() : window.location.reload()}
          className="w-full py-4 mt-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all transform active:scale-95"
        >
          {isKidsMode ? 'Sair do Modo Kids' : 'Sair da Conta'}
        </button>
      </div>
      
      <div className="h-10"></div>
    </div>
  );
};

export default ProfileScreen;
