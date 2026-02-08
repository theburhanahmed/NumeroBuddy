import React, { useEffect, useState, createContext, useContext } from 'react';
type BackgroundType = 'parallax' | 'shader' | 'glass' | 'minimal';
interface BackgroundContextType {
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
}
const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);
export function BackgroundProvider({
  children


}: {children: React.ReactNode;}) {
  const [backgroundType, setBackgroundTypeState] = useState<BackgroundType>(
    () => {
      const saved = localStorage.getItem('numerobuddy_background');
      return saved as BackgroundType || 'parallax';
    }
  );
  useEffect(() => {
    localStorage.setItem('numerobuddy_background', backgroundType);
  }, [backgroundType]);
  const setBackgroundType = (type: BackgroundType) => {
    setBackgroundTypeState(type);
  };
  return (
    <BackgroundContext.Provider
      value={{
        backgroundType,
        setBackgroundType
      }}>

      {children}
    </BackgroundContext.Provider>);

}
export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}