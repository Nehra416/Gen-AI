import "dotenv/config"
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

// Create a model and give it access to the tools
const model = new ChatOpenAI({
    model: "gpt-4.1-mini"
});

// Define the function that calls the model
async function callOpenAi(state) {
    console.log("Inside callOpenAi", state);
    const response = await model.invoke(state.messages);

    // Return to update the state
    return {
        // messages: ["Hey, I just added something to the state"],
        messages: [response],
    };
}

// Define a new Graph (Workflow)
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("callOpenAi", callOpenAi)
    .addEdge("__start__", "callOpenAi")
    .addEdge("callOpenAi", "__end__");

// Finally, we compile it into a LangChain Runnable.
const graph = workflow.compile();

// Use agent
async function runGraph() {
    const userQuery = "Hey, my name is Nehra";

    const updatedState = await graph.invoke({
        messages: [new HumanMessage(userQuery)]
    });
    console.log("State after runGraph: ", updatedState);
}

runGraph();