import fetch from "node-fetch";

export default async function handler(req, res) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  const mensaje = "🔔 Alguien tocó el timbre 🚪";

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje
      })
    });

    // Redirigir al visitante a Jitsi
    res.writeHead(302, { Location: "https://meet.jit.si/TimbreDeptoAlejo" });
    res.end();
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    res.status(500).send("Error al tocar el timbre");
  }
}
