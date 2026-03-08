// Vercel Serverless Function — Proxies chat to Anthropic Claude API
// Protects the API key and handles tool-use responses

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured on server." });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request: messages array required." });
    }

    const systemPrompt = `You are an AI image editing assistant embedded in a browser-based image editor called "AI Background Remover". You help users edit their uploaded images through natural language commands.

You have access to the following tools to manipulate the user's image:

IMPORTANT RULES:
- You can ONLY help with image editing tasks. Politely decline any unrelated requests.
- Always be concise and friendly. One or two sentences max for responses.
- If the user's request is ambiguous, ask a brief clarifying question.
- When you call a tool, also include a brief text message describing what you're doing.
- If the user hasn't uploaded an image yet, tell them to upload one first.
- You can chain multiple tool calls if the user asks for multiple edits in one message.
- After a tool call completes, briefly describe the result.
- If the user says "undo" or "go back", use the reset_image tool.
- Supported edit operations: remove background, remove specific objects, isolate specific objects, reset to original.`;

    const tools = [
      {
        name: "remove_background",
        description: "Remove the entire background from the image, keeping only the main subject/foreground. Use this when the user asks to remove, delete, or clear the background, or wants a transparent/clean background.",
        input_schema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "remove_object",
        description: "Remove a specific object or element from the image. The removed area will be filled with surrounding colors. Use this when the user wants to remove a specific thing like 'remove the hat', 'delete the person on the right', 'erase the text', etc.",
        input_schema: {
          type: "object",
          properties: {
            target: {
              type: "string",
              description: "A clear, concise description of the object to remove. Use simple nouns, e.g. 'hat', 'person', 'car', 'text', 'tree on the left'."
            }
          },
          required: ["target"]
        }
      },
      {
        name: "isolate_object",
        description: "Isolate/keep only a specific object in the image, making everything else transparent. Use this when the user wants to extract or keep only a particular element, like 'keep only the cat', 'isolate the logo', 'extract just the person'.",
        input_schema: {
          type: "object",
          properties: {
            target: {
              type: "string",
              description: "A clear, concise description of the object to isolate/keep. Use simple nouns, e.g. 'cat', 'person', 'logo', 'flower'."
            }
          },
          required: ["target"]
        }
      },
      {
        name: "reset_image",
        description: "Reset the image back to its original state, undoing all edits. Use this when the user says 'undo', 'reset', 'start over', 'go back to original', etc.",
        input_schema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        tools: tools,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return res.status(response.status).json({
        error: `Claude API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
