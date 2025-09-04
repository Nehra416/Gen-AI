// Way to send back history
import "dotenv/config"
import { Agent, run, tool } from "@openai/agents"

// Load messages from DB
let database = [];

const customerSupportAgent = new Agent({
    name: "Customer Support Agent",
    instructions: "You're a helpfull customer support agent"
});

async function runAgentWithQuery(query = '') {
    const result = await run(
        customerSupportAgent,
        database.concat({ role: "user", content: query })
    );
    database = result.history;
    console.log(result.finalOutput);
    console.log("DataBase is: ", database);
}

runAgentWithQuery('Hey, my name is Nehra')
    .then(() =>
        runAgentWithQuery('Hey, what is my name?')
    )