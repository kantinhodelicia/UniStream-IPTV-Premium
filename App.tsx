
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthData, XtreamCategory, XtreamStream, XtreamSeries } from './types';
import { xtream } from './services/XtreamService';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MoviesScreen from './screens/MoviesScreen';
import SeriesScreen from './screens/SeriesScreen';
import KidsScreen from './screens/KidsScreen';
import LiveTVScreen from './screens/LiveTVScreen';
import ProfileScreen from './screens/ProfileScreen';
import DetailsScreen from './screens/DetailsScreen';
import PinModal from './components/PinModal';
import Explore from './screens/Explore';
import DynamicContentPage from './screens/DynamicContentPage';
import SeriesDetails from './screens/SeriesDetails';

interface AppContextType {
  auth: AuthData | null;
  setAuth: (data: AuthData | null) => void;
  isKidsMode: boolean;
  setKidsMode: (val: boolean) => void;
  requestExitKidsMode: () => void;
  kidsPin: string;
  updateKidsPin: (newPin: string) => void;
  liveCategories: XtreamCategory[];
  vodCategories: XtreamCategory[];
  seriesCategories: XtreamCategory[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

export const AppContext = createContext<AppContextType>({} as any);

const BottomNavigation = ({ isKidsMode }: { isKidsMode: boolean }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#140a0b]/95 backdrop-blur-xl border-t border-white/5 z-50 pb-6 pt-2">
      <div className="flex justify-around items-center px-4">
        <Link to="/home" className={`flex flex-col items-center gap-1 group ${isActive('/home') ? 'text-primary' : 'text-gray-500'}`}>
          <span className={`material-symbols-outlined text-[26px] transition-transform group-hover:scale-110 ${isActive('/home') ? 'filled' : ''}`}>home</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Início</span>
        </Link>
        
        {!isKidsMode && (
          <Link to="/explore" className={`flex flex-col items-center gap-1 group ${isActive('/explore') ? 'text-primary' : 'text-gray-500'}`}>
            <span className={`material-symbols-outlined text-[26px] transition-transform group-hover:scale-110 ${isActive('/explore') ? 'filled' : ''}`}>explore</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Explorar</span>
          </Link>
        )}

        <Link to={isKidsMode ? "/home" : "/livetv"} className="relative -top-5">
           <div className={`flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 border-4 border-[#120a0c] ${isKidsMode ? 'bg-yellow-500 shadow-yellow-500/20' : ''}`}>
             <span className="material-symbols-outlined text-[28px] filled">{isKidsMode ? 'smart_toy' : 'play_arrow'}</span>
           </div>
        </Link>

        {!isKidsMode && (
          <Link to="/series" className={`flex flex-col items-center gap-1 group ${isActive('/series') ? 'text-primary' : 'text-gray-500'}`}>
            <span className={`material-symbols-outlined text-[26px] transition-transform group-hover:scale-110 ${isActive('/series') ? 'filled' : ''}`}>theaters</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Séries</span>
          </Link>
        )}

        <Link to="/profile" className={`flex flex-col items-center gap-1 group ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}>
          <span className={`material-symbols-outlined text-[26px] transition-transform group-hover:scale-110 ${isActive('/profile') ? 'filled' : ''}`}>person</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Perfil</span>
        </Link>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [kidsPin, setKidsPin] = useState('1234');
  const [showPinModal, setShowPinModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [liveCategories, setLiveCategories] = useState<XtreamCategory[]>([]);
  const [vodCategories, setVodCategories] = useState<XtreamCategory[]>([]);
  const [seriesCategories, setSeriesCategories] = useState<XtreamCategory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('uni_auth');
    if (saved) {
      const { u, p } = JSON.parse(saved);
      xtream.setCredentials(u, p);
      xtream.login().then(data => {
        setAuth(data);
      }).catch(err => {
        console.error("Auto-login failed", err);
        localStorage.removeItem('uni_auth');
      });
    }

    const savedPin = localStorage.getItem('uni_kids_pin');
    if (savedPin) {
      setKidsPin(savedPin);
    }
  }, []);

  useEffect(() => {
    if (auth) {
      refreshData();
    }
  }, [auth]);

  const updateKidsPin = (newPin: string) => {
    setKidsPin(newPin);
    localStorage.setItem('uni_kids_pin', newPin);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [live, vod, series] = await Promise.all([
        xtream.getLiveCategories(),
        xtream.getVodCategories(),
        xtream.getSeriesCategories()
      ]);
      setLiveCategories(live);
      setVodCategories(vod);
      setSeriesCategories(series);
    } catch (e) {
      console.error("Failed to load categories", e);
    } finally {
      setLoading(false);
    }
  };

  const requestExitKidsMode = () => setShowPinModal(true);
  const handlePinSuccess = () => {
    setIsKidsMode(false);
    setShowPinModal(false);
  };

  return (
    <AppContext.Provider value={{ 
      auth, setAuth, 
      isKidsMode, setKidsMode: setIsKidsMode, requestExitKidsMode,
      kidsPin, updateKidsPin,
      liveCategories, vodCategories, seriesCategories,
      loading, refreshData
    }}>
      <Router>
        <div className="min-h-screen bg-background-dark font-display text-white selection:bg-primary">
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/home" element={auth ? <HomeScreen /> : <Navigate to="/login" />} />
            <Route path="/movies" element={auth && !isKidsMode ? <MoviesScreen /> : <Navigate to="/home" />} />
            <Route path="/series" element={auth && !isKidsMode ? <SeriesScreen /> : <Navigate to="/home" />} />
            <Route path="/kids" element={auth ? <KidsScreen /> : <Navigate to="/login" />} />
            <Route path="/livetv" element={auth && !isKidsMode ? <LiveTVScreen /> : <Navigate to="/home" />} />
            <Route path="/profile" element={auth ? <ProfileScreen /> : <Navigate to="/login" />} />
            <Route path="/details/:type/:id" element={auth ? <DetailsScreen /> : <Navigate to="/login" />} />
            <Route path="/explore" element={auth ? <Explore /> : <Navigate to="/login" />} />
            <Route path="/dynamic-content/:type/:catId" element={auth ? <DynamicContentPage /> : <Navigate to="/login" />} />
            <Route path="/series-details/:id" element={auth ? <SeriesDetails /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
          {auth && <BottomNavigation isKidsMode={isKidsMode} />}
          {showPinModal && <PinModal onSuccess={handlePinSuccess} onClose={() => setShowPinModal(false)} />}
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
