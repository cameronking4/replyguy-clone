import { callOpenAI } from "./openai";
export async function POST(req: Request) {
  const body = await req.json();
  try {
    const completion = await callOpenAI(JSON.stringify(body));
    return new Response(completion, { status: 200 });
  } catch (error) {
    return new Response(`OpenAI Error: ${error.message}`, { status: 400 });
  }
}
