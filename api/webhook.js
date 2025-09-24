let lastMessage = null; // guardamos el último mensaje recibido

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = req.body;

      // Mensaje entrante desde Telegram
      if (body.message && body.message.text) {
        lastMessage = body.message.text; // guardamos
        console.log("📩 Mensaje recibido de Telegram:", lastMessage);
      }

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("❌ Error webhook:", error);
      return res.status(500).json({ ok: false });
    }
  }

  if (req.method === "GET") {
    // frontend consulta el último mensaje
    return res.status(200).json({ mensaje: lastMessage });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
