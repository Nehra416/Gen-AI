import "dotenv/config"
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
// import { HumanMessage } from "@langchain/core/messages";

// This will work properly
const agent = await chaiCodeAgent();
const response = await agent.invoke({
    messages: ['Hello, my name is Nehra']
})
console.log("Response is: ", response);


// Incapsulate all the code and we simply provide this this function to use like we do above
async function chaiCodeAgent() {
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

    return graph;
}
