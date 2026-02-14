
export const playCallSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playNote = (freq: number, startTime: number, duration: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  // 呼び出し音を3回繰り返す（チャイム音）
  const now = audioContext.currentTime;
  playNote(880, now, 0.8);
  playNote(698, now + 0.4, 0.8);
  
  playNote(880, now + 1.2, 0.8);
  playNote(698, now + 1.6, 0.8);
  
  playNote(880, now + 2.4, 0.8);
  playNote(698, now + 2.8, 0.8);
};

export const playArrivalSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioContext.currentTime;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(440, now);
  oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.2);
  
  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  
  oscillator.start(now);
  oscillator.stop(now + 0.3);
};
