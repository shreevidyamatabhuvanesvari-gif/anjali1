/* ==========================================================
   voice/tts.js
   ROLE:
   Soft, human, smiling female voice for Anjali
   Works in Chrome Android
   ========================================================== */

(function (window) {
  "use strict";

  let voices = [];
  let unlocked = false;

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
  }
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();

  function pickVoice() {
    return voices.find(v =>
      v.lang.startsWith("hi") ||
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("woman")
    ) || voices[0];
  }

  function humanize(text) {
    return String(text)
      .replace(/।/g, "… ")
      .replace(/\?/g, "…?")
      .replace(/!/g, "…!")
      .replace(/,/g, ", ")
      .replace(/\n/g, "… ");
  }

  function speak(text, opts = {}) {
    if (!unlocked || !text) return;

    const parts = humanize(text).split("…");

    let i = 0;

    function speakNext() {
      if (i >= parts.length) return;

      const part = parts[i].trim();
      i++;

      if (!part) {
        speakNext();
        return;
      }

      const u = new SpeechSynthesisUtterance(part);

      const v = pickVoice();
      if (v) u.voice = v;

      // 🌸 Anjali voice personality
      const baseRate = 0.75;
      const basePitch = 1.15;

      u.rate  = baseRate  + Math.random() * 0.06;
      u.pitch = basePitch + Math.random() * 0.05;
      u.volume = 0.7;

      u.onend = () => {
        setTimeout(speakNext, 180); // micro-pause between thoughts
      };

      try {
        speechSynthesis.speak(u);
      } catch {}
    }

    speechSynthesis.cancel();
    speakNext();
  }

  function playTone({ frequency = 420, duration = 300, volume = 0.15 }) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = frequency;
    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration);
  }

  function init() {
    unlocked = true;
    const u = new SpeechSynthesisUtterance(" ");
    speechSynthesis.speak(u); // unlock audio on mobile
  }

  window.TTS = {
    speak,
    playTone,
    init
  };

})(window);
