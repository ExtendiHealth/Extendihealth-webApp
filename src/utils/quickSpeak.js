// Helper function for quick announcements with female voice and correct pronunciation
export const quickSpeak = (text, volume = 0.8, rate = 1.0) => {
  if (!window.speechSynthesis) return;
  
  // Process text for correct KIOSK pronunciation
  const processedText = text
    .replace(/ExtendiKIOSK/gi, 'Extendi Kee-osk')
    .replace(/KIOSK/gi, 'Kee-osk')
    .replace(/Kiosk/gi, 'Kee-osk')
    .replace(/kiosk/gi, 'kee-osk');
  
  const utterance = new SpeechSynthesisUtterance(processedText);
  utterance.volume = volume;
  utterance.rate = rate;
  utterance.pitch = 1.1;
  utterance.lang = 'en-US';
  
  // Try to find a female voice
  const voices = window.speechSynthesis.getVoices();
  const femaleIndicators = [
    'female', 'woman', 'samantha', 'victoria', 'karen', 'moira', 'tessa',
    'fiona', 'veena', 'allison', 'ava', 'susan', 'zira', 'hazel',
    'heather', 'helena', 'catherine', 'linda', 'elizabeth', 'google us english',
    'microsoft zira', 'microsoft hazel'
  ];
  
  const femaleVoice = voices.find(v => {
    const nameLower = v.name.toLowerCase();
    return v.lang.startsWith('en') && femaleIndicators.some(ind => nameLower.includes(ind));
  });
  
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }
  
  window.speechSynthesis.speak(utterance);
};

export default quickSpeak;
