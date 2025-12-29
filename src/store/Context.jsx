import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';

const ClickContext = createContext();

// Ключ для localStorage
const SAVE_KEY = 'labubu_clicker_save';

// Начальное состояние
const initialState = {
  points: 0,
  autoClick: 0,
  pointToClick: 1,
  labubuLevel: 1
};

export const ClickProvider = ({ children }) => {
  const [points, setPoints] = useState(() => {
    // Загружаем из localStorage сразу при инициализации состояния
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const savedState = JSON.parse(saved);
        return savedState.points || initialState.points;
      } catch (error) {
        return initialState.points;
      }
    }
    return initialState.points;
  });

  const [autoClick, setAutoClick] = useState(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const savedState = JSON.parse(saved);
        return savedState.autoClick || initialState.autoClick;
      } catch (error) {
        return initialState.autoClick;
      }
    }
    return initialState.autoClick;
  });

  const [pointToClick, setPointToClick] = useState(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const savedState = JSON.parse(saved);
        return savedState.pointToClick || initialState.pointToClick;
      } catch (error) {
        return initialState.pointToClick;
      }
    }
    return initialState.pointToClick;
  });

  const [labubuLevel, setLabubuLevel] = useState(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const savedState = JSON.parse(saved);
        return savedState.labubuLevel || initialState.labubuLevel;
      } catch (error) {
        return initialState.labubuLevel;
      }
    }
    return initialState.labubuLevel;
  });

  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const intervalRef = useRef(null);

  // Сохранение при изменении ключевых состояний
  useEffect(() => {
    const gameState = {
      points,
      autoClick,
      pointToClick,
      labubuLevel,
      timestamp: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  }, [points, autoClick, pointToClick, labubuLevel]);

  // Автосохранение при закрытии/обновлении страницы
  useEffect(() => {
    const handleBeforeUnload = () => {
      const gameState = {
        points,
        autoClick,
        pointToClick,
        labubuLevel,
        timestamp: Date.now()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload(); // Сохраняем при размонтировании
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [points, autoClick, pointToClick, labubuLevel]);

  const getLabubuImage = useCallback(() => {
    const levels = [
      'labubu0.png', 'labubu1.png', 'labubu2.png', 'labubu3.png',
      'labubu4.png', 'labubu5.png', 'labubu6.png', 'labubu7.png',
      'labubu8.png', 'labubu9.png', 'labubu3.png'
    ];
    return levels[Math.min(labubuLevel - 1, levels.length - 1)] || 'labubu3.png';
  }, [labubuLevel]);

  const upLevel = useCallback(() => {
    setLabubuLevel(prevLevel => prevLevel + 1);
  }, []);

  const addPoints = useCallback((value) => {
    setPoints(prevPoints => prevPoints + value);
  }, []);

  const addAutoPoints = useCallback((value) => {
    setAutoClick(prev => prev + value);
  }, []);

  const awayPoints = useCallback((value) => {
    setPoints(prevPoints => Math.max(0, prevPoints - value));
  }, []);

  const addPointToClick = useCallback((value) => {
    setPointToClick(prev => prev + value);
  }, []);

  // Функция сброса игры
  const resetGame = useCallback(() => {
    setPoints(initialState.points);
    setAutoClick(initialState.autoClick);
    setPointToClick(initialState.pointToClick);
    setLabubuLevel(initialState.labubuLevel);
    localStorage.removeItem(SAVE_KEY);
  }, []);

  const startAutoPoints = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (autoClick > 0) {
      setIsAutoRunning(true);
      intervalRef.current = setInterval(() => {
        addPoints(autoClick);
      }, 1000);
    }
  }, [addPoints, autoClick]);

  const stopAutoPoints = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsAutoRunning(false);
    }
  }, []);

  // Автоматический сбор очков
  useEffect(() => {
    if (autoClick > 0) {
      startAutoPoints();
    } else {
      stopAutoPoints();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoClick, startAutoPoints, stopAutoPoints]);

  const value = {
    points,
    addPoints,
    isAutoRunning,
    autoClick,
    addAutoPoints,
    awayPoints,
    pointToClick,
    addPointToClick,
    labubuLevel,
    upLevel,
    labubuImage: getLabubuImage(),
    resetGame,
    getLabubuCost: useCallback(() => {
      const costs = {
        1: 250,
        2: 1000,
        3: 5000,
        4: 20000,
        5: 70000,
        6: 150000,
        7: 300000,
        8: 700000,
        9: 1000000,
        10: 10000000
      };
      return costs[labubuLevel] || 0;
    }, [labubuLevel])
  };

  return (
    <ClickContext.Provider value={value}>
      {children}
    </ClickContext.Provider>
  );
};

export const useClick = () => {
  const context = useContext(ClickContext);
  if (!context) {
    throw new Error('useClick must be used within a ClickProvider');
  }
  return context;
};