import "dotenv/config";

import { OpenAI } from "openai/client.js";
import { Memory } from "mem0ai/oss";

const client = new OpenAI();

const mem = new Memory({
    version: "v1.1",
    enableGraph: true,
    graphStore: {
        provider: 'neo4j',
        config: {
            url: 'neo4j://localhost:7687',
            username: 'neo4j',
            password: 'reform-william-center-vibrate-press-5829',
        },
    },
    vectorStore: {
        provider: "qdrant",
        config: {
            collectionName: "memories",
            embeddingModelDims: 1536,
            host: "localhost",
            port: 6333,
        }
    }
});

async function chat(query = "") {
    const memories = await mem.search(query, { userId: "nehra" });
    console.log("memories is: ", memories);
    const memStr = memories.results?.slice(0, 5).map((e) => e.memory).join('\n');
    console.log("memory in string: ", memStr);

    const SYSTEM_PROMPT = `Context About User: ${memStr}`;

    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: query }
        ]
    })
    console.log("\nAi: ", response.choices[0].message.content);

    console.log("\nAdding to memory...")
    await mem.add([
        { role: "user", content: query },
        { role: "assistant", content: response.choices[0].message.content }
    ], { userId: "nehra" });
    console.log("\nAdded to memory successfully")
}

// chat("Hello Agent do you know, My name is Nehra & from HR and i love travelling with my friends");
chat("Tell me my name and what i doing mostly and what i do in free time")