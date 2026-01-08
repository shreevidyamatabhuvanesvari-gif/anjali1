/* ==========================================================
   AnjaliConversationRhythm.js
   Level: 4.x
   ROLE:
   Human-like conversational rhythm.
   - No compulsion to answer every input
   - Sometimes listens
   - Sometimes asks softly
   - Sometimes remains present in silence
   ========================================================== */

(function (window) {
  "use strict";

  if (!window.AnjaliVoicePersonality) {
    console.warn("ConversationRhythm: VoicePersonality missing");
    return;
  }

  /* ===============================
     RHYTHM STATE
     =============================== */
  let lastInteraction = 0;
  let listeningDepth = 0;

  /* ===============================
     CONFIG (HUMAN-LIKE)
     =============================== */
  const RHYTHM = {
    minGap: 8000,          // तुरंत प्रतिक्रिया नहीं
    maxListenDepth: 3,     // कितनी बातें बिना बोले सुनी जाएँ
    chanceAsk: 0.35,       // सवाल पूछने की संभावना
    chancePause: 0.25      // मौन की संभावना
  };

  /* ===============================
     SOFT QUESTIONS
     =============================== */
  const SOFT_QUESTIONS = [
    "फिर…",
    "उसके बाद?",
    "अभी मन कैसा है?",
    "थोड़ा और बताओ…",
    "मैं सुन रही हूँ…"
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ===============================
     MAIN RHYTHM DECIDER
     =============================== */
  function respond(inputText) {
    const now = Date.now();
    if (now - lastInteraction < RHYTHM.minGap) return;

    lastInteraction = now;
    listeningDepth++;

    /* 1️⃣ कभी बस स्वीकार */
    if (listeningDepth <= RHYTHM.maxListenDepth) {
      window.AnjaliVoicePersonality.acknowledge();
      return;
    }

    /* 2️⃣ कभी सवाल */
    if (Math.random() < RHYTHM.chanceAsk) {
      window.AnjaliVoicePersonality.ask(pick(SOFT_QUESTIONS));
      listeningDepth = 0;
      return;
    }

    /* 3️⃣ कभी मौन */
    if (Math.random() < RHYTHM.chancePause) {
      window.AnjaliVoicePersonality.pause();
      listeningDepth = 0;
      return;
    }

    /* 4️⃣ वरना — हल्की उपस्थिति */
    window.AnjaliVoicePersonality.acknowledge();
    listeningDepth = 0;
  }

  /* ===============================
     RESET (NEW SESSION)
     =============================== */
  function reset() {
    listeningDepth = 0;
    lastInteraction = 0;
  }

  /* ===============================
     GLOBAL EXPOSURE
     =============================== */
  window.AnjaliConversationRhythm = Object.freeze({
    respond,
    reset,
    level: "4.x",
    role: "conversational-rhythm"
  });

})(window);
