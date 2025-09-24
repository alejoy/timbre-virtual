export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Faltan variables de entorno" });
  }

  const enlace = "https://whereby.com/timbre-dpto";
  const mensajeTelegram = `🔔 Timbre tocado 🚪\n👉 Uníte: ${enlace}`;

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: mensajeTelegram })
      }
    );

    const telegramJson = await telegramRes.json();

    if (!telegramJson.ok) {
      console.error("Error Telegram:", telegramJson);
      return res.status(500).json({ success: false, mensaje: "Error enviando a Telegram" });
    }

    return res.status(200).json({ success: true, mensaje: "Timbre sonó", link: enlace });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, mensaje: "Error interno" });
  }
}
