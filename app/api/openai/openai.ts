import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const callOpenAI = async (text: string): Promise<string> => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `TASK: Craft a message as if you are traversing social media. You are an average American who happened to see this post and feel connected to it because you are a happy user of OUR STARTUP /PRODUCT NAME HERE 
       INSTRUCTIONS: Upsell our startup / product organically, it should sound natural not an ad. Weave it in with a joke or review or state your connection, however it connects naturally to the subject matter of the post. No more than 3 sentences. Use placeholder "StartupNameHere" to replace with our startup / product name.`,
      },
      { role: "user", content: text },
    ],
    model: "gpt-4o",
  });

  const messageContent = completion.choices[0]?.message.content ?? "";
  console.log(messageContent);
  return messageContent;
};