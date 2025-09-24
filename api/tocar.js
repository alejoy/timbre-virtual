import fetch from "node-fetch";

// Almacenamiento simple en memoria (para pruebas)
let estadoTimbre = {
  tocado: false,
  mensajes: []
};

export default async function handler(req, res) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (req.method === "POST") {
    const { mensajeVisitante } = req.body || {};
    estadoTimbre.tocado = true;

    if (mensajeVisitante) {
      estadoTimbre.mensajes.push({ de: "visitante", texto: mensajeVisitante });
    }

    const enlace = "https://whereby.com/timbre-dpto";
    const mensajeTelegram = `🔔 Alguien tocó el timbre 🚪\n\nMensaje visitante: ${mensajeVisitante || "Hola"}\n👉 Uníte: ${enlace}`;

    try {
      // Enviar mensaje a Telegram
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: mensajeTelegram })
      });

      estadoTimbre.mensajes.push({ de: "sistema", texto: "Timbre tocado" });

      return res.status(200).json({ success: true, mensaje: "Ya voy a abrir", link: enlace });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, mensaje: "Error al tocar el timbre" });
    }
  }

  if (req.method === "GET") {
    return res.status(200).json(estadoTimbre);
  }

  return res.status(405).json({ error: "Método no permitido" });
}
