/* ==========================================================
   AnjaliPresence.js — Step C
   Conversational Rhythm Engine
   ========================================================== */

(function () {
  "use strict";

  let active = false;
  let lastSpokenAt = 0;
  let silenceTimer = null;

  const MIN_GAP = 25 * 1000;   // 25 सेकंड
  const LONG_SILENCE = 2 * 60 * 1000; // 2 मिनट

  function now() {
    return Date.now();
  }

  /* ===============================
     ACTIVATE PRESENCE
     =============================== */
  function activate() {
    active = true;
    lastSpokenAt = now();
    scheduleSilenceCheck();
  }

  /* ===============================
     USER SPOKE
     =============================== */
  function onUserSpeech(text) {
    if (!active) return;

    lastSpokenAt = now();

    // हर बार जवाब नहीं
    if (Math.random() < 0.45) {
      // मौन — बस सुनना
      return;
    }

    // कभी छोटा प्रश्न
    if (Math.random() < 0.35) {
      gentleSpeak(randomQuestion());
      return;
    }

    // कभी छोटा वाक्य
    if (Math.random() < 0.2) {
      gentleSpeak(randomSoftLine());
    }
  }

  /* ===============================
     SILENCE AWARENESS
     =============================== */
  function scheduleSilenceCheck() {
    clearTimeout(silenceTimer);

    silenceTimer = setTimeout(() => {
      if (!active) return;

      const gap = now() - lastSpokenAt;

      if (gap > LONG_SILENCE) {
        gentleSpeak("…");
      }

      scheduleSilenceCheck();
    }, LONG_SILENCE);
  }

  /* ===============================
     VOICE OUTPUT (SAFE)
     =============================== */
  function gentleSpeak(text) {
    if (!text) return;

    if (window.TTS && typeof TTS.speak === "function") {
      try {
        TTS.speak(text);
      } catch (e) {
        // चुपचाप — भाव नहीं टूटना चाहिए
      }
    }
  }

  /* ===============================
     SOFT CONTENT
     =============================== */
  function randomQuestion() {
    const q = [
      "क्या तुम ठीक हो?",
      "थोड़ा थकान लग रही है क्या?",
      "आज मन कैसा है?",
      "कुछ कहना चाहते हो?"
    ];
    return q[Math.floor(Math.random() * q.length)];
  }

  function randomSoftLine() {
    const l = [
      "मैं सुन रही हूँ…",
      "ठीक है, बोलते रहो।",
      "हूँ…",
      "समय का ध्यान मत रखो।"
    ];
    return l[Math.floor(Math.random() * l.length)];
  }

  /* ===============================
     GLOBAL EXPOSE
     =============================== */
  window.AnjaliPresence = Object.freeze({
    activate,
    onUserSpeech,
    level: "4.x",
    role: "conversational-presence"
  });

})();
