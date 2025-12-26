
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

const PinModal: React.FC<Props> = ({ onSuccess, onClose }) => {
  const { kidsPin } = useContext(AppContext);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === kidsPin) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xs bg-surface-dark border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center">
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
           <span className="material-symbols-outlined text-primary text-3xl">lock</span>
        </div>
        <h2 className="text-xl font-black mb-2">Controle Parental</h2>
        <p className="text-gray-500 text-xs text-center mb-8">Digite o PIN de 4 dígitos para sair do Modo Kids</p>

        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`size-4 rounded-full border-2 transition-all duration-300 ${
                error ? 'bg-red-500 border-red-500 scale-110' :
                pin.length > i ? 'bg-primary border-primary scale-110' : 'border-white/20'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button 
              key={num} 
              onClick={() => handleKeyPress(num)}
              className="size-14 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xl font-bold active:bg-primary active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <button onClick={onClose} className="size-14 rounded-full flex items-center justify-center text-gray-500 font-bold active:scale-95"><span className="material-symbols-outlined">close</span></button>
          <button onClick={() => handleKeyPress('0')} className="size-14 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xl font-bold active:bg-primary active:scale-95 transition-all">0</button>
          <button onClick={handleDelete} className="size-14 rounded-full flex items-center justify-center text-primary active:scale-95"><span className="material-symbols-outlined">backspace</span></button>
        </div>
        
        <p className="mt-8 text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">Segurança Ativa</p>
      </div>
    </div>
  );
};

export default PinModal;
