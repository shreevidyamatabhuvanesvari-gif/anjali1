/* ==========================================================
   STT_LongListening.js
   Level-4 / Version-4.x
   ROLE:
   True continuous, human-like listening for Anjali.
   Works with event-based STT (onResult / onEnd / onError)
   ========================================================== */

(function (window) {
  "use strict";

  if (!window.STT) {
    console.error("STT_LongListening: base STT missing");
    return;
  }

  /* ===============================
     INTERNAL STATE
     =============================== */
  let enabled = false;
  let listening = false;
  let lastHeardAt = 0;

  const SILENCE_TIMEOUT = 12000; // 12 seconds
  const RESTART_DELAY = 900;    // ms

  function now() {
    return Date.now();
  }

  /* ===============================
     ATTACH STT EVENTS
     =============================== */
  function attachSTT() {
    STT.onResult = function (text) {
      lastHeardAt = now();
      if (!text) return;

      // 🌸 Presence
      if (window.AnjaliPresence) {
        AnjaliPresence.onUserSpeech(text);
      }

      // 🧠 Reasoning
      if (window.ReasoningEngine && ReasoningEngine.process) {
        ReasoningEngine.process(text);
      }
    };

    STT.onEnd = function () {
      listening = false;
      if (!enabled) return;

      // auto restart
      setTimeout(startListening, RESTART_DELAY);
    };

    STT.onError = function () {
      listening = false;
      if (!enabled) return;

      setTimeout(startListening, RESTART_DELAY + 500);
    };
  }

  /* ===============================
     SAFE START
     =============================== */
  function startListening() {
    if (!enabled || listening) return;

    try {
      attachSTT();
      listening = true;
      STT.start();
    } catch (e) {
      listening = false;
    }
  }

  /* ===============================
     STOP
     =============================== */
  function stopListening() {
    enabled = false;
    listening = false;
    try {
      if (STT.stop) STT.stop();
    } catch {}
  }

  /* ===============================
     SILENCE MONITOR
     =============================== */
  setInterval(function () {
    if (!enabled || !listening) return;

    if (now() - lastHeardAt > SILENCE_TIMEOUT) {
      try {
        if (STT.stop) STT.stop();
      } catch {}
    }
  }, 3000);

  /* ===============================
     PUBLIC API
     =============================== */
  window.STT_LongListening = Object.freeze({
    start() {
      enabled = true;
      lastHeardAt = now();
      startListening();
    },

    stop() {
      stopListening();
    },

    status() {
      return {
        enabled,
        listening,
        lastHeardAt,
        role: "long-listening",
        level: "4.x"
      };
    }
  });

})(window);
