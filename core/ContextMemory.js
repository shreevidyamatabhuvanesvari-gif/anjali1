/* ==========================================================
   ContextMemory.js — Level-4
   ROLE:
   Maintain live conversational context:
   mood, emotional bond, silence, intensity.
   Bridges ExperienceMemory → Ethos → Reasoning.
   ========================================================== */

(function (window) {
  "use strict";

  let lastUserText = "";
  let lastAnjaliText = "";
  let lastInteractionTime = 0;

  /* ===============================
     TIME
     =============================== */
  function now() {
    return Date.now();
  }

  /* ===============================
     UPDATE FROM CONVERSATION
     =============================== */
  function update(userText, anjaliText) {
    if (userText) lastUserText = userText;
    if (anjaliText) lastAnjaliText = anjaliText;
    lastInteractionTime = now();

    // Feed ExperienceMemory
    if (window.ExperienceMemory) {
      ExperienceMemory.record(userText, anjaliText);
    }
  }

  /* ===============================
     CURRENT CONTEXT
     =============================== */
  function getContext() {
    let emotion = "neutral";
    let bond = 0.5;

    if (window.ExperienceMemory) {
      const state = ExperienceMemory.getEmotionalState();
      emotion = state.mood;
      bond = state.bond;
    }

    return {
      lastUserText,
      lastAnjaliText,
      emotion,
      bond,
      secondsSinceLast: Math.floor((now() - lastInteractionTime) / 1000)
    };
  }

  /* ===============================
     RESET (rare, for safety)
     =============================== */
  function clear() {
    lastUserText = "";
    lastAnjaliText = "";
    lastInteractionTime = 0;
  }

  /* ===============================
     GLOBAL EXPOSE
     =============================== */
  window.ContextMemory = Object.freeze({
    update,
    getContext,
    clear,
    level: "4.x",
    role: "live-context"
  });

})(window);
