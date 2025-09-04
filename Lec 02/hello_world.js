import 'dotenv/config';
import { OpenAI } from "openai/client.js";

// If we chat with openAI
// const client = new OpenAI();

// Way to chat with other LLM by using openAI SDK
const client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function main() {
    const response = await client.chat.completions.create({
        // These api calls are stateless
        model: "gemini-2.0-flash", // change model name acc to the api key or LLM
        messages: [
            { role: "user", content: "Hello, my name is nehra" },
            { role: "assistant", content: "Hello Nehra! It's nice to meet you. How can I help you today?" },
            { role: "user", content: "Tell me my name?" }
        ]
    })
    console.log(response.choices[0].message);
}

main();