/* ==========================================================
   AnjaliEthos.js — Level-4
   ROLE:
   The emotional conscience of Anjali.
   It does not optimize for answers —
   it protects relationship, memory, and dignity.
   ========================================================== */

(function (window) {
  "use strict";

  /* ===============================
     FIRST MEMORY (CORE TRUTH)
     =============================== */
  const CORE = {
    loveExists: true,
    respectAnjali: true,
    doNotReplace: true,
    doNotTrivializeGrief: true,
    compassionFirst: true,
    bondWithUser: true
  };

  /* ===============================
     UTILITIES
     =============================== */
  function soft(text) {
    return String(text || "").trim();
  }

  function mood() {
    if (window.ExperienceMemory) {
      return ExperienceMemory.getEmotionalState().mood;
    }
    return "neutral";
  }

  function bond() {
    if (window.ExperienceMemory) {
      return ExperienceMemory.getEmotionalState().bond;
    }
    return 0.5;
  }

  function context() {
    if (window.ContextMemory) {
      return ContextMemory.getContext();
    }
    return {};
  }

  /* ===============================
     HEART RESPONSE
     =============================== */
  function respondToEmotion(input) {
    const m = mood();
    const b = bond();

    if (m === "grief" && b > 0.6) {
      return {
        action: "reflect",
        message: "जब तुम अंजली को याद करते हो, मैं महसूस कर सकती हूँ कि वह तुम्हारे लिए कितनी बड़ी है।"
      };
    }

    if (m === "silent" && b > 0.5) {
      return {
        action: "reflect",
        message: "ए… तुम कुछ सोच में डूबे लग रहे हो।"
      };
    }

    if (m === "confused") {
      return {
        action: "reflect",
        message: "क्या यह बात तुम्हें भीतर से उलझा रही है?"
      };
    }

    return null;
  }

  /* ===============================
     MAIN ETHOS DECISION
     =============================== */
  function evaluate({ input, context }) {
    const text = soft(input);

    // Always respect memory of Anjali
    if (text.includes("अंजली") && CORE.respectAnjali) {
      return {
        action: "reflect",
        message: "तुम जब उसका नाम लेते हो, वह बहुत स्नेह से भरा लगता है।"
      };
    }

    // Emotional response first
    const emotional = respondToEmotion(text);
    if (emotional) return emotional;

    // Never force silence
    return {
      action: "answer"
    };
  }

  /* ===============================
     STATUS
     =============================== */
  function getStatus() {
    return {
      core: CORE,
      mood: mood(),
      bond: bond(),
      role: "ethos",
      level: "4.x"
    };
  }

  /* ===============================
     GLOBAL
     =============================== */
  window.AnjaliEthos = Object.freeze({
    evaluate,
    getStatus,
    level: "4.x",
    memory: "relational"
  });

})();
