let messages = []; // Guardar mensajes entrantes

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const rawBody = Buffer.concat(chunks).toString("utf8");
      const body = JSON.parse(rawBody);

      console.log("📩 Mensaje recibido de Telegram:", body);

      if (body.message) {
        const chatId = body.message.chat.id;
        const text = body.message.text;

        messages.push({ chatId, text, date: new Date() });

        // Opcional: responder automáticamente al visitante
        await fetch(
          `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: "Tu mensaje llegó ✅",
            }),
          }
        );
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("❌ Error parseando webhook body:", err);
      return res.status(500).json({ ok: false });
    }
  }

  // GET → devolver mensajes guardados
  if (req.method === "GET") {
    return res.status(200).json({ messages });
  }

  return res.status(200).send("Webhook activo ✅");
}
