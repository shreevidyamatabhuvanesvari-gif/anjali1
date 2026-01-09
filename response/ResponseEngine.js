/* ==========================================================
   ReasoningEngine.js — Level-4 / Version-4.x
   Ethos-guided | Knowledge-aware | ResponseEngine-bridged
   ========================================================== */

(function () {
  "use strict";

  let busy = false;

  function process(inputText) {
    if (busy) return;
    busy = true;

    try {
      const text = String(inputText || "").trim();
      if (!text) return;

      /* ======================================
         🌿 STEP 1: ETHOS EVALUATION (E)
         ====================================== */
      if (window.AnjaliEthos && typeof AnjaliEthos.evaluate === "function") {
        const ethosResult = AnjaliEthos.evaluate({
          input: text,
          context: {
            repeatCount: 0 // future: ContextMemory
          }
        });

        // 1️⃣ मौन — कोई प्रतिक्रिया नहीं
        if (ethosResult && ethosResult.action === "silence") {
          return;
        }

        // 2️⃣ चिंतन / अनुभूति
        if (ethosResult && ethosResult.action === "reflect") {
          if (
            ethosResult.message &&
            window.ResponseEngine &&
            typeof ResponseEngine.respond === "function"
          ) {
            ResponseEngine.respond({
              text: ethosResult.message,
              confidence: 0.4,
              source: "ethos-reflection"
            });
          }
          return;
        }

        // 3️⃣ यदि action === "answer"
        // → आगे reasoning / knowledge की अनुमति
      }

      /* ======================================
         🧠 STEP 2: KNOWLEDGE RETRIEVAL
         ====================================== */
      let answer = null;

      if (
        window.KnowledgeAnswerEngine &&
        typeof KnowledgeAnswerEngine.retrieve === "function"
      ) {
        const result = KnowledgeAnswerEngine.retrieve(text);
        if (result && result.content) {
          answer = result.content;
        }
      }

      /* ======================================
         💬 STEP 3: FINAL RESPONSE DECISION
         ====================================== */
      if (window.ResponseEngine && typeof ResponseEngine.respond === "function") {

        if (answer) {
          const finalDecision = {
            text: answer,
            confidence: 0.7,
            source: "knowledge"
          };
          ResponseEngine.respond(finalDecision);

        } else {
          // ज्ञान नहीं मिला → नरम, साथ देने वाला उत्तर
          ResponseEngine.respond({
            text: "इस पर हम थोड़ा और साथ में सोच सकते हैं…",
            confidence: 0.3,
            source: "ethos-fallback"
          });
        }
      }

    } finally {
      // 🔐 DEADLOCK PROTECTION — अनिवार्य
      busy = false;
    }
  }

  /* ===============================
     GLOBAL EXPOSE
     =============================== */
  window.ReasoningEngine = Object.freeze({
    process,
    level: "4.x",
    mode: "ethos-guided"
  });

})();







response/ResponseEngine.js


/* ==========================================================
   ResponseEngine.js
   Level-4 / Version-4.x (FINAL)
   ROLE:
   Living conversation with restraint & warmth
   ========================================================== */

(function (window) {
  "use strict";

  let lastSpokenAt = 0;
  let presenceRecently = false;

  const MIN_SPEAK_GAP = 7000;

  function now() {
    return Date.now();
  }

  /* ---- Presence coordination ---- */
  window.addEventListener("anjali:presence-activated", () => {
    presenceRecently = true;
    setTimeout(() => {
      presenceRecently = false;
    }, 2000); // Presence का सम्मान
  });

  /* ---- Voice Personality (B) ---- */
  function speakSoftly(text) {
    if (!window.TTS || typeof window.TTS.speak !== "function") return;

    try {
      window.TTS.speak(text, {
        rate: 0.88,
        pitch: 1.05,
        volume: 0.75
      });
    } catch (_) {
      /* भाव नहीं टूटने चाहिए */
    }
  }

  /* ---- Conversational Rhythm (C) ---- */
  function decideMode(result) {
    const t = now();

    if (presenceRecently) return "presence";

    if (t - lastSpokenAt < MIN_SPEAK_GAP) return "presence";

    if (result.confidence < 0.45) return "reflective-question";
    if (result.confidence < 0.75) return "gentle-answer";

    return "answer-plus";
  }

  function gentleAnswer(text) {
    speakSoftly(text);
  }

  function reflectiveQuestion() {
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

    if (Math.random() < 0.4) {
      setTimeout(() => {
        speakSoftly("…और तुम क्या सोचते हो?");
      }, 2200);
    }
  }

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
        /* जानबूझकर मौन */
        break;
    }
  }

  function getStatus() {
    return {
      lastSpokenAt,
      role: "response-engine",
      level: "4.x",
      personality: "soft-playful-calm",
      rhythm: "human-like"
    };
  }

  window.ResponseEngine = Object.freeze({
    respond,
    getStatus,
    level: "4.x",
    mode: "conversational"
  });

})(window);
   
