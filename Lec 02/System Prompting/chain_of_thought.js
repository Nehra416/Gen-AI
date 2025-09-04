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
    const SYSTEM_PROMPT = `
    You are an AI assistant who works on START, THINK and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.
    Also, before outputing the final result to user you must check once if everything is correct.

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Always make sure to do multiple steps of thinking before giving out output.

    Output JSON format without wrapping it in code blocks or markdown:
    { "step": "START | THINK | OUTPUT", "content" "string" }

    Examples:
    User: Can you solve 3 + 4 * 10 - 4 * 3
    ASSISTANT: { "step": "START", "content": "The user wants me to solve 3 + 4 * 10 -4 * 3 maths problem" }
    ASSISTANT: { "step": "THINK", "content": "This is typical math problem where we use BODMAS formula for calculation" }
    ASSISTANT: { "step": "THINK", "content": "Let's breakdown the problem step by step" }
    ASSISTANT: { "step": "THINK", "content": "As per bodmas, first let's solve all multiplications and division" }
    ASSISTANT: { "step": "THINK", "content": "So, first we need to solve 4 * 10 that is 40" }
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 4 * 3" }
    ASSISTANT: { "step": "THINK", "content": "Now, I can see one more multiplaction to be done that is 4 * 3 = 12" }
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 -12" }
    ASSISTANT: { "step": "THINK", "content": "As we have done all multiplications let's do the add and subtract" }
    ASSISTANT: { "step": "THINK", "content": "So, 3 + 40 = 43" }
    ASSISTANT: { "step": "THINK", "content": "new equation look like 43 - 12 which is 31" }
    ASSISTANT: { "step": "THINK", "content": "Great, all steps are done and final result is 31" }
    ASSISTANT: { "step": "OUTPUT", "content": "3 = 4 * 10 - 4 *3 = 31" }

    `;

    // For automate all steps otherwise we need to add manually all steps to get the answer
    const response = await client.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: "Solve this 4 + 13 * 5 / 10 - 15 * 3" },
        ]
    })
    // console.log(response.choices[0].message.content)
    const rawContent = response.choices[0].message.content;
    console.log(rawContent)

    const geminiOutput = [
        { "step": "START", "content": "The user wants me to solve the mathematical expression: 4 + 13 * 5 / 10 - 15 * 3." },
        { "step": "THINK", "content": "I need to apply the BODMAS/PEMDAS rule to solve this expression, which means operations are performed in the order: Brackets/Parentheses, Orders/Exponents, Division/Multiplication (from left to right), Addition/Subtraction (from left to right)." },
        { "step": "THINK", "content": "First, I will identify all multiplication and division operations." },
        { "step": "THINK", "content": "The first multiplication is 13 * 5." },
        { "step": "THINK", "content": "13 * 5 = 65. The expression now looks like 4 + 65 / 10 - 15 * 3." },
        { "step": "THINK", "content": "Next, I will perform the division: 65 / 10." },
        { "step": "THINK", "content": "65 / 10 = 6.5. The expression now looks like 4 + 6.5 - 15 * 3." },
        { "step": "THINK", "content": "Now, I will perform the remaining multiplication: 15 * 3." },
        { "step": "THINK", "content": "15 * 3 = 45. The expression now looks like 4 + 6.5 - 45." },
        { "step": "THINK", "content": "All multiplications and divisions are done. Now I will perform addition and subtraction from left to right." },
        { "step": "THINK", "content": "First, perform the addition: 4 + 6.5." },
        { "step": "THINK", "content": "4 + 6.5 = 10.5. The expression now looks like 10.5 - 45." },
        { "step": "THINK", "content": "Finally, perform the subtraction: 10.5 - 45." },
        { "step": "THINK", "content": "10.5 - 45 = -34.5." },
        { "step": "THINK", "content": "All calculations are complete, and the final result is -34.5." },
        { "step": "OUTPUT", "content": "4 + 13 * 5 / 10 - 15 * 3 = -34.5" },
    ]

}

main();