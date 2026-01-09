/* ==========================================================
   ResponseEngine.js
   Level-4 / Version-4.x (FINAL – VOICE SAFE)
   ROLE:
   Living conversation with warmth, rhythm & presence
   ========================================================== */

(function (window) {
  "use strict";

  let lastSpokenAt = 0;
  let presenceRecently = false;

  const MIN_SPEAK_GAP = 5000; // 5s (7s was too long and killed voice)

  function now() {
    return Date.now();
  }

  /* ===============================
     PRESENCE COORDINATION
     =============================== */
  window.addEventListener("anjali:presence-activated", function () {
    presenceRecently = true;

    // Presence सिर्फ़ बोलने का स्टाइल बदलेगा, रोकेगा नहीं
    setTimeout(function () {
      presenceRecently = false;
    }, 1200);
  });

  /* ===============================
     VOICE PERSONALITY (B)
     =============================== */
  function speakSoftly(text) {
    if (!window.TTS || typeof window.TTS.speak !== "function") return;
    if (!text) return;

    try {
      window.TTS.speak(text, {
        rate: 0.88,
        pitch: 1.08,
        volume: 0.85
      });
    } catch (_) {}
  }

  /* ===============================
     RHYTHM (C) — FIXED
     =============================== */
  function decideMode(result) {
    const t = now();

    // बहुत जल्दी रिपीट न हो
    if (t - lastSpokenAt < MIN_SPEAK_GAP) {
      return "soft";   // presence नहीं, soft बोलो
    }

    if (!result || typeof result.confidence !== "number") {
      return "soft";
    }

    if (result.confidence < 0.45) return "reflect";
    if (result.confidence < 0.75) return "soft";

    return "full";
  }

  /* ===============================
     RESPONSE MODES
     =============================== */

  function softAnswer(text) {
    speakSoftly(text);
  }

  function reflect() {
    const prompts = [
      "तुम ऐसा क्यों महसूस कर रहे हो?",
      "क्या यह बात तुम्हें भीतर से छू रही है?",
      "क्या हम इसे थोड़ा और साथ में सोचें?"
    ];
    speakSoftly(prompts[Math.floor(Math.random() * prompts.length)]);
  }

  function fullAnswer(text) {
    speakSoftly(text);

    if (Math.random() < 0.35) {
      setTimeout(function () {
        speakSoftly("…और तुम क्या सोचते हो?");
      }, 2000);
    }
  }

  /* ===============================
     MAIN ENTRY
     =============================== */
  function respond(finalDecision) {
    if (!finalDecision || !finalDecision.text) return;

    const mode = decideMode(finalDecision);
    lastSpokenAt = now();

    switch (mode) {
      case "reflect":
        reflect();
        break;

      case "full":
        fullAnswer(finalDecision.text);
        break;

      case "soft":
      default:
        softAnswer(finalDecision.text);
        break;
    }
  }

  /* ===============================
     STATUS
     =============================== */
  function getStatus() {
    return {
      lastSpokenAt,
      role: "response-engine",
      level: "4.x",
      voiceAlive: true,
      presenceAware: presenceRecently
    };
  }

  window.ResponseEngine = Object.freeze({
    respond,
    getStatus,
    level: "4.x",
    mode: "voice-safe-conversation"
  });

})(window);
