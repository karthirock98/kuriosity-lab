import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

export const getGroqResponse = async (instructions) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: instructions.system || "You are a helpful assistant.",
      },
      {
        role: "user",
        content: instructions.user,
      },
    ],
    // citation_options: "enabled",
    model: "openai/gpt-oss-120b",
    tools: [{type: "browser_search"}]
  });
};
