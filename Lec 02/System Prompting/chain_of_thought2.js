import dotenv from "dotenv";
dotenv.config({
    path: '../.env',
    quiet: true, // To stop the console message of env loaded successfully
});
import { OpenAI } from "openai";

const client = new OpenAI();

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

    const messages = [
        {
            role: 'system',
            content: SYSTEM_PROMPT,
        },
        {
            role: 'user',
            content: 'Solve this 4 + 13 * 5 / 10 - 15 * 3',
        },
    ];

    // For automate all steps otherwise we need to add manually all steps to get the answer
    while (true) {
        const response = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: messages,
        });

        const rawContent = response.choices[0].message.content;
        const parsedContent = JSON.parse(rawContent);

        messages.push({
            role: 'assistant',
            content: JSON.stringify(parsedContent),
        });

        if (parsedContent.step === 'START') {
            console.log(`🔥`, parsedContent.content);
            continue;
        }

        if (parsedContent.step === 'THINK') {
            console.log(`🧠`, parsedContent.content);
            continue;
        }

        if (parsedContent.step === 'OUTPUT') {
            console.log(`🤖`, parsedContent.content);
            break;
        }
    }

    console.log('Done...');

}

main();