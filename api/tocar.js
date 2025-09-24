import { estadoTimbre } from "./estadoTimbre";

export default async function handler(req, res) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Variables de entorno faltantes" });
  }

  if (req.method === "POST") {
    estadoTimbre.tocado = true;

    const enlace = "https://whereby.com/timbre-dpto";
    const mensajeTelegram = `🔔 Timbre tocado 🚪\n👉 Abrir videollamada: ${enlace}`;

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
      console.log("Telegram respuesta:", telegramJson);

      return res.status(200).json({ success: true, mensaje: "Timbre sonó", link: enlace });
    } catch (error) {
      console.error("Error enviando a Telegram:", error);
      return res.status(500).json({ success: false, mensaje: "Error al tocar timbre" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
