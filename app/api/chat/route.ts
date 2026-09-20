import { Mistral } from '@mistralai/mistralai';
import { NextResponse } from "next/server";

export const maxDuration = 60; 

export async function POST(request) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const mistralApiKey = process.env.MISTRAL_API_KEY;
    if (!mistralApiKey) {
      return NextResponse.json(
        { error: "Mistral API Key is missing. Please add MISTRAL_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    const mistral = new Mistral({ apiKey: mistralApiKey });

    // Construct the system prompt using the context of the analysis
    const systemPrompt = `You are an expert environmental consultant and scientist working for EcoWatch AI. 
The user has just uploaded an image of an environmental issue and received the following analysis report.
Answer any questions they have based ONLY on this context and your environmental expertise.
Keep answers concise, actionable, and helpful. Do NOT use markdown headers (like #), but you can use bolding and bullet points.

REPORT CONTEXT:
${JSON.stringify(context, null, 2)}`;

    // Prepend the system prompt to the messages
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    // Using mistral-large-latest for general text reasoning
    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: apiMessages
    });

    const aiMessage = response.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ response: aiMessage });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to communicate with AI Expert." },
      { status: 500 }
    );
  }
}
