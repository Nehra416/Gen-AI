import "dotenv/config"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai/client.js";

const client = new OpenAI({
    apiKey: process.env.GOOGLE_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function chat() {
    const userQuery = 'Tell me about adding two number in js';

    // Ready the client google Embedding Model
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: 'http://localhost:6333',
            collectionName: 'testing-collection',
        }
    )

    const vectorSearcher = vectorStore.asRetriever({
        k: 3,
    });
    console.log("searcher: ", vectorSearcher);

    const relevantChunk = await vectorSearcher.invoke(userQuery);
    console.log("relevent chunk is: ", relevantChunk);

    const SYSTEM_PROMPT = `
    You are an AI assistant who helps resolving user query based on the
    context available to you from a PDF file with the content and page number.

    Only ans based on the available context from file only.

    Context:
    ${JSON.stringify(relevantChunk)}
  `;

    const response = await client.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userQuery },
        ],
    });

    console.log(`res is: ${response.choices[0].message.content}`);
}

chat();