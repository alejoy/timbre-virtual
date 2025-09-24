import fetch from "node-fetch";

export default async function handler(req, res) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  const enlace = "https://timbre-dpto.daily.co/timbre-dpto";

  const mensaje = `🔔 Alguien tocó el timbre 🚪\n\n👉 Unite a la reunión: ${enlace}`;

  try {
    // Avisar a Telegram
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje })
    });

    // Redirigir al visitante a Daily.co
    res.writeHead(302, { Location: enlace });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al tocar el timbre");
  }
}
