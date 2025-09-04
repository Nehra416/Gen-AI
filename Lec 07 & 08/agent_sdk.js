import "dotenv/config"
import { Agent, run, tool } from "@openai/agents"
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions'
import { z } from "zod"

const getCurrentTime = tool({
    name: "get_current_time",
    description: "This tool returns the current time",
    parameters: z.object({}),
    async execute() {
        return new Date().toString();
    }
});

const getMenuTool = tool({
    name: "get_menu",
    description: "Fetches and return the menu items",
    parameters: z.object({}),
    async execute() {
        return {
            "Drink": {
                "Chai": "INR 50",
                "Coffee": "INR 70"
            },
            "Veg": {
                "DalMakhni": "INR 250",
                "Panner": "INR 400"
            }
        }
    }
})

const cookingAgent = new Agent({
    name: "Cooking Agent",
    model: "gpt-4.1-mini", // Optional
    tools: [getCurrentTime, getMenuTool],
    instructions: `
    You're a helpfull cooking assistant who is specialized in cooking food.
    You help the users with food options and receipes and help them cook food.
    `,
})

const codingAgent = new Agent({
    name: "Coding Agent",
    instructions: `
    You are an expert coding assistant particullarly in javascript
    `,
    tools: [cookingAgent.asTool()]
})

const gateWayAgent = Agent.create({
    name: "Gateway Agent",
    instructions: `
    ${RECOMMENDED_PROMPT_PREFIX}
    You determine which agent to use
    `,
    handoffs: [codingAgent, cookingAgent]
})

async function chatWithAgent(query) {
    const response = await run(gateWayAgent, query);
    console.log("History: ", response.history);
    console.log(response.finalOutput);
}

chatWithAgent('According to the current time, tell me best food item');