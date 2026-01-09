(function (window) {
  "use strict";

  let lastSpokenAt = 0;
  const MIN_SPEAK_GAP = 6000;

  function now() {
    return Date.now();
  }

  function speakSoftly(text) {
    if (!window.TTS || typeof window.TTS.speak !== "function") return;
    if (!text) return;

    try {
      window.TTS.speak(text, {
        rate: 0.9,
        pitch: 1.08,
        volume: 0.9
      });
    } catch (e) {}
  }

  function respond(finalDecision) {
    if (!finalDecision || !finalDecision.text) return;

    const t = now();
    if (t - lastSpokenAt < MIN_SPEAK_GAP) return;

    lastSpokenAt = t;
    speakSoftly(finalDecision.text);
  }

  window.ResponseEngine = Object.freeze({
    respond,
    level: "4.x",
    mode: "safe-voice"
  });

})(window);
