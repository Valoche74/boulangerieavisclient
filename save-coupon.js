const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbydbdsUOR49i5BO6-eBIgvtFZN0etKi91IOvd3XlAaK8Ylo4AFqjd80w9CSeo_m9B8x/exec";

export default async function handler(req, res) {
  // ── Seul POST autorisé ──
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const { code, gain, prenom, nom, email, emoji, commerce } = req.body || {};

    // ── Validation champs requis ──
    if (!code || !email || !prenom) {
      return res
        .status(400)
        .json({ status: "error", message: "Champs requis manquants (code, email, prenom)" });
    }

    // ── Construire l'URL Apps Script ──
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set("action", "save");
    url.searchParams.set("code", code);
    url.searchParams.set("gain", gain || "Votre cadeau");
    url.searchParams.set("prenom", prenom);
    url.searchParams.set("nom", nom || "");
    url.searchParams.set("email", email);
    url.searchParams.set("emoji", emoji || "🎁");
    url.searchParams.set("commerce", commerce || "Falman Emmanuelle et Flavien");

    console.log("[save-coupon] Appel Apps Script pour code:", code);

    // ── Appel serveur → serveur (pas de CORS) ──
    const response = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
    });

    const text = await response.text();
    console.log("[save-coupon] HTTP", response.status, "— réponse brute:", text.slice(0, 500));

    // ── Parser la réponse JSON ──
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        status: "error",
        message: "Réponse Apps Script invalide (pas du JSON)",
        raw: text.slice(0, 300),
      });
    }

    // ── Vérifier le statut ──
    if (!response.ok || data.status === "error") {
      console.error("[save-coupon] Erreur Apps Script:", JSON.stringify(data));
      return res.status(502).json(data);
    }

    console.log("[save-coupon] Succès:", JSON.stringify(data));
    return res.status(200).json(data);
  } catch (error) {
    console.error("[save-coupon] Erreur serveur:", error.message, error.stack);
    return res.status(500).json({
      status: "error",
      message: error.message || "Erreur serveur interne",
    });
  }
}
