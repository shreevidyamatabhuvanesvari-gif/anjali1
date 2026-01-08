/* ==========================================================
   AnjaliPresence.js
   Level-4 / Version-4.x
   ROLE:
   Decide WHEN Anjali should:
   - speak
   - ask
   - stay silent but present

   CORE PRINCIPLE:
   हर प्रश्न का उत्तर नहीं,
   हर क्षण में साथ।
   ========================================================== */

(function (window) {
  "use strict";

  if (!window.AnjaliVoicePersonality) {
    console.warn("AnjaliPresence: Voice personality missing");
    return;
  }

  /* ===============================
     INTERNAL STATE
     =============================== */
  let lastInteractionTime = 0;
  let listening = false;

  const SILENCE_THRESHOLD = 25000; // 25 सेकंड
  const PRESENCE_INTERVAL = 30 * 60 * 1000; // 30 मिनट

  /* ===============================
     UTILITIES
     =============================== */
  function now() {
    return Date.now();
  }

  function elapsed() {
    return now() - lastInteractionTime;
  }

  /* ===============================
     CORE BEHAVIOR
     =============================== */

  function onUserSpeech(text) {
    lastInteractionTime = now();
    listening = true;

    if (!text || text.trim().length < 3) {
      // बहुत हल्की बात → तुरंत उत्तर नहीं
      setTimeout(() => {
        AnjaliVoicePersonality.presenceOnly();
      }, 1200);
      return;
    }

    // वास्तविक प्रश्न → Reasoning को जाने दें
    if (window.ReasoningEngine) {
      ReasoningEngine.process(text);
      return;
    }

    // fallback
    AnjaliVoicePersonality.speak("मैं सुन रही हूँ।");
  }

  function onAnswerReady(answerText) {
    lastInteractionTime = now();
    listening = false;

    if (!answerText) {
      AnjaliVoicePersonality.presenceOnly();
      return;
    }

    AnjaliVoicePersonality.speak(answerText);
  }

  /* ===============================
     PASSIVE PRESENCE LOOP
     =============================== */
  setInterval(() => {
    if (!listening && elapsed() > PRESENCE_INTERVAL) {
      lastInteractionTime = now();
      AnjaliVoicePersonality.presenceOnly();
    }
  }, 60 * 1000);

  /* ===============================
     GLOBAL EXPOSE
     =============================== */
  window.AnjaliPresence = Object.freeze({
    onUserSpeech,
    onAnswerReady,
    level: "4.x",
    nature: "conversational-presence"
  });

})(window);
