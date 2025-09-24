export default async function handler(req, res) {
  console.log("Solicitud recibida:", req.method);

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    console.error("Variables de entorno faltantes");
    return res.status(500).json({ error: "Variables de entorno faltantes" });
  }

  if (req.method === "POST") {
    const { mensajeVisitante } = req.body || {};
    console.log("Mensaje visitante:", mensajeVisitante);

    const enlace = "https://whereby.com/timbre-dpto";
    const mensajeTelegram = `🔔 Alguien tocó el timbre 🚪\n\nMensaje visitante: ${mensajeVisitante || "Hola"}\n👉 Uníte: ${enlace}`;

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
      console.log("Respuesta Telegram:", telegramJson);

      return res.status(200).json({ success: true, mensaje: "Ya voy a abrir", link: enlace });
    } catch (error) {
      console.error("Error enviando a Telegram:", error);
      return res.status(500).json({ success: false, mensaje: "Error al tocar el timbre" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
