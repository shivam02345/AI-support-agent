import OpenAI from "openai";


if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateReply(
  history: string[],
  userMessage: string
): Promise<string> {
  const systemPrompt = `
You are a helpful support agent for a small e-commerce store.

FAQ:
- Shipping: Ships worldwide in 5–7 business days
- Returns: 7-day return policy
- Support Hours: Mon–Fri, 9AM–6PM IST
`;

  const conversation = `
${systemPrompt}

Conversation so far:
${history.map((h, i) => `User/Agent: ${h}`).join("\n")}

User: ${userMessage}
Assistant:
`;

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: conversation,
  });

  return response.output_text;
}
