/* ==========================================================
   ResponseEngine — Level-4 / Version-4.x
   Conversational Rhythm (C)
   ========================================================== */

(function () {
  "use strict";

  let speaking = false;
  let lastMode = null;

  /* ===============================
     RESPONSE MODES
     =============================== */
  const MODES = [
    "direct-answer",
    "answer-with-question",
    "emotional-response",
    "gentle-presence"
  ];

  function pickMode() {
    // एक ही मोड बार-बार न आए
    let mode;
    do {
      mode = MODES[Math.floor(Math.random() * MODES.length)];
    } while (mode === lastMode);
    lastMode = mode;
    return mode;
  }

  /* ===============================
     SPEAK SAFELY
     =============================== */
  function speak(text) {
    if (!text || speaking) return;
    if (!window.TTS || !TTS.speak) return;

    speaking = true;
    try {
      TTS.speak(text, () => {
        speaking = false;
      });
    } catch {
      speaking = false;
    }
  }

  /* ===============================
     MAIN ENTRY
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
          "… तुम ऐसा क्यों पूछ रहे हो?";
        break;

      case "emotional-response":
        finalText =
          "आज तुम कुछ सोच में डूबे लगते हो… " +
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
    mode: "conversational-rhythm"
  });

})();
