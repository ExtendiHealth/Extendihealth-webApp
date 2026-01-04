import { useEffect, useCallback } from 'react';

const useKeyboardShortcuts = (shortcuts, enabled = true) => {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;
    
    shortcuts.forEach(({ key, ctrl, shift, alt, action }) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatch = ctrl ? (event.ctrlKey || event.metaKey) : true;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;
      
      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        action();
      }
    });
  }, [shortcuts, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
