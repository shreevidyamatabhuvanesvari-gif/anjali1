/* ==========================================================
   STT_LongListening.js
   Level-4 / Version-4.x
   ROLE:
   Provide continuous, human-like listening.
   Silence ≠ Stop
   Listening continues with auto-restart.
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
  const RESTART_DELAY = 800;    // ms

  /* ===============================
     TIME
     =============================== */
  function now() {
    return Date.now();
  }

  /* ===============================
     SAFE START
     =============================== */
  function startListening() {
    if (!enabled || listening) return;

    try {
      listening = true;
      window.STT.start(onResult, onEnd, onError);
    } catch (e) {
      listening = false;
    }
  }

  /* ===============================
     STOP (MANUAL)
     =============================== */
  function stopListening() {
    enabled = false;
    listening = false;

    if (window.STT.stop) {
      try { window.STT.stop(); } catch {}
    }
  }

  /* ===============================
     STT CALLBACKS
     =============================== */
  function onResult(text) {
    lastHeardAt = now();

    if (!text) return;

    // 🌸 Presence hook
    if (window.AnjaliPresence) {
      AnjaliPresence.onUserSpeech(text);
    }

    // 🧠 Reasoning hook
    if (window.ReasoningEngine && ReasoningEngine.process) {
      ReasoningEngine.process(text);
    }
  }

  function onEnd() {
    listening = false;

    if (!enabled) return;

    // auto-restart
    setTimeout(() => {
      startListening();
    }, RESTART_DELAY);
  }

  function onError(err) {
    listening = false;

    // wait a bit, then restart
    if (!enabled) return;

    setTimeout(() => {
      startListening();
    }, RESTART_DELAY + 400);
  }

  /* ===============================
     SILENCE MONITOR
     =============================== */
  setInterval(() => {
    if (!enabled || !listening) return;

    if (now() - lastHeardAt > SILENCE_TIMEOUT) {
      // silence is normal → gently restart
      try {
        if (window.STT.stop) window.STT.stop();
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
