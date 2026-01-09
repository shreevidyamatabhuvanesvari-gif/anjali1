/* ==========================================================
   AnjaliEthos.js — Level-4 / Version-4.x
   ROLE:
   अंजली के संवाद का नैतिक-भावनात्मक नियंत्रण।
   यह तय करता है कि:
   - कब उत्तर दिया जाए
   - कब प्रश्न लौटाया जाए
   - कब मौन रखा जाए
   - कब केवल साथ बना रहे

   NOTE:
   यह फ़ाइल कभी भी:
   - स्वयं को घोषित नहीं करती
   - उत्तर नहीं बनाती
   - ज्ञान नहीं खोजती
   ========================================================== */

(function () {
  "use strict";

  /* ===============================
     INTERNAL ETHOS RULES
     =============================== */

  function isHighlyEmotional(text) {
    return /टूट|थक|अकेल|रो|दर्द|खो|नहीं रहा|खाली/i.test(text);
  }

  function isReflective(text) {
    return /लगता है|महसूस|सोच|आज मन|कभी कभी/i.test(text);
  }

  function isPurelyInformational(text) {
    return /कैसे|क्या है|क्यों|तरीका|बनता है|नियम/i.test(text);
  }

  function isOverdependentTone(context) {
    // भविष्य सुरक्षा: निर्भरता रोकना
    return context && context.repeatCount > 5;
  }

  /* ===============================
     CORE ETHOS EVALUATION
     =============================== */
  function evaluate({ input, context = {}, emotionalState = {} }) {
    const text = String(input || "").trim();
    if (!text) {
      return { action: "silence", reason: "empty-input" };
    }

    /* 1️⃣ अत्यधिक भावनात्मक अवस्था */
    if (isHighlyEmotional(text)) {
      return {
        action: "silence",
        reason: "high-emotional-load"
      };
    }

    /* 2️⃣ आत्मचिंतन / अनुभूति */
    if (isReflective(text)) {
      return {
        action: "reflect",
        message: "आज तुम कुछ ज़्यादा भीतर देख रहे हो…",
        reason: "reflective-dialogue"
      };
    }

    /* 3️⃣ निर्भरता बनने की आशंका */
    if (isOverdependentTone(context)) {
      return {
        action: "reflect",
        message: "ज़रा रुक कर सोचें — तुम्हारा अपना विचार क्या कहता है?",
        reason: "dependency-prevention"
      };
    }

    /* 4️⃣ सामान्य ज्ञान / व्यवहारिक प्रश्न */
    if (isPurelyInformational(text)) {
      return {
        action: "answer",
        reason: "informational"
      };
    }

    /* 5️⃣ अस्पष्ट लेकिन हल्का प्रश्न */
    return {
      action: "reflect",
      message: "तुम इसे किस तरह से देख रहे हो…?",
      reason: "open-ended-support"
    };
  }

  /* ===============================
     PUBLIC EXPOSURE
     =============================== */
  window.AnjaliEthos = Object.freeze({
    evaluate,
    level: "4.x",
    role: "ethical-dialogue-guardian"
  });

})();
