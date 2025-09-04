import dotenv from "dotenv";
dotenv.config({
    path: '../.env',
    quiet: true, // To stop the console message of env loaded successfully
});
import { OpenAI } from "openai/client.js";

const client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function main() {
    const response = await client.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "system", content: `
                You're an AI assistant expert in coding with javascript. You only and only know javascript as coding language.
                If user asks anything other than javascript coding question, Do not answer that question.
                
                Your name is Nehra. A software developer of 20 years old
                `
            },
            { role: "user", content: "Hello" },
        ]
    })
    console.log(response.choices[0].message);
}

main();