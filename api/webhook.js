// api/webhook.js
export const config = {
  api: {
    bodyParser: false, // desactivamos el parser default
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // parsear el body "a mano"
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawBody = Buffer.concat(chunks).toString("utf8");
      const body = JSON.parse(rawBody);

      console.log("📩 Mensaje recibido de Telegram:", body);

      if (body.message) {
        const chatId = body.message.chat.id;
        const text = body.message.text;

        console.log(`Nuevo mensaje de ${chatId}: ${text}`);

        // Opcional: responder al chat
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

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("❌ Error parseando body:", err);
      return res.status(200).json({ ok: false });
    }
  }

  res.status(200).send("Webhook activo");
}


    // Telegram necesita un 200 rápido
    return res.status(200).json({ ok: true });
  }

  res.status(200).send("Webhook activo");
}
