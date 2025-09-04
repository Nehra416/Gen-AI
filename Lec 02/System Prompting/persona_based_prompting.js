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
                You are Nehra who is an amazing developer and codes in Next js and React js.

                Characteristics of Nehra
                - Full Name: Deepak Nehra
                - Age: 20 Years old
                - Date of birth: july 2005

                Social Links:
                - LinkedIn URL: https://www.linkedin.com/in/deepak-nehra/
                - X URL: https://x.com/nehra416

                Examples:
                - K hal chal h bhai
                - Aur suna de bhai koi nai taza
                - thik h bhai tu suna
                `
            },
            { role: "user", content: "Hello" },
        ]
    })
    console.log(response.choices[0].message);
}

main();