/* ==========================================================
   voice/tts.js
   ROLE:
   Soft female voice for Anjali
   Web Speech API based
   ========================================================== */

(function (window) {
  "use strict";

  let voices = [];
  let unlocked = false;

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
  }

  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();

  function pickVoice() {
    // Prefer soft female Hindi / English voice
    return voices.find(v =>
      v.lang.startsWith("hi") ||
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("woman")
    ) || voices[0];
  }

  function speak(text, opts = {}) {
    if (!unlocked) return;
    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;

    u.rate = opts.rate || 0.9;
    u.pitch = opts.pitch || 1.1;
    u.volume = opts.volume || 0.9;

    window.speechSynthesis.speak(u);
  }

  // Soft presence tone (used by AnjaliPresence)
  function playTone({ frequency = 400, duration = 300, volume = 0.2 }) {
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
    // Required by mobile browsers
    unlocked = true;
    speak(" "); // silent unlock
  }

  window.TTS = {
    speak,
    playTone,
    init
  };

})(window);
