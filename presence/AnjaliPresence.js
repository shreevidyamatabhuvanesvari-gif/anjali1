/* ==========================================================
   AnjaliPresence.js
   Level: 4.x
   Role:
   - Detect invocation ("अंजली")
   - Maintain sense of presence
   - Soft, non-verbal acknowledgment
   - NO identity claims
   - NO text output
   ========================================================== */

(function (window) {
  "use strict";

  if (!window.TTS || !window.STT) {
    console.warn("AnjaliPresence: TTS/STT not available");
    return;
  }

  /* ===============================
     INTERNAL STATE
     =============================== */
  let active = false;
  let lastActivatedAt = 0;

  const COOLDOWN_MS = 5000; // बार-बार ट्रिगर से बचाव

  /* ===============================
     SOFT PRESENCE CUE (NON-VERBAL)
     =============================== */
  function playPresenceCue() {
    try {
      // बहुत हल्की, छोटी ध्वनि (कोई शब्द नहीं)
      // यह TTS नहीं, सिर्फ़ tone / hum जैसा अहसास
      if (window.TTS && typeof TTS.playTone === "function") {
        TTS.playTone({
          frequency: 440,     // नरम
          duration: 300,      // बहुत छोटा
          volume: 0.15        // धीमा
        });
      }
    } catch (e) {
      // चुपचाप विफल — presence टूटनी नहीं चाहिए
    }
  }

  /* ===============================
     ACTIVATE PRESENCE
     =============================== */
  function activate() {
    const now = Date.now();

    if (now - lastActivatedAt < COOLDOWN_MS) {
      return;
    }

    lastActivatedAt = now;
    active = true;

    // 🎤 सुनना जारी रहे
    if (window.STT && typeof STT.ensureListening === "function") {
      STT.ensureListening();
    }

    // 🌸 हल्का संकेत — “सुना गया”
    playPresenceCue();
  }

  /* ===============================
     USER SPEECH HOOK
     =============================== */
  function onUserSpeech(text) {
    if (!text) return;

    const t = text.trim().toLowerCase();

    // नाम पहचान — बिना घोषणा
    if (
      t.startsWith("अंजली") ||
      t === "अंजली" ||
      t.startsWith("anjali")
    ) {
      activate();
    }
  }

  /* ===============================
     STATUS (DIAGNOSTIC SAFE)
     =============================== */
  function getStatus() {
    return {
      active,
      lastActivatedAt,
      role: "presence",
      level: "4.x"
    };
  }

  /* ===============================
     GLOBAL EXPOSE
     =============================== */
  window.AnjaliPresence = Object.freeze({
    activate,
    onUserSpeech,
    getStatus
  });

})(window);
