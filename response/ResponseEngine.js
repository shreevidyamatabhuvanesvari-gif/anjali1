/* ==========================================================
   ResponseEngine.js
   Level-4 / Version-4.x
   ROLE:
   Transform reasoning output into living conversation.
   Applies:
   B️⃣ Voice Personality (soft, playful, calm)
   C️⃣ Conversational Rhythm (not always answering)
   ========================================================== */

(function (window) {
  "use strict";

  /* ===============================
     INTERNAL STATE
     =============================== */
  let lastSpokenAt = 0;
  let conversationEnergy = 0.5; // 0 = quiet, 1 = very engaged

  const MIN_SPEAK_GAP = 7000; // 7 seconds (prevents machine-gun replies)

  /* ===============================
     TIME
     =============================== */
  function now() {
    return Date.now();
  }

  /* ===============================
     VOICE PERSONALITY (B)
     ===============================
     Soft | Warm | Lightly playful
     =============================== */
  function speakSoftly(text) {
    if (!window.TTS || typeof window.TTS.speak !== "function") return;

    try {
      window.TTS.speak(text, {
        rate: 0.88,        // धीमी गति
        pitch: 1.05,       // हल्की स्त्री चंचलता
        volume: 0.75       // शांत, भारी नहीं
      });
    } catch (e) {
      // चुपचाप विफल — भाव टूटना नहीं चाहिए
    }
  }

  /* ===============================
     RHYTHM DECISION (C)
     ===============================
     Decide HOW to respond, not always WHAT
     =============================== */
  function decideResponseMode(reasoningResult) {
    const t = now();

    // बहुत जल्दी-जल्दी नहीं बोलना
    if (t - lastSpokenAt < MIN_SPEAK_GAP) {
      return "presence"; // केवल साथ
    }

    // कम confidence → सवाल
    if (reasoningResult && reasoningResult.confidence < 0.45) {
      return "reflective-question";
    }

    // मध्यम confidence → हल्का उत्तर
    if (reasoningResult && reasoningResult.confidence < 0.75) {
      return "gentle-answer";
    }

    // उच्च confidence → उत्तर + संवाद
    return "answer-plus";
  }

  /* ===============================
     RESPONSE FORMS
     =============================== */

  function gentleAnswer(text) {
    speakSoftly(text);
  }

  function reflectiveQuestion(text) {
    const prompts = [
      "तुम ऐसा क्यों महसूस कर रहे हो?",
      "क्या यह बात तुम्हें भीतर से छू रही है?",
      "क्या हम इसे थोड़ा और सोचें?"
    ];

    const q = prompts[Math.floor(Math.random() * prompts.length)];
    speakSoftly(q);
  }

  function answerPlus(text) {
    speakSoftly(text);

    // कभी-कभी छोटा संवाद जोड़ना
    if (Math.random() < 0.4) {
      setTimeout(() => {
        speakSoftly("…और तुम क्या सोचते हो?");
      }, 2200);
    }
  }

  function silentPresence() {
    // जानबूझकर कुछ नहीं कहना
    // PresenceEngine अपना काम कर चुका होगा
  }

  /* ===============================
     MAIN ENTRY
     =============================== */
  function respond(reasoningResult) {
    if (!reasoningResult) return;

    const mode = decideResponseMode(reasoningResult);
    lastSpokenAt = now();

    switch (mode) {
      case "gentle-answer":
        gentleAnswer(reasoningResult.text);
        break;

      case "reflective-question":
        reflectiveQuestion(reasoningResult.text);
        break;

      case "answer-plus":
        answerPlus(reasoningResult.text);
        break;

      case "presence":
      default:
        silentPresence();
        break;
    }
  }

  /* ===============================
     STATUS (DIAGNOSTIC)
     =============================== */
  function getStatus() {
    return {
      lastSpokenAt,
      energy: conversationEnergy,
      role: "response-engine",
      level: "4.x",
      personality: "soft-playful-calm",
      rhythm: "human-like"
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
