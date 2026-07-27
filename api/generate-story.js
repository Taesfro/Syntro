const storyCache = new Map();
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { systemPrompt, userMsg } = req.body || {};
  const cacheKey = JSON.stringify({
  systemPrompt,
  userMsg
});
  if (!systemPrompt || !userMsg) {
    res.status(400).json({ error: "campos_obrigatorios_ausentes" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY não configurada no servidor (veja README)." });
    return;
  }

  try {
    const model = "gemini-3-flash-preview";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userMsg }] }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
          temperature: 0.9
          if (storyCache.has(cacheKey)) {
  console.log("Resposta encontrada no cache.");

  return res.status(200).json({
    content: [
      {
        type: "text",
        text: storyCache.get(cacheKey)
      }
    ]
  });
}
        }
      })
    });

    const data = await response.json();

if (response.status === 429) {
  return res.status(429).json({
    error: "quota_exceeded",
    retryAfter: 20
  });
}
    const text = (data && data.candidates && data.candidates[0] && data.candidates[0].content
      && data.candidates[0].content.parts
      ? data.candidates[0].content.parts.map(p => p.text || "").join("")
      : "");

    if (!text) {
      res.status(500).json({ error: "sem_conteudo_da_ia" });
      return;
      storyCache.set(cacheKey, text);
    }
  res.status(200).json({
  content: [
    {
      type: "text",
      text
    }
  ]
});

    res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    res.status(500).json({ error: (err && err.message) ? err.message : "erro_ao_chamar_a_ia" });
  }
}
