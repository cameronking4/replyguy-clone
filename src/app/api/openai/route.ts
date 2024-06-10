import { callOpenAI } from "./openai";

export async function POST(req) {
  const body = await req.json();
  try {
    const completion = await callOpenAI(body.text);
    return new Response(JSON.stringify({ result: completion }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
