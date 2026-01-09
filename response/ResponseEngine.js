/* ==========================================================
   ResponseEngine.js
   Level-4 / Version-4.x (FINAL)
   ROLE:
   Living conversation with restraint, warmth & presence
   Integrates:
   A️⃣ Presence
   B️⃣ Voice Personality
   C️⃣ Conversational Rhythm
   ========================================================== */

(function (window) {
  "use strict";

  /* ===============================
     INTERNAL STATE
     =============================== */
  let lastSpokenAt = 0;
  let presenceRecently = false;

  const MIN_SPEAK_GAP = 7000; // 7 seconds

  function now() {
    return Date.now();
  }

  /* ===============================
     PRESENCE COORDINATION (A)
     =============================== */
  window.addEventListener("anjali:presence-activated", function () {
    presenceRecently = true;

    // Presence के बाद थोड़ी देर तक जवाब नहीं
    setTimeout(function () {
      presenceRecently = false;
    }, 2000);
  });

  /* ===============================
     VOICE PERSONALITY (B)
     Soft | Warm | Smiling | Gentle
     =============================== */
  function speakSoftly(text) {
    if (!window.TTS || typeof window.TTS.speak !== "function") return;

    try {
      window.TTS.speak(text, {
        rate: 0.88,     // धीमी, शांत
        pitch: 1.08,   // हल्की स्त्री चंचलता
        volume: 0.85   // मुस्कुराती गर्माहट
      });
    } catch (e) {
      // भाव टूटना नहीं चाहिए
    }
  }

  /* ===============================
     RHYTHM DECISION (C)
     =============================== */
  function decideMode(result) {
    const t = now();

    // Presence को प्राथमिकता
    if (presenceRecently) return "presence";

    // बहुत जल्दी-जल्दी नहीं बोलना
    if (t - lastSpokenAt < MIN_SPEAK_GAP) return "presence";

    if (!result || typeof result.confidence !== "number") {
      return "gentle-answer";
    }

    if (result.confidence < 0.45) return "reflective-question";
    if (result.confidence < 0.75) return "gentle-answer";

    return "answer-plus";
  }

  /* ===============================
     RESPONSE FORMS
     =============================== */

  function gentleAnswer(text) {
    speakSoftly(text);
  }

  function reflectiveQuestion() {
    const prompts = [
      "तुम ऐसा क्यों महसूस कर रहे हो?",
      "क्या यह बात तुम्हें भीतर से छू रही है?",
      "क्या हम इसे थोड़ा और साथ में सोचें?"
    ];
    const q = prompts[Math.floor(Math.random() * prompts.length)];
    speakSoftly(q);
  }

  function answerPlus(text) {
    speakSoftly(text);

    // कभी-कभी संवाद जोड़ना
    if (Math.random() < 0.4) {
      setTimeout(function () {
        speakSoftly("…और तुम क्या सोचते हो?");
      }, 2200);
    }
  }

  function silentPresence() {
    // जानबूझकर कुछ नहीं कहना
    // PresenceEngine ने पहले ही उपस्थिति दी है
  }

  /* ===============================
     MAIN ENTRY
     =============================== */
  function respond(finalDecision) {
    if (!finalDecision || !finalDecision.text) return;

    const mode = decideMode(finalDecision);
    lastSpokenAt = now();

    switch (mode) {
      case "gentle-answer":
        gentleAnswer(finalDecision.text);
        break;

      case "reflective-question":
        reflectiveQuestion();
        break;

      case "answer-plus":
        answerPlus(finalDecision.text);
        break;

      case "presence":
      default:
        silentPresence();
        break;
    }
  }

  /* ===============================
     DIAGNOSTIC
     =============================== */
  function getStatus() {
    return {
      lastSpokenAt,
      role: "response-engine",
      level: "4.x",
      personality: "soft-playful-calm",
      rhythm: "human-like",
      presenceAware: presenceRecently
    };
  }

  /* ===============================
     GLOBAL EXPOSE
     =============================== */
  window.ResponseEngine = Object.freeze({
    respond,
    getStatus,
    level: "4.x",
    mode: "conversational"
  });

})(window);
