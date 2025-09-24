import fetch from "node-fetch";

export default async function handler(req, res) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  // Enlace directo a la sala de Whereby
  const enlace = "https://whereby.com/timbre-dpto";

  // Mensaje que se enviará a Telegram
  const mensaje = `🔔 Alguien tocó el timbre 🚪\n\n👉 Uníte a la reunión: ${enlace}`;

  try {
    // Enviar mensaje a Telegram
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje })
    });

    // Redirigir al visitante a la sala de Whereby
    res.writeHead(302, { Location: enlace });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al tocar el timbre");
  }
}
