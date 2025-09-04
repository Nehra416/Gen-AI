import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";

const enc = new Tiktoken(o200k_base);

const userQuery = "Hello, My name is Deepak Nehra";
const tokens = enc.encode(userQuery);
console.log({ tokens })

const inputTokens = [13225, 11, 3673, 1308, 382, 28896, 422, 4475, 70887]
const decoded = enc.decode(inputTokens);
console.log({ decoded });


// Kind of archetecture of chatgpt
function predictNextToken(tokens) {
    // Some work done on tokens to find next token and then return it
    return 1234;
}

while (true) {
    const nextToken = predictNextToken(tokens);
    if (nextToken === "END") break;
    tokens.push(nextToken);
}