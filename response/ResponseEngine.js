/* ==========================================================
   ResponseEngine — Level-4 / Version-4.x
   Voice Personality (B) + Conversational Rhythm (C)
   ========================================================== */

(function () {
  "use strict";

  let speaking = false;
  let lastMode = null;

  /* ===============================
     VOICE PERSONALITY (B)
     =============================== */
  const VOICE_PROFILE = {
    rate: 0.85,        // धीमी, सहज
    pitch: 1.05,       // हल्की चंचलता
    volume: 0.9,       // कोमल
    pauseBefore: 400,  // बोलने से पहले ठहराव
    pauseAfter: 300    // वाक्य के बाद ठहराव
  };

  /* ===============================
     RESPONSE MODES (C)
     =============================== */
  const MODES = [
    "direct-answer",
    "answer-with-question",
    "emotional-response",
    "gentle-presence"
  ];

  function pickMode() {
    let mode;
    do {
      mode = MODES[Math.floor(Math.random() * MODES.length)];
    } while (mode === lastMode);
    lastMode = mode;
    return mode;
  }

  /* ===============================
     SPEAK WITH PERSONALITY
     =============================== */
  function speak(text) {
    if (!text || speaking) return;
    if (!window.TTS || !TTS.speak) return;

    speaking = true;

    setTimeout(() => {
      try {
        TTS.speak(text, {
          rate: VOICE_PROFILE.rate,
          pitch: VOICE_PROFILE.pitch,
          volume: VOICE_PROFILE.volume,
          onEnd: () => {
            setTimeout(() => {
              speaking = false;
            }, VOICE_PROFILE.pauseAfter);
          }
        });
      } catch {
        speaking = false;
      }
    }, VOICE_PROFILE.pauseBefore);
  }

  /* ===============================
     MAIN ENTRY (Reasoning → Response)
     =============================== */
  function onDecision(decision) {
    if (!decision || !decision.text) return;

    const mode = pickMode();
    let finalText = decision.text;

    switch (mode) {

      case "direct-answer":
        // जैसा है वैसा
        break;

      case "answer-with-question":
        finalText =
          decision.text +
          "… ऐसा क्यों सोच रहे हो?";
        break;

      case "emotional-response":
        finalText =
          "आज तुम कुछ अलग से महसूस कर रहे हो… " +
          decision.text;
        break;

      case "gentle-presence":
        finalText =
          "हम्म… " +
          decision.text;
        break;
    }

    speak(finalText);
  }

  /* ===============================
     GLOBAL EXPOSE
     =============================== */
  window.ResponseEngine = Object.freeze({
    onDecision,
    level: "4.x",
    voice: "soft-playful",
    mode: "conversational-rhythm"
  });

})();
