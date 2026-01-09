/* ==========================================================
   voice/tts.js
   ROLE:
   Soft female voice for Anjali
   Uses SpeechGate to survive mobile Chrome restrictions
   ========================================================== */

(function (window) {
  "use strict";

  let voices = [];

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
  }

  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();

  function pickVoice() {
    return voices.find(v =>
      v.lang.startsWith("hi") ||
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("woman")
    ) || voices[0];
  }

  /* ==========================================================
     SPEAK — goes through SpeechGate
     ========================================================== */
  function speak(text, opts = {}) {
    if (!window.SpeechGate || !SpeechGate.isUnlocked()) {
      console.warn("TTS blocked: SpeechGate not unlocked");
      return;
    }
    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;

    /* 🌸 ANJALI VOICE PERSONALITY 🌸 */
    u.rate   = typeof opts.rate === "number" ? opts.rate : 0.78;
    u.pitch  = typeof opts.pitch === "number" ? opts.pitch : 1.18;
    u.volume = typeof opts.volume === "number" ? opts.volume : 0.6;

    // मुस्कराकर बोलने का एहसास
    u.text = String(text)
      .replace(/([।?!])/g, "$1…")
      .replace(/,/g, ", ");

    const smile = 0.02 + Math.random() * 0.03;
    u.pitch += smile;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {
      // भाव नहीं टूटना चाहिए
    }
  }

  /* ==========================================================
     PRESENCE TONE (AnjaliPresence uses this)
     ========================================================== */
  function playTone({ frequency = 400, duration = 300, volume = 0.2 }) {
    try {
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
    } catch {}
  }

  /* ==========================================================
     INIT — must be called from button click
     ========================================================== */
  function init() {
    if (window.SpeechGate) {
      SpeechGate.unlock();   // 🔓 critical
    }

    // tiny silent utterance to bind speech to gesture
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      speechSynthesis.speak(u);
    } catch {}
  }

  window.TTS = {
    speak,
    playTone,
    init
  };

})(window);
