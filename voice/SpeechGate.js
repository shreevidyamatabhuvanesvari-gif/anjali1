/* ==========================================================
   SpeechGate.js
   Role:
   Keep TTS inside the same user gesture that started STT.
   This is CRITICAL for mobile Chrome.
   ========================================================== */

(function (window) {
  "use strict";

  let unlocked = false;

  /* Called ONLY from button click */
  function unlock() {
    unlocked = true;

    // create a tiny silent sound to bind audio to gesture
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      speechSynthesis.speak(u);
    } catch {}
  }

  function speak(text, opts = {}) {
    if (!unlocked) {
      console.warn("SpeechGate blocked (not in user gesture)");
      return;
    }

    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);

    if (opts.rate) u.rate = opts.rate;
    if (opts.pitch) u.pitch = opts.pitch;
    if (opts.volume) u.volume = opts.volume;

    speechSynthesis.speak(u);
  }

  window.SpeechGate = Object.freeze({
    unlock,
    speak,
    isUnlocked() {
      return unlocked;
    }
  });

})();
