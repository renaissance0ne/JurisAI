#STEP - 1
import streamlit as st
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

load_dotenv()

## load the GROQ API KEY 
groq_api_key = os.getenv('GROQ_API_KEY')

st.title("Juras AI")

llm = ChatGroq(groq_api_key=groq_api_key,
             model_name="Llama3-8b-8192")

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

def vector_embedding():
    if "vectors" not in st.session_state:
        # Use SentenceTransformers embeddings
        st.session_state.embeddings = HuggingFaceEmbeddings(model_name="multi-qa-mpnet-base-dot-v1")
        st.session_state.loader = PyPDFDirectoryLoader("./data")  ## Data Ingestion
        st.session_state.docs = st.session_state.loader.load()  ## Document Loading
        st.session_state.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)  ## Chunk Creation
        st.session_state.final_documents = st.session_state.text_splitter.split_documents(st.session_state.docs[:20])  # splitting
        st.session_state.vectors = FAISS.from_documents(st.session_state.final_documents, st.session_state.embeddings)  # vector embeddings

prompt1 = st.text_input("Enter Your Question From Documents")

if st.button("Documents Embedding"):
    vector_embedding()
    st.write("Vector Store DB Is Ready")

if prompt1:
    document_chain = create_stuff_documents_chain(llm, prompt)
    retriever = st.session_state.vectors.as_retriever()
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    start = time.process_time()
    response = retrieval_chain.invoke({'input': prompt1})
    print("Response time:", time.process_time() - start)
    st.write(response['answer'])

    # With a streamlit expander
    with st.expander("Document Similarity Search"):
        # Find the relevant chunks
        for i, doc in enumerate(response["context"]):
            st.write(doc.page_content)
            st.write("--------------------------------")










            
#STEP - 2 DO THIS ONLY AFTER YOU IMPLEMENT STEP 1

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
        embeddings = HuggingFaceEmbeddings(model_name="multi-qa-mpnet-base-dot-v1")
        loader = PyPDFDirectoryLoader("./data")
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        final_documents = text_splitter.split_documents(docs[:20])
        vectors = FAISS.from_documents(final_documents, embeddings)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/embed', methods=['POST'])
def embed_documents():
    vector_embedding()
    return jsonify({"message": "Vector Store DB Is Ready"})

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    prompt1 = data['prompt']
    
    if vectors is None:
        return jsonify({"error": "Vector Store DB is not ready. Please embed documents first."})

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