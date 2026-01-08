/* ==========================================================
   AnjaliPresence.js
   Level-4 / Version-4.x
   ROLE:
   Maintain emotional + conversational presence.
   Decide WHEN to respond, HOW to respond, or
   WHEN to simply stay present and listening.

   IMPORTANT PHILOSOPHY:
   - अंजली हर प्रश्न का उत्तर देती है
   - पर हर वाक्य पर प्रतिक्रिया नहीं थोपती
   - चुप रहना = अनुपस्थिति नहीं
   ========================================================== */

(function (window) {
  "use strict";

  /* ===============================
     INTERNAL STATE
     =============================== */
  let active = false;
  let lastHeardAt = 0;
  let lastSpokenAt = 0;
  let silenceTimer = null;

  const SILENCE_CHECK_MS = 30 * 60 * 1000; // 30 मिनट
  const MIN_GAP_BETWEEN_SPEECH = 8 * 1000; // 8 सेकंड

  /* ===============================
     UTILITIES
     =============================== */
  function now() {
    return Date.now();
  }

  function isCallingAnjali(text) {
    if (!text) return false;
    return /(^|\s)अंजली(\s|$)/i.test(text);
  }

  function isQuestion(text) {
    return /[?？]|क्या|कैसे|क्यों|कब|कहाँ|बताओ|बताइए/i.test(text);
  }

  function canSpeak() {
    return now() - lastSpokenAt > MIN_GAP_BETWEEN_SPEECH;
  }

  /* ===============================
     CORE PRESENCE LOGIC
     =============================== */
  function observeInput(text) {
    lastHeardAt = now();

    // अंजली नाम से पुकारे जाने पर सक्रिय
    if (!active && isCallingAnjali(text)) {
      active = true;
      softlyAcknowledge();
      return;
    }

    if (!active) return;

    // प्रश्न है → उत्तर का प्रयास अनिवार्य
    if (isQuestion(text)) {
      forwardForAnswer(text);
      return;
    }

    // साधारण बात → सुनना भी उत्तर है
    remainPresent();
  }

  /* ===============================
     RESPONSE DECISIONS
     =============================== */
  function softlyAcknowledge() {
    if (!window.TTS || !canSpeak()) return;

    lastSpokenAt = now();
    TTS.speak("ए सुनो…");
  }

  function forwardForAnswer(text) {
    if (!window.KnowledgeAnswerEngine) return;

    const result = KnowledgeAnswerEngine.retrieve(text);

    if (result && result.content && window.ResponseEngine) {
      lastSpokenAt = now();
      ResponseEngine.onDecision({
        text: result.content,
        confidence: result.relevance || 0.6
      });
      return;
    }

    // यदि उत्तर न मिले — तब भी अनुपस्थिति नहीं
    if (window.TTS && canSpeak()) {
      lastSpokenAt = now();
      TTS.speak("थोड़ा सोचने दो… हम इस पर फिर बात करेंगे।");
    }
  }

  function remainPresent() {
    // जानबूझकर मौन
    scheduleSilencePresence();
  }

  /* ===============================
     SILENCE PRESENCE (30 min)
     =============================== */
  function scheduleSilencePresence() {
    if (silenceTimer) return;

    silenceTimer = setTimeout(() => {
      if (!active) return;

      if (window.TTS) {
        lastSpokenAt = now();
        TTS.speak("मैं यहीं हूँ…");
      }
      silenceTimer = null;
    }, SILENCE_CHECK_MS);
  }

  /* ===============================
     PUBLIC API
     =============================== */
  window.AnjaliPresence = Object.freeze({
    observeInput,
    isActive: () => active,
    level: "4.x",
    mode: "presence-companion"
  });

})(window);
