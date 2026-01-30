import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechResult {
  speak: (text: string, lang: 'sv' | 'en') => void;
  speaking: boolean;
  supported: boolean;
}

export function useSpeech(): UseSpeechResult {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const pendingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const loadVoices = () => {
      voicesRef.current = speechSynthesis.getVoices();
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      if (pendingTimeoutRef.current !== null) {
        clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, []);

  const findBestVoice = useCallback(
    (lang: 'sv' | 'en'): SpeechSynthesisVoice | null => {
      let voices = voicesRef.current;
      if (voices.length === 0) {
        voices = speechSynthesis.getVoices();
        voicesRef.current = voices;
      }

      if (voices.length === 0) {
        return null;
      }

      if (lang === 'sv') {
        // Prefer premium Swedish voices (macOS has "Alva" as premium)
        const premiumSwedish = voices.find(
          (v) =>
            v.lang.startsWith('sv') &&
            (v.name.includes('Alva') || v.name.includes('Premium') || v.localService === false)
        );
        if (premiumSwedish) return premiumSwedish;

        const anySwedish = voices.find((v) => v.lang.startsWith('sv'));
        if (anySwedish) return anySwedish;
      } else {
        // For British English, prefer premium/natural voices
        const premiumBritish = voices.find(
          (v) =>
            v.lang === 'en-GB' &&
            (v.name.includes('Daniel') ||
              v.name.includes('Kate') ||
              v.name.includes('Oliver') ||
              v.name.includes('Premium') ||
              v.localService === false)
        );
        if (premiumBritish) return premiumBritish;

        const anyBritish = voices.find((v) => v.lang === 'en-GB');
        if (anyBritish) return anyBritish;

        const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
        if (anyEnglish) return anyEnglish;
      }

      return null;
    },
    []
  );

  const speak = useCallback(
    (text: string, lang: 'sv' | 'en') => {
      if (!window.speechSynthesis || !text) {
        return;
      }

      // Cancel any pending timeout from previous speak call
      if (pendingTimeoutRef.current !== null) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      // Chrome bug: speechSynthesis can get stuck in paused state
      speechSynthesis.resume();

      // Chrome bug: need a small delay after cancel before speaking
      pendingTimeoutRef.current = window.setTimeout(() => {
        pendingTimeoutRef.current = null;

        // Chrome bug: resume again just before speaking
        speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(text);

        const voice = findBestVoice(lang);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = lang === 'sv' ? 'sv-SE' : 'en-GB';
        }

        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = (e) => {
          if (e.error !== 'canceled') {
            console.error('Speech error:', e.error);
          }
          setSpeaking(false);
        };

        speechSynthesis.speak(utterance);

        // Chrome bug: check if paused after speak
        setTimeout(() => {
          if (speechSynthesis.paused) {
            speechSynthesis.resume();
          }
        }, 100);
      }, 100);
    },
    [findBestVoice]
  );

  return { speak, speaking, supported };
}
