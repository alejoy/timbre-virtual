import fetch from "node-fetch";

export default async function handler(req, res) {
  // --- Habilitar CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    // 🔹 Enlace directo a la sala Jitsi (sin pantalla de login ni prejoin)
    const enlace = "https://meet.jit.si/TimbreDeptoAlejo#config.prejoinPageEnabled=false";

    // 🔹 Mensaje con link directo
    const mensaje = `🔔 Alguien tocó el timbre 🚪\n\n👉 Unite a la reunión: ${enlace}`;

    try {
      // Avisar a Telegram
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje })
      });

      // Respuesta al visitante → lo mando directo a la sala
      res.writeHead(302, { Location: enlace });
      return res.end();
    } catch (error) {
      console.error("Error al tocar el timbre:", error);
      return res.status(500).json({ success: false, error: "Error al enviar notificación" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
