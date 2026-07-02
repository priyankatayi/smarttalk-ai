import "./App.css";
import logo from "./assets/smartTalk.svg";
import addBtn from "./assets/add-30.png";
import msgIcon from "./assets/message.svg";
import smartTalkLogo from "./assets/smartTalkLogo.svg";
import userIcon from "./assets/user-icon.png";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { FaPlus } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

function App() {
  const [input, setInput] = useState("");
  const endOfMessages = useRef();
  const [messages, setMessages] = useLocalStorage("chatHistory", [
    {
      role: "system",
      content: "how can I help?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState("");

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onClickHandler = async (e) => {
    if (!input.trim()) return;
    setIsLoading(true);
    const loaderInterval = startLoader();
    const text = input;
    setInput("");
    const prompt = { role: "user", content: text };
    setMessages((prev) => [...prev, prompt, { role: "system", content: "" }]);

    try {
      const response = await axios.post(
        "https://smarttalk-ai.vercel.app/api/chat",
        {
          prompt: [prompt],
        },
        {
          withCredentials: true,
        },
      );
      const systemText = response.data.message;
      clearInterval(loaderInterval);
      setLoader("");
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "system", content: systemText };
        return updated;
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "system",
          content: "Something went wrong.",
        };
        return updated;
      });
      console.log(error.message);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          withCredentials: true,
        },
      );
      let uploaded = true;
      if (uploaded) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: `PDF uploaded successfully. You can now ask questions from it. ${res.data.chunks} chunks indexed.`,
          },
        ]);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleQuery = async (e) => {
    const text = e.target.value;
    setInput(text);
    await onClickHandler();
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter" && input.trim()) {
      await onClickHandler(e);
    }
  };

  const startLoader = () => {
    let dots = "";
    const interval = setInterval(() => {
      dots = dots.length < 3 ? (dots += ".") : "";
      setLoader(dots);
    }, 300);
    return interval;
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img className="logo" src={logo} alt="logo" />
            <span className="brand">SmartTalk AI</span>
          </div>
          <button className="midBtn" onClick={() => window.location.reload()}>
            <img src={addBtn} alt="new chat" className="addBtn" />
            New Chat
          </button>
          <div className="upperSideBottom">
            <button
              className="query"
              onClick={handleQuery}
              value="What is programming ?"
            >
              <img src={msgIcon} alt="query" />
              What is programming ?
            </button>
            <button
              className="query"
              onClick={handleQuery}
              value="How to use an API ?"
            >
              <img src={msgIcon} alt="query" />
              How to use an API ?
            </button>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="chats">
          {messages.map((message, i) => {
            return (
              <div
                key={i}
                className={message.role === "system" ? "chat bot" : "chat"}
              >
                <img
                  className="chatImg"
                  src={message.role === "system" ? smartTalkLogo : userIcon}
                  alt=""
                />
                <div className="text">
                  {message.content !== "" ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    <p>{loader}</p>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={endOfMessages} />
        </div>
        <div className="chatFooter">
          <div className="inp" style={{ display: "flex", padding: "0 10px" }}>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
            <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
              <FaPlus size={15} />
            </label>
            <input
              type="text"
              placeholder="Send a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                color: "white",
              }}
              onClick={onClickHandler}
            >
              <IoSend size={15} />
            </button>
          </div>

          <p>
            SmartTalk AI may produce inaccurate information about people, places
            or facts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
