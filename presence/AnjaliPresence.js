/* ==========================================================
   AnjaliPresence.js
   Level-4 / Version-4.x
   ROLE:
   Create a felt sense of presence when the name "अंजली"
   is spoken — without identity claims, without text,
   without verbal declaration.

   Presence ≠ Answer
   Presence = Listening + Soft Audible Acknowledgement
   ========================================================== */

(function (window) {
  "use strict";

  /* ===============================
     INTERNAL STATE
     =============================== */
  let active = false;
  let lastActivatedAt = 0;

  // Presence should NOT trigger too frequently
  const MIN_GAP_MS = 8000; // 8 seconds

  /* ===============================
     SAFE TIME
     =============================== */
  function now() {
    return Date.now();
  }

  /* ===============================
     SOFT PRESENCE SOUND
     ===============================
     This is NOT speech.
     It is a gentle acknowledgement.
     =============================== */
  function playPresenceSound() {
    if (!window.TTS || typeof window.TTS.playTone !== "function") return;

    try {
      // soft, very short tone
      window.TTS.playTone({
        frequency: 420,      // calm, warm range
        duration: 350,       // milliseconds
        volume: 0.15,        // very soft
        fadeOut: true
      });
    } catch (e) {
      // silently ignore — presence must never break flow
    }
  }

  /* ===============================
     ACTIVATE PRESENCE
     =============================== */
  function activate() {
    const t = now();

    // prevent mechanical repetition
    if (t - lastActivatedAt < MIN_GAP_MS) return;

    lastActivatedAt = t;
    active = true;

    // soft acknowledgement
    playPresenceSound();

    // Presence auto-settles back to neutral
    setTimeout(() => {
      active = false;
    }, 1200);
  }

  /* ===============================
     USER SPEECH ENTRY
     ===============================
     Called from STT bridge
     =============================== */
  function onUserSpeech(text) {
    if (!text) return;

    const clean = String(text).trim();

    // Name recognition (Hindi + fallback)
    if (
      clean.startsWith("अंजली") ||
      clean.startsWith("anjali") ||
      clean.startsWith("ए सुनो")
    ) {
      activate();
    }
  }

  /* ===============================
     STATUS (for diagnostics only)
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
    getStatus,
    level: "4.x",
    mode: "felt-presence"
  });

})(window);
