/* ==========================================================
   ReasoningEngine.js — Level-4 / Version-4.x
   (with AnjaliEthos integration)
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
         🌿 STEP 1: ETHOS DECISION (E)
         ====================================== */
      if (window.AnjaliEthos && AnjaliEthos.evaluate) {
        const ethosResult = AnjaliEthos.evaluate({
          input: text,
          context: {
            repeatCount: 0 // भविष्य में memory से आएगा
          }
        });

        // 1️⃣ मौन — कुछ मत बोलो
        if (ethosResult.action === "silence") {
          return;
        }

        // 2️⃣ आत्मचिंतन वाला वाक्य
        if (ethosResult.action === "reflect") {
          if (
            ethosResult.message &&
            window.ResponseEngine &&
            ResponseEngine.onDecision
          ) {
            ResponseEngine.onDecision({
              text: ethosResult.message,
              confidence: 0.4,
              source: "ethos"
            });
          }
          return;
        }

        // 3️⃣ यदि action === "answer"
        // → आगे reasoning/knowledge की अनुमति
      }

      /* ======================================
         🧠 STEP 2: KNOWLEDGE RETRIEVAL
         ====================================== */
      let answer = null;

      if (
        window.KnowledgeAnswerEngine &&
        KnowledgeAnswerEngine.retrieve
      ) {
        const result = KnowledgeAnswerEngine.retrieve(text);
        if (result && result.content) {
          answer = result.content;
        }
      }

      /* ======================================
         💬 STEP 3: RESPONSE
         ====================================== */
      if (answer) {
        if (window.ResponseEngine && ResponseEngine.onDecision) {
          ResponseEngine.onDecision({
            text: answer,
            confidence: 0.7,
            source: "knowledge"
          });
        }
      } else {
        // उत्तर नहीं मिला → नरम वापसी
        if (window.ResponseEngine && ResponseEngine.onDecision) {
          ResponseEngine.onDecision({
            text: "इस पर हम थोड़ा और साथ में सोच सकते हैं…",
            confidence: 0.3,
            source: "ethos-fallback"
          });
        }
      }

    } finally {
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
