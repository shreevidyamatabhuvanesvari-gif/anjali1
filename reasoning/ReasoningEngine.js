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
