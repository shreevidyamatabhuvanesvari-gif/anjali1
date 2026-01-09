/* ==========================================================
   AnjaliPresence.js
   Level-4 / Version-4.x (FINAL)
   ROLE:
   Felt presence on hearing "अंजली"
   ========================================================== */

(function (window) {
  "use strict";

  let active = false;
  let lastActivatedAt = 0;

  const MIN_GAP_MS = 8000;

  function now() {
    return Date.now();
  }

  /* ---- Soft acknowledgement tone (NOT speech) ---- */
  function playPresenceSound() {
    if (!window.TTS || typeof window.TTS.playTone !== "function") return;

    try {
      window.TTS.playTone({
        frequency: 420,
        duration: 350,
        volume: 0.15,
        fadeOut: true
      });
    } catch (_) {
      /* मौन ही सम्मान है */
    }
  }

  function activate() {
    const t = now();
    if (t - lastActivatedAt < MIN_GAP_MS) return;

    lastActivatedAt = t;
    active = true;

    playPresenceSound();

    /* 🔔 Presence signal for ResponseEngine */
    window.dispatchEvent(
      new CustomEvent("anjali:presence-activated", {
        detail: { at: t }
      })
    );

    setTimeout(() => {
      active = false;
    }, 1200);
  }

  function onUserSpeech(text) {
    if (!text) return;

    const clean = String(text).trim();

    if (
      clean.startsWith("अंजली") ||
      clean.startsWith("anjali") ||
      clean.startsWith("ए सुनो")
    ) {
      activate();
    }
  }

  function getStatus() {
    return {
      active,
      lastActivatedAt,
      role: "presence",
      level: "4.x"
    };
  }

  window.AnjaliPresence = Object.freeze({
    activate,
    onUserSpeech,
    getStatus,
    level: "4.x",
    mode: "felt-presence"
  });

})(window);
