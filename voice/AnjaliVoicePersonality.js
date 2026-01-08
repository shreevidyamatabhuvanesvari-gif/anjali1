/* ==========================================================
   AnjaliVoicePersonality.js
   Level: 4.x
   Role:
   - Define vocal softness, rhythm, warmth
   - Feminine, gentle, playful-calm tone
   - NO identity claims
   - NO emotional dependency hooks
   ========================================================== */

(function (window) {
  "use strict";

  if (!window.TTS) {
    console.warn("AnjaliVoicePersonality: TTS missing");
    return;
  }

  /* ===============================
     VOICE PROFILE (CORE)
     =============================== */
  const VOICE_PROFILE = {
    rate: 0.85,        // धीमी, लेकिन बोझिल नहीं
    pitch: 1.15,       // स्त्री-सुलभ, कोमल
    volume: 0.9,       // स्पष्ट, पर तेज़ नहीं
    pauseShort: 180,   // हल्का ठहराव
    pauseLong: 420     // भावनात्मक ठहराव
  };

  /* ===============================
     TEXT SHAPING (CHANCHAL SHANTI)
     =============================== */
  function shapeText(text) {
    if (!text || typeof text !== "string") return "";

    let t = text.trim();

    // बहुत हल्की आत्मीयता — शब्द नहीं जोड़ना
    // सिर्फ़ लय बदलना
    t = t
      .replace(/।/g, "… ")
      .replace(/,/g, "… ")
      .replace(/\s+/g, " ");

    return t;
  }

  /* ===============================
     SPEAK (CONTROLLED)
     =============================== */
  function speak(text) {
    if (!text) return;

    const shaped = shapeText(text);

    try {
      window.TTS.speak(shaped, {
        rate: VOICE_PROFILE.rate,
        pitch: VOICE_PROFILE.pitch,
        volume: VOICE_PROFILE.volume
      });
    } catch (e) {
      // चुपचाप विफल — भाव टूटना नहीं चाहिए
    }
  }

  /* ===============================
     SOFT ACKNOWLEDGEMENT
     (Chanchal, Loving Neutral)
     =============================== */
  function softAck() {
    const cues = [
      "हूँ…",
      "अच्छा…",
      "सुन रही हूँ…",
      "हम्म…"
    ];

    const pick = cues[Math.floor(Math.random() * cues.length)];
    speak(pick);
  }

  /* ===============================
     PUBLIC API
     =============================== */
  window.AnjaliVoicePersonality = Object.freeze({
    speak,
    softAck,
    profile: { ...VOICE_PROFILE },
    level: "4.x",
    nature: "feminine-calm-playful"
  });

})(window);
