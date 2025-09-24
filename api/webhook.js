// api/webhook.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body;

    // Ver que Telegram manda algo
    console.log("Mensaje recibido de Telegram:", body);

    // Si es un mensaje normal de chat
    if (body.message) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      console.log(`Nuevo mensaje de ${chatId}: ${text}`);

      // Opcional: responder con un eco para test
      await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `Eco: ${text}`,
          }),
        }
      );
    }

    // Telegram necesita un 200 rápido
    return res.status(200).json({ ok: true });
  }

  res.status(200).send("Webhook activo");
}
