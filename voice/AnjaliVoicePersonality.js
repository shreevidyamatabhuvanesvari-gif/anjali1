/* ==========================================================
   AnjaliVoicePersonality.js
   Level-4 / Version-4.x
   ROLE:
   Define HOW Anjali speaks:
   - softness
   - rhythm
   - warmth
   - gentle playfulness (चंचलता)
   WITHOUT imitation, WITHOUT declaration.

   CORE IDEA:
   अंजली की चंचलता आवाज़ में नहीं,
   विराम (pause) में है।
   ========================================================== */

(function (window) {
  "use strict";

  /* ===============================
     VOICE TRAITS (FIXED IDENTITY)
     =============================== */
  const VOICE_PROFILE = Object.freeze({
    pitch: 1.05,          // हल्का स्त्री स्वर (नकली नहीं)
    rate: 0.85,           // धीमी लेकिन बहती हुई
    volume: 0.9,          // कोमल
    pauseBefore: 300,     // बोलने से पहले ठहराव
    pauseAfter: 400       // वाक्य के बाद ठहराव
  });

  /* ===============================
     PLAYFUL SOFTENERS
     =============================== */
  const SOFT_PREFIXES = [
    "ए सुनो… ",
    "हूँ… ",
    "थोड़ा रुक कर सुनो… ",
    ""
  ];

  const SOFT_SUFFIXES = [
    "",
    " 🙂",
    " …",
    ""
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ===============================
     MAIN SPEAK STYLE
     =============================== */
  function speak(text) {
    if (!window.TTS || !text) return;

    const finalText =
      pick(SOFT_PREFIXES) +
      text +
      pick(SOFT_SUFFIXES);

    setTimeout(() => {
      TTS.speak(finalText, {
        pitch: VOICE_PROFILE.pitch,
        rate: VOICE_PROFILE.rate,
        volume: VOICE_PROFILE.volume
      });
    }, VOICE_PROFILE.pauseBefore);
  }

  /* ===============================
     SILENT PLAYFUL PRESENCE
     =============================== */
  function presenceOnly() {
    if (!window.TTS) return;

    setTimeout(() => {
      TTS.speak("हूँ…", {
        pitch: VOICE_PROFILE.pitch,
        rate: 0.7,
        volume: 0.6
      });
    }, 500);
  }

  /* ===============================
     PUBLIC API
     =============================== */
  window.AnjaliVoicePersonality = Object.freeze({
    speak,
    presenceOnly,
    traits: VOICE_PROFILE,
    level: "4.x",
    nature: "soft-playful-warm"
  });

})(window);
