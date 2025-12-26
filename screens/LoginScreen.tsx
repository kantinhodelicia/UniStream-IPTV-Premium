
import React, { useState, useContext } from 'react';
import { xtream } from '../services/XtreamService';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

const LoginScreen: React.FC = () => {
  const { setAuth } = useContext(AppContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      xtream.setCredentials(username, password);
      const data = await xtream.login();
      localStorage.setItem('uni_auth', JSON.stringify({ u: username, p: password }));
      setAuth(data);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background-dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574375927938-d5a98e898ad7?q=80&w=1200')] bg-cover bg-center opacity-20 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/90 to-background-dark/40"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 mb-4 transform rotate-3">
            <span className="material-symbols-outlined text-white text-5xl">live_tv</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-1 uppercase italic">UniStream</h1>
          <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">Premium IPTV Player</p>
        </div>

        <div className="w-full bg-surface-dark/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-lg text-center uppercase tracking-wider">
                {error}
              </div>
            )}
            
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Usuário</label>
              <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 transition-all">
                <span className="material-symbols-outlined text-gray-500 text-[20px] group-focus-within:text-primary">account_circle</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 h-12" 
                  placeholder="Seu usuário Xtream" 
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Senha</label>
              <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 transition-all">
                <span className="material-symbols-outlined text-gray-500 text-[20px] group-focus-within:text-primary">lock</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 h-12" 
                  placeholder="Sua senha" 
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-black h-14 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 text-lg uppercase disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Entrar</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
             <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Conectando ao XUI Panel</p>
             <p className="text-gray-600 text-[9px] text-center max-w-[200px]">Certifique-se de que sua conta está ativa com o provedor.</p>
          </div>
        </div>
        
        <p className="mt-8 text-gray-700 text-[10px] font-bold uppercase tracking-widest">UniStream Digital © 2024</p>
      </div>
    </div>
  );
};

export default LoginScreen;
