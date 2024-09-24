from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
import os
import time
import warnings
import logging
import uuid
import glob
import re
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain_community.embeddings import HuggingFaceEmbeddings

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Filter out specific deprecation warnings
warnings.filterwarnings("ignore", category=DeprecationWarning, module="langchain_community.embeddings.huggingface")
warnings.filterwarnings("ignore", category=FutureWarning, module="transformers")

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Set a secret key for session management
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
CORS(app, resources={r"/*": {"origins": ["https://renaissance0ne.github.io", "http://localhost:3000"]}}, supports_credentials=True)

load_dotenv()

# Load the GROQ API KEY
groq_api_key = os.getenv('GROQ_API_KEY')

llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")

prompt = ChatPromptTemplate.from_template(
"""
Answer the questions based on the provided context and previous conversation history.
Please provide the most accurate response based on the question.
Format your response with clear paragraphs and use numbered or bulleted lists for multiple points.
If appropriate, use headers to separate different sections of your response.

Important: Respond in {language}. If the language is Hindi, use Devanagari script.

<context>
{context}
</context>

<conversation_history>
{conversation_history}
</conversation_history>

Question: {input}

Remember to structure your response for clarity:
1. Use paragraphs for explanations, starting each paragraph with a tab space.
2. Use numbered lists for sequential steps or prioritized information.
3. Use bullet points for related but non-sequential information.
4. Use headers (preceded by '##') to separate major sections if the response is complex.
5. Separate each point, paragraph, or section with a blank line.

Begin your response in {language}:
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

@app.route('/query', methods=['POST'])
def query():
    try:
        data = request.json
        prompt1 = data['prompt']
        language = data.get('language', 'english')  # Default to English if not specified
        
        if vectors is None:
            return jsonify({"error": "Vector Store DB is not ready. Please try again in a moment."}), 503

        # Check if a session exists, if not create a new one
        if 'session_id' not in session:
            session['session_id'] = str(uuid.uuid4())
            session['conversation_history'] = []

        # Retrieve the conversation history
        conversation_history = session.get('conversation_history', [])
        conversation_history_str = "\n".join([f"Human: {q}\nAI: {a}" for q, a in conversation_history])

        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = vectors.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)
        
        start = time.process_time()
        response = retrieval_chain.invoke({
            'input': prompt1,
            'conversation_history': conversation_history_str,
            'language': 'Hindi' if language == 'hindi' else 'English'
        })
        process_time = time.process_time() - start

        logging.debug(f"Raw response from LLM:\n{response['answer']}")
        formatted_answer = format_response(response['answer'])
        
        # Update the conversation history
        conversation_history.append((prompt1, formatted_answer))
        session['conversation_history'] = conversation_history[-5:]  # Keep only the last 5 exchanges

        return jsonify({
            "answer": formatted_answer,
            "context": [doc.page_content for doc in response["context"]],
            "process_time": process_time,
            "session_id": session['session_id']
        })
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return jsonify({"error": "An internal error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True)
