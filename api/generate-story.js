export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { systemPrompt, userMsg } = req.body || {};
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
        }
      })
    });

    const data = await response.json();

    if (response.status === 429) {
    throw new Error(
      "Muitas jornadas estão sendo criadas agora. Aguarde cerca de 20 segundos e tente novamente."
    );
}
    const text = (data && data.candidates && data.candidates[0] && data.candidates[0].content
      && data.candidates[0].content.parts
      ? data.candidates[0].content.parts.map(p => p.text || "").join("")
      : "");

    if (!text) {
      res.status(500).json({ error: "sem_conteudo_da_ia" });
      return;
    }

    res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    res.status(500).json({ error: (err && err.message) ? err.message : "erro_ao_chamar_a_ia" });
  }
}
