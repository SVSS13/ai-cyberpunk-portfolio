import { createContext, useContext, useState, useEffect } from 'react';

export const STANCES = {
  stone: {
    id: 'stone',
    name: 'Stone Stance',
    kanji: '石',
    sub: 'Hard · Heavy Plunge',
    primary: '#FFB7C5',
    secondary: '#CC2233',
    accent: '#E8503A',
    glow: 'rgba(204,34,51,0.4)',
    tagBg: 'rgba(255,183,197,0.08)',
    tagBorder: 'rgba(255,183,197,0.22)',
    particleColors: ['#FFB7C5', '#FF8DA1', '#D92038', '#BA1325', '#E85D35', '#D4AF37'],
    // Physics: Hard & Heavy
    physics: {
      windSpeedX: -0.008,
      fallSpeedY: -0.038,      // Fast heavy drop
      waveFreq: 1.2,
      waveAmp: 0.004,
      flutterAmp: 0.003,
      tumbleSpeed: 1.4,
      upwardDraft: 0.0,
      mouseForce: 0.085,
      windRibbonSpeed: 6.0,
      windRibbonOpacity: 0.20,
    }
  },
  water: {
    id: 'water',
    name: 'Water Stance',
    kanji: '水',
    sub: 'Tsunami · Tidal Swells',
    primary: '#5CE1E6',
    secondary: '#0080FF',
    accent: '#00D4FF',
    glow: 'rgba(0,128,255,0.4)',
    tagBg: 'rgba(92,225,230,0.08)',
    tagBorder: 'rgba(92,225,230,0.25)',
    particleColors: ['#5CE1E6', '#00D4FF', '#0080FF', '#70A6FF', '#C4F0FF', '#80D0FF'],
    // Physics: Tsunami Swells (Undulating Waves)
    physics: {
      windSpeedX: -0.018,
      fallSpeedY: -0.011,
      waveFreq: 2.2,          // Rhythmic tidal crests
      waveAmp: 0.024,          // High vertical undulating swells
      flutterAmp: 0.014,
      tumbleSpeed: 0.85,
      upwardDraft: 0.004,
      mouseForce: 0.065,
      windRibbonSpeed: 8.0,
      windRibbonOpacity: 0.38,
    }
  },
  wind: {
    id: 'wind',
    name: 'Wind Stance',
    kanji: '風',
    sub: 'Toofan · Typhoon Tempest',
    primary: '#7EC8A0',
    secondary: '#00B050',
    accent: '#52DE97',
    glow: 'rgba(0,176,80,0.4)',
    tagBg: 'rgba(126,200,160,0.08)',
    tagBorder: 'rgba(126,200,160,0.25)',
    particleColors: ['#7EC8A0', '#52DE97', '#00B050', '#A8E6CF', '#D4EDDA', '#28A745'],
    // Physics: Toofan (High-Speed Gale Tempest)
    physics: {
      windSpeedX: -0.052,     // Extreme whipping windstorm
      fallSpeedY: -0.016,
      waveFreq: 3.8,          // Rapid vortex frequency
      waveAmp: 0.028,
      flutterAmp: 0.026,
      tumbleSpeed: 2.8,       // Rapid whipping spin
      upwardDraft: 0.008,
      mouseForce: 0.13,       // Violent gust on mouse sweep
      windRibbonSpeed: 14.0,  // Fast whipping wind streaks
      windRibbonOpacity: 0.55,
    }
  },
  moon: {
    id: 'moon',
    name: 'Moon Stance',
    kanji: '月',
    sub: 'Anti-Gravity · Lunar Hover',
    primary: '#FFD700',
    secondary: '#9B59FF',
    accent: '#D4AF37',
    glow: 'rgba(155,89,255,0.4)',
    tagBg: 'rgba(255,215,0,0.08)',
    tagBorder: 'rgba(255,215,0,0.25)',
    particleColors: ['#FFD700', '#D4AF37', '#9B59FF', '#C77DFF', '#FFE57F', '#E0AAFF'],
    // Physics: Anti-Gravity (Floating Upward & Weightless Orbit)
    physics: {
      windSpeedX: -0.005,
      fallSpeedY: 0.008,      // Reverse gravity: floats gently UPWARDS!
      waveFreq: 0.9,
      waveAmp: 0.016,
      flutterAmp: 0.009,
      tumbleSpeed: 0.45,      // Slow-motion celestial rotation
      upwardDraft: 0.012,
      mouseForce: 0.045,
      windRibbonSpeed: 4.0,
      windRibbonOpacity: 0.28,
    }
  },
};

const StanceContext = createContext({
  stance: STANCES.stone,
  setStanceId: () => {},
});

export function StanceProvider({ children }) {
  const [stanceId, setStanceId] = useState('stone');
  const currentStance = STANCES[stanceId] || STANCES.stone;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--sakura', currentStance.primary);
    root.style.setProperty('--sakura-dim', currentStance.glow);
    root.style.setProperty('--crimson', currentStance.secondary);
    root.style.setProperty('--vermillion', currentStance.accent);
    root.style.setProperty('--accent', currentStance.primary);
    root.style.setProperty('--cyan', currentStance.primary);
    root.style.setProperty('--violet', currentStance.secondary);
    root.style.setProperty('--tag-bg', currentStance.tagBg);
    root.style.setProperty('--tag-border', currentStance.tagBorder);
  }, [currentStance]);

  return (
    <StanceContext.Provider value={{ stance: currentStance, stanceId, setStanceId, allStances: STANCES }}>
      {children}
    </StanceContext.Provider>
  );
}

export const useStance = () => useContext(StanceContext);
