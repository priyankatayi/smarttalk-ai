# 💬 SmartTalk AI (Full Stack Chatbot)

A full-stack ChatGPT style AI chatbot with a **React frontend** and **Node.js/Express backend**, powered by the **OpenAI API**. SmartTalk AI supports real-time conversations, PDF-based Retrieval-Augmented Generation (RAG), semantic search using embeddings, and document-aware responses through vector similarity search.

---

## 🧠 RAG Pipeline

SmartTalk AI supports Retrieval-Augmented Generation (RAG) for document-aware conversations.

### How it works

1. Upload a PDF document
2. Extract and chunk document text
3. Generate embeddings using OpenAI
4. Store embeddings in a vector store
5. Perform semantic similarity search on user queries
6. Inject relevant context into GPT responses

This enables the chatbot to answer questions based on uploaded documents instead of relying only on general model knowledge.

---

## 🚀 Features

- Displays animated typing indicators for a more natural, real-time chat experience.

- Communicates securely with OpenAI's API via a Node.js proxy, hiding API keys from the client.

- Renders formatted responses using ReactMarkdown with support for code, links, and lists.

- Persists and restores chat history using a custom useLocalStorage React hook.

- Supports PDF upload and document-aware conversations using Retrieval-Augmented Generation (RAG).

- Implements semantic search using vector embeddings to retrieve relevant document chunks before generating AI responses.

- Uses document chunking and vector storage for efficient context retrieval and improved response accuracy.

---

## 🛠️ Tech Stack

- **Frontend:** React, HTML5, CSS3
- **Backend:** Node.js, Express
- **API Integration:** OpenAI (gpt-4.1)
- **Markdown Rendering:** react-markdown
- **AI/RAG:** LangChain, OpenAI Embeddings
- **Vector Store:** MemoryVectorStore
- **File Processing:** Multer, pdf-parse
- **Hosting:** Vercel

---

## 🧑‍💻 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/priyankatayi/smarttalk-ai.git
cd smarttalk-ai
```

### 2. Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

### 3. Create `.env` File

Create a `.env` file inside the server folder with the following contents:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the App Locally

#### Start Backend

```bash
cd server
npm run server
```

#### Start Frontend

```bash
cd client
npm start
```

Visit: `http://localhost:3000`

---

## 📁 Folder Structure

```
smarttalk-ai/
│
├── client/               # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   ├── public/
│   └── ...
│
├── server/               # Express backend
│   ├── server/
│   |   ├── chunkText.js    # Utility for splitting document text into chunks
│   |   ├── vectorStore.js   # Vector database configuration using embeddings
│   ├── configs/
│   │   └── openai.js
│   ├──.env
│   └── ...
│
├── .gitignore
├── README.md
```

---

## 📌 TODO / Future Enhancements

- Add user login (JWT)
- Add dark/light theme toggle
- Make it responsive
- Support for image generation (DALL·E)
- Add persistent vector database support (Chroma/Pinecone)

---

## 🙌 Acknowledgements

- [OpenAI API](https://platform.openai.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
