import "dotenv/config"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

async function init() {
    const pdfPath = "./nodejs.pdf";
    const loader = new PDFLoader(pdfPath);
    
    // Page by page load the PDF file
    const docs = await loader.load();

    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: 'http://localhost:6333',
        collectionName: 'testing-collection',
    });

    console.log('Indexing of documents done');
}

init();