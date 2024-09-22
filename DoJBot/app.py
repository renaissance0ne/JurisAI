# Server-side code (Python/Flask)

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import time
import warnings
import logging
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
import glob
import re

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Filter out specific deprecation warnings
warnings.filterwarnings("ignore", category=DeprecationWarning, module="langchain_community.embeddings.huggingface")
warnings.filterwarnings("ignore", category=FutureWarning, module="transformers")

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

load_dotenv()

# Load the GROQ API KEY
groq_api_key = os.getenv('GROQ_API_KEY')

llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")

prompt = ChatPromptTemplate.from_template(
"""
Answer the questions based on the provided context only.
Please provide the most accurate response based on the question.
Format your response with clear paragraphs and use numbered or bulleted lists for multiple points.
If appropriate, use headers to separate different sections of your response.

<context>
{context}
</context>

Question: {input}

Remember to structure your response for clarity:
1. Use paragraphs for explanations, starting each paragraph with a tab space.
2. Use numbered lists for sequential steps or prioritized information.
3. Use bullet points for related but non-sequential information.
4. Use headers (preceded by '##') to separate major sections if the response is complex.
5. Separate each point, paragraph, or section with a blank line.

Begin your response:
"""
)

# Global variables to store the vector store and other components
vectors = None
embeddings = None

def vector_embedding():
    global vectors, embeddings
    if vectors is None:
        logging.info("Starting vector embedding process...")
        embeddings = HuggingFaceEmbeddings(model_name="multi-qa-mpnet-base-dot-v1")
        
        # Check if a saved vector store exists
        if os.path.exists("faiss_index"):
            logging.info("Loading existing vector store...")
            try:
                vectors = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
                logging.info("Vector store loaded successfully.")
            except Exception as e:
                logging.error(f"Error loading vector store: {e}")
                logging.info("Creating new vector store...")
                vectors = create_new_vector_store()
        else:
            logging.info("Creating new vector store...")
            vectors = create_new_vector_store()
        
        logging.info("Vector embedding process completed.")

def create_new_vector_store():
    # Use UnstructuredPDFLoader for each PDF file
    pdf_files = glob.glob("./data/*.pdf")
    docs = []
    for pdf_file in pdf_files:
        loader = UnstructuredPDFLoader(pdf_file)
        docs.extend(loader.load())
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    final_documents = text_splitter.split_documents(docs)
    vectors = FAISS.from_documents(final_documents, embeddings)
    
    # Save the vector store
    vectors.save_local("faiss_index")
    return vectors

def format_response(text):
    # Convert headers
    text = re.sub(r'^##\s*(.+)$', r'\n=== \1 ===\n', text, flags=re.MULTILINE)
    
    # Convert paragraphs (including those starting with a tab)
    text = re.sub(r'^(\t)?(?!===|\d+\.|\*|-|•)(.+)$', r'\n\2\n', text, flags=re.MULTILINE)
    
    # Convert numbered lists (handle multi-digit numbers)
    text = re.sub(r'^(\d+\.)\s*(.+)$', r'\1 \2', text, flags=re.MULTILINE)
    
    # Convert bullet points (handle both * and - as bullet point indicators)
    text = re.sub(r'^(\*|-)\s*(.+)$', r'• \2', text, flags=re.MULTILINE)
    
    # Remove excess newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()

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

    logging.debug(f"Raw response from LLM:\n{response['answer']}")
    formatted_answer = format_response(response['answer'])
    
    return jsonify({
        "answer": formatted_answer,
        "context": [doc.page_content for doc in response["context"]],
        "process_time": process_time
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
