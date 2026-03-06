import { Router } from "express";

const router = Router();

type AIAction =
  | "improve"
  | "formal"
  | "simplify"
  | "expand"
  | "translate_en"
  | "generate_email"
  | "generate_announcement"
  | "generate_quiz"
  | "generate_response"
  | "generate_request"
  | "generate_portfolio"
  | "generate_description"
  | "generate_forum";

function buildSystemPrompt(): string {
  return `Tu es un assistant d'écriture intégré dans un dashboard universitaire.
Tu aides les utilisateurs (étudiants, professeurs, administrateurs) à rédiger et améliorer leurs textes.
Réponds UNIQUEMENT avec le texte amélioré/généré, sans commentaires ni explications.
Conserve la langue originale du texte sauf si on te demande de traduire.
Si le texte d'entrée est vide et qu'on te demande de générer, produis un exemple pertinent.`;
}

function buildUserPrompt(action: AIAction, text: string, context?: string): string {
  const contextLabel = context ? ` (contexte: ${context})` : "";

  const prompts: Record<AIAction, string> = {
    improve: `Améliore ce texte en gardant le même sens et la même longueur${contextLabel}:\n\n${text}`,
    formal: `Reformule ce texte avec un ton formel et professionnel${contextLabel}:\n\n${text}`,
    simplify: `Simplifie ce texte pour le rendre plus clair et concis${contextLabel}:\n\n${text}`,
    expand: `Développe et enrichis ce texte avec plus de détails${contextLabel}:\n\n${text}`,
    translate_en: `Traduis ce texte en anglais${contextLabel}:\n\n${text}`,
    generate_email: `Génère un email professionnel universitaire à partir de ces indications${contextLabel}:\n\n${text || "Email professionnel pour un contexte universitaire"}`,
    generate_announcement: `Génère une annonce claire et informative pour un cours universitaire${contextLabel}:\n\n${text || "Annonce pour les étudiants du cours"}`,
    generate_quiz: `Génère une question de quiz avec 4 options de réponse (indique la bonne réponse)${contextLabel}:\n\n${text || "Question de quiz universitaire"}`,
    generate_response: `Génère une réponse professionnelle et bienveillante à cette demande administrative${contextLabel}:\n\n${text || "Réponse administrative"}`,
    generate_request: `Génère une demande administrative formelle et polie${contextLabel}:\n\n${text || "Demande administrative universitaire"}`,
    generate_portfolio: `Génère une description de projet/compétence pour un portfolio étudiant${contextLabel}:\n\n${text || "Description de projet étudiant"}`,
    generate_description: `Génère une description détaillée et claire${contextLabel}:\n\n${text || "Description pour un contexte universitaire"}`,
    generate_forum: `Génère un message de discussion pour un forum de cours${contextLabel}:\n\n${text || "Message de forum universitaire"}`,
  };

  return prompts[action] || prompts.improve;
}

router.post("/assist", async (req, res) => {
  try {
    const { text, action, context } = req.body as {
      text: string;
      action: AIAction;
      context?: string;
    };

    if (!action) {
      res.status(400).json({ error: "Le champ 'action' est requis" });
      return;
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Clé API Anthropic non configurée" });
      return;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: buildSystemPrompt(),
        messages: [
          {
            role: "user",
            content: buildUserPrompt(action, text || "", context),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Anthropic API error:", response.status, errorData);
      res.status(response.status).json({
        error: "Erreur de l'API Anthropic",
        details: response.status,
      });
      return;
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text?: string }>;
    };
    const resultText = data.content?.[0]?.text || "";

    res.json({ result: resultText });
  } catch (error) {
    console.error("AI assist error:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

export default router;
