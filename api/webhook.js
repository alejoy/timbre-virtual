// api/webhook.js
export default async function handler(req, res) {
  console.log("🔔 Webhook alcanzado:", req.method);

  if (req.method === "POST") {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => (data += chunk));
        req.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
        req.on("error", reject);
      });

      console.log("📬 Mensaje recibido de Telegram:", body);

      // 🔹 Aquí podrías reenviar al frontend o guardar en DB
      // Ejemplo simple: log + respuesta OK
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("❌ Error parseando webhook body:", err);
      return res.status(200).json({ ok: false });
    }
  }

  return res.status(200).send("Webhook activo ✅");
}
