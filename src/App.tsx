/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import GachaScreen from './screens/GachaScreen';
import BackpackScreen from './screens/BackpackScreen';
import Drawer from './components/Drawer';
import BottomNav from './components/BottomNav';
import RankingScreen from './screens/RankingScreen';
import CheckInScreen from './screens/CheckInScreen';
import GlowSticksRecordModal from './components/GlowSticksRecordModal';

export type ScreenState = 'login' | 'home' | 'gacha' | 'backpack' | 'ranking' | 'checkin';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('login');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showGlowSticksRecord, setShowGlowSticksRecord] = useState(false);
  
  // Shared global state
  const [glowSticks, setGlowSticks] = useState(240);

  useEffect(() => {
    const handleShowRecord = () => setShowGlowSticksRecord(true);
    window.addEventListener('SHOW_GLOW_STICKS', handleShowRecord);
    return () => window.removeEventListener('SHOW_GLOW_STICKS', handleShowRecord);
  }, []);

  const handleLogin = () => {
    setIsTransitioning(true);
    // Let the ripple animation play before swapping screen
    setTimeout(() => {
      setCurrentScreen('home');
      setIsTransitioning(false);
    }, 800);
  };

  const navigateTo = (screen: ScreenState) => {
    setCurrentScreen(screen);
    setIsDrawerOpen(false); // Make sure drawer closes when navigating anywhere
  };

  const showBottomNav = currentScreen === 'home' || currentScreen === 'gacha' || currentScreen === 'backpack';

  return (
    <div className="relative w-full h-[100dvh] bg-[#FAFAFA] flex justify-center overflow-hidden">
      {/* Mobile container constraint for desktop viewing */}
      <div className="relative w-full h-full max-w-md shadow-2xl bg-white overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {currentScreen === 'login' && (
            <LoginScreen key="login" onLogin={handleLogin} isTransitioning={isTransitioning} />
          )}
          {currentScreen === 'home' && (
            <HomeScreen key="home" onMenuClick={() => setIsDrawerOpen(true)} />
          )}
          {currentScreen === 'gacha' && (
            <GachaScreen key="gacha" onMenuClick={() => setIsDrawerOpen(true)} glowSticks={glowSticks} setGlowSticks={setGlowSticks} />
          )}
          {currentScreen === 'backpack' && (
            <BackpackScreen key="backpack" onMenuClick={() => setIsDrawerOpen(true)} />
          )}
          {currentScreen === 'ranking' && (
            <RankingScreen key="ranking" onBack={() => navigateTo('home')} glowSticks={glowSticks} setGlowSticks={setGlowSticks} />
          )}
          {currentScreen === 'checkin' && (
            <CheckInScreen key="checkin" onBack={() => navigateTo('home')} glowSticks={glowSticks} setGlowSticks={setGlowSticks} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBottomNav && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 w-full z-40 pointer-events-none" // pointer-events-none on wrapper so it doesn't block touches above it
            >
              <div className="pointer-events-auto">
                <BottomNav currentScreen={currentScreen} onNavigate={navigateTo} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {currentScreen !== 'login' && (
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onNavigate={navigateTo}
            currentScreen={currentScreen}
            glowSticks={glowSticks}
          />
        )}

        <GlowSticksRecordModal 
          isOpen={showGlowSticksRecord} 
          onClose={() => setShowGlowSticksRecord(false)} 
        />
      </div>
    </div>
  );
}
