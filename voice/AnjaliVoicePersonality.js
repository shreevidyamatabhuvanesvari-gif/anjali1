/* ==========================================================
   AnjaliVoicePersonality.js
   Level: 4.x
   ROLE:
   Soft, warm, conversational voice personality.
   No identity claim. No narration.
   Gentle presence through tone, pace, pauses.
   ========================================================== */

(function (window) {
  "use strict";

  if (!window.TTS) {
    console.warn("AnjaliVoicePersonality: TTS missing");
    return;
  }

  /* ===============================
     VOICE PROFILE (LOCKED)
     =============================== */
  const VOICE_PROFILE = {
    rate: 0.65,     // धीमी, पर बोझिल नहीं
    pitch: 1.15,    // स्त्री-स्वर, हल्की चंचलता
    volume: 0.45    // पास बैठी-सी अनुभूति
  };

  /* ===============================
     INTERNAL STATE
     =============================== */
  let lastSpokenAt = 0;
  const MIN_GAP = 12000; // बार-बार बोलने से बचाव

  /* ===============================
     NATURAL FILLERS
     (कभी-कभी, हर बार नहीं)
     =============================== */
  const FILLERS = [
    "हूँ…",
    "अच्छा…",
    "ठीक है…",
    "…",
    ""
  ];

  function pickSoftFiller() {
    return FILLERS[Math.floor(Math.random() * FILLERS.length)];
  }

  /* ===============================
     SPEAK (SOFT & HONEST)
     =============================== */
  function speakSoft(text, options = {}) {
    const now = Date.now();
    if (now - lastSpokenAt < MIN_GAP) return;

    lastSpokenAt = now;

    const finalText =
      typeof text === "string" && text.trim().length
        ? text
        : pickSoftFiller();

    try {
      window.TTS.speak(finalText, {
        rate: options.rate || VOICE_PROFILE.rate,
        pitch: options.pitch || VOICE_PROFILE.pitch,
        volume: options.volume || VOICE_PROFILE.volume
      });
    } catch (e) {
      // मौन भी स्वीकार्य है
    }
  }

  /* ===============================
     CONTEXTUAL REACTIONS
     (हर बात पर उत्तर नहीं)
     =============================== */
  function gentleAcknowledge() {
    speakSoft(pickSoftFiller());
  }

  function calmQuestion(questionText) {
    speakSoft(questionText, { rate: 0.7 });
  }

  function reflectivePause() {
    speakSoft("…", { volume: 0.2 });
  }

  /* ===============================
     PUBLIC API (LIMITED)
     =============================== */
  window.AnjaliVoicePersonality = Object.freeze({
    acknowledge: gentleAcknowledge,
    ask: calmQuestion,
    pause: reflectivePause,
    speak: speakSoft,
    level: "4.x",
    role: "voice-personality"
  });

})(window);
