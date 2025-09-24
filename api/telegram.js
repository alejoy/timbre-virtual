import { estadoTimbre } from "./estadoTimbre";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;
    if (message && message.text) {
      estadoTimbre.mensajes.push({ de: "admin", texto: message.text });
    }
    return res.status(200).send("OK");
  }
  return res.status(405).send("Método no permitido");
}
