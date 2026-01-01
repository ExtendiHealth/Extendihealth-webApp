import { useState, useEffect, useCallback } from 'react';

export const useTimer = (duration, onComplete) => {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsRunning(false);
          onComplete?.();
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, duration, onComplete]);

  const start = useCallback(() => {
    setProgress(0);
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setIsRunning(false);
  }, []);

  return { progress, isRunning, start, reset };
};

export default useTimer;
