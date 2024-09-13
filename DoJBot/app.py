from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import time
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

load_dotenv()

# Load the GROQ API KEY
groq_api_key = os.getenv('GROQ_API_KEY')

llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")

prompt = ChatPromptTemplate.from_template(
"""
Answer the questions based on the provided context only.
Please provide the most accurate response based on the question
<context>
{context}
</context>
Question: {input}
"""
)

# Global variables to store the vector store and other components
vectors = None
embeddings = None
loader = None
docs = None
text_splitter = None
final_documents = None

def vector_embedding():
    global vectors, embeddings, loader, docs, text_splitter, final_documents
    if vectors is None:
        print("Starting vector embedding process...")
        embeddings = HuggingFaceEmbeddings(model_name="multi-qa-mpnet-base-dot-v1")
        loader = PyPDFDirectoryLoader("./data")
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        final_documents = text_splitter.split_documents(docs[:20])
        vectors = FAISS.from_documents(final_documents, embeddings)
        print("Vector embedding process completed.")

# Initialize the vector embedding when the module is imported
vector_embedding()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    prompt1 = data['prompt']
    
    if vectors is None:
        return jsonify({"error": "Vector Store DB is not ready. Please try again in a moment."})

    document_chain = create_stuff_documents_chain(llm, prompt)
    retriever = vectors.as_retriever()
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    
    start = time.process_time()
    response = retrieval_chain.invoke({'input': prompt1})
    process_time = time.process_time() - start

    return jsonify({
        "answer": response['answer'],
        "context": [doc.page_content for doc in response["context"]],
        "process_time": process_time
    })

if __name__ == '__main__':
    app.run(debug=True)