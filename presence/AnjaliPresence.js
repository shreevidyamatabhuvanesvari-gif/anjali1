/* ==========================================================
   AnjaliPresence.js
   Level: 4.x
   ROLE:
   Presence without claim.
   पहचान → सूक्ष्म प्रतिक्रिया → सुनना शुरू।
   कोई टेक्स्ट नहीं, कोई घोषणा नहीं।
   ========================================================== */

(function (window) {
  "use strict";

  if (!window.AnjaliCore || !window.STT) {
    console.warn("AnjaliPresence: Core or STT missing");
    return;
  }

  /* ===============================
     INTERNAL STATE
     =============================== */
  let listening = false;
  let lastWakeAt = 0;

  /* ===============================
     CONFIG (LOCKED)
     =============================== */
  const WAKE_WORD = "अंजली";
  const MIN_GAP = 8000; // ms (बार-बार trigger न हो)

  /* ===============================
     SOFT PRESENCE SOUNDS
     (कोई शब्द नहीं, केवल अहसास)
     =============================== */
  function softPresenceCue() {
    if (!window.TTS || typeof window.TTS.speak !== "function") return;

    // 3 में से कोई एक — यादृच्छिक, मानव-सा
    const cues = [
      "हूँ",      // बहुत हल्का
      "…",        // लगभग मौन
      " "         // शून्य-सा (TTS trigger के लिए)
    ];

    const cue = cues[Math.floor(Math.random() * cues.length)];

    try {
      window.TTS.speak(cue, {
        rate: 0.6,
        pitch: 1.1,
        volume: 0.3
      });
    } catch (e) {
      // पूरी तरह silent fail
    }
  }

  /* ===============================
     LISTENING MODE
     =============================== */
  function enterListeningMode() {
    if (listening) return;

    listening = true;

    // सूक्ष्म उपस्थिति संकेत
    softPresenceCue();

    // वास्तविक सुनना
    try {
      window.STT.start({
        continuous: true,
        interimResults: true
      });
    } catch (e) {
      listening = false;
    }
  }

  /* ===============================
     EXIT (अगर ज़रूरत हो)
     =============================== */
  function stopListening() {
    if (!listening) return;
    listening = false;
    try {
      window.STT.stop();
    } catch (e) {}
  }

  /* ===============================
     WAKE WORD DETECTION
     =============================== */
  function detectWakeWord(text) {
    if (!text) return;

    const now = Date.now();
    if (now - lastWakeAt < MIN_GAP) return;

    const normalized = String(text).toLowerCase();

    if (normalized.includes(WAKE_WORD)) {
      lastWakeAt = now;
      enterListeningMode();
    }
  }

  /* ===============================
     STT HOOK
     (speech → presence)
     =============================== */
  if (typeof window.STT.onResult === "function") {
    window.STT.onResult(function (text) {
      detectWakeWord(text);
    });
  } else {
    // fallback: global hook
    window.onAnjaliSpeech = function (text) {
      detectWakeWord(text);
    };
  }

  /* ===============================
     CORE LIFECYCLE BIND
     =============================== */
  if (window.AnjaliCore && typeof window.AnjaliCore.on === "function") {
    window.AnjaliCore.on("stop", stopListening);
  }

  /* ===============================
     PUBLIC STATUS (DIAGNOSTIC ONLY)
     =============================== */
  window.AnjaliPresence = Object.freeze({
    isListening: () => listening,
    level: "4.x",
    role: "presence-only"
  });

})(window);
