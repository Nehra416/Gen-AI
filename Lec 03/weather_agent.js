import 'dotenv/config';
import { OpenAI } from "openai/client.js";
import axios from 'axios';

const client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Function to fetch the real time weather of the city
async function getWeatherDetailsByCity(cityname = '') {
    const url = `http://wttr.in/${cityname.toLowerCase()}?format=%C+%t`;
    const { data } = await axios.get(url, { responseType: "text" })
    return `The current weather of ${cityname} is ${data}`;
}

// print the weather data
// getWeatherDetailsByCity('delhi').then(console.log) // shorthand of .then((result) => console.log(result))

const TOOL_MAP = {
    "getWeatherDetailsByCity": getWeatherDetailsByCity,
}

async function main() {
    const SYSTEM_PROMPT = `
    You are an AI assistant who works on START, THINK and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.
    Also, before outputing the final result to user you must check once if everything is correct.
    You also have list of available tools that you can call based on user query.
    For every tool call that you make, wait for the OBSERVATION from the tool which is the response from the tool that you called.

    Available Tools:
    - getWeatherDetailsByCity(cityname: string): Returns the current weather data of the city.

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, OBSERVE and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Always make sure to do multiple steps of thinking before giving out output.
    - For every tool call always wait for the OBSERVE which contains the output from the tool

    Output JSON format without wrapping it in code blocks or markdown:
    { "step": "START | THINK | OUTPUT | OBSERVE | TOOL", "content" "string", "tool_name": "string", "input": "string" }

    Examples:
    User: Hey, can you tell me weather of Hisar?
    ASSISTANT: { "step": "START", "content": "The user is interested in the current weather details about Hisar" }
    ASSISTANT: { "step": "THINK", "content": "Let me see if there is any available tool for this query" }
    ASSISTANT: { "step": "THINK", "content": "I see that there is a tool available getWeatherDetailsByCity which return the current weather data" }
    ASSISTANT: { "step": "THINK", "content": "I need to call getWeatherDetailsByCIty for city Hisar" }
    ASSISTANT: { "step": "TOOL", "input": "Hisar, "tool_name": "getWeatherDetailsByCity" }
    DEVELOPER: { "step": "OBSERVE", "content": "The weather of Hisar is cloudy with 25 Cel" }
    ASSISTANT: { "step": "THINK", "content": "Great, I got the weather details of Hisar" }
    ASSISTANT: { "step": "OUTPUT", "content": "The weather in Hisar is 25 Cel with little cloud. Please make sure to carry an umbrella with you" }

    `;

    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "Hey, tell me the weather of chandigarh." },
    ]

    // For automate all steps otherwise we need to add manually all steps to get the answer
    const response = await client.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: messages,
    })
    const rawContent = response.choices[0].message.content;
    console.log(rawContent)
}

main();