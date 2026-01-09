// STEP 1 — ETHOS
const ethos = AnjaliEthos.evaluate({
  input: userText,
  context: ContextMemory.get()
});

if (ethos.action === "reflect") {
  ResponseEngine.respond({
    text: ethos.message,
    confidence: 0.4,
    mode: "ethos",
    tone: ethos.tone
  });
  return;
}

// STEP 2 — KNOWLEDGE
const result = KnowledgeAnswerEngine.retrieve(userText);

// STEP 3 — DECISION
const finalDecision = {
  text: result ? result.content : "…",
  confidence: result ? result.relevance : 0.35,
  mode: ethos.mode,
  tone: ethos.tone
};

ResponseEngine.respond(finalDecision);
