import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);
      };
      
      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Process text to fix pronunciation of KIOSK as "kee-osk"
  const processText = (text) => {
    return text
      .replace(/ExtendiKIOSK/gi, 'Extendi Kee-osk')
      .replace(/KIOSK/gi, 'Kee-osk')
      .replace(/Kiosk/gi, 'Kee-osk')
      .replace(/kiosk/gi, 'kee-osk');
  };

  // Find the best female voice for the given language
  const getFemaleVoice = (lang, availableVoices) => {
    const langCode = lang?.split('-')[0] || 'en';
    
    const femaleIndicators = [
      'female', 'woman', 'samantha', 'victoria', 'karen', 'moira', 'tessa',
      'fiona', 'veena', 'alex', 'allison', 'ava', 'susan', 'zira', 'hazel',
      'heather', 'helena', 'catherine', 'linda', 'elizabeth', 'google us english',
      'microsoft zira', 'microsoft hazel', 'google uk english female'
    ];
    
    const langVoices = availableVoices.filter(v => 
      v.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );
    
    const femaleVoice = langVoices.find(v => {
      const nameLower = v.name.toLowerCase();
      return femaleIndicators.some(indicator => nameLower.includes(indicator));
    });
    
    if (femaleVoice) return femaleVoice;
    
    const maleIndicators = ['male', 'man', 'david', 'daniel', 'james', 'mark', 'thomas', 'george'];
    const nonMaleVoice = langVoices.find(v => {
      const nameLower = v.name.toLowerCase();
      return !maleIndicators.some(indicator => nameLower.includes(indicator));
    });
    
    if (nonMaleVoice) return nonMaleVoice;
    
    return langVoices[0] || availableVoices[0];
  };

  const speak = useCallback((text, options = {}) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    
    const processedText = processText(text);
    
    const utterance = new SpeechSynthesisUtterance(processedText);
    utterance.volume = options.volume ?? 0.8;
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.1;
    utterance.lang = options.lang ?? 'en-US';
    
    const femaleVoice = getFemaleVoice(options.lang, voices);
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, voices };
};

export default useSpeech;
