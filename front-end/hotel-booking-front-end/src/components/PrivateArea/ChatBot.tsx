import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

interface Message {
  sender: "user" | "bot";
  text: string;
}

function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const [wait4Response, setWait4Response] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    handleBotResponse();
    setInput("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleBotResponse = async () => {
    try {
      setWait4Response(true);
      const apiBaseUrl = import.meta.env.VITE_AI_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/ai/ai-chat";

      const data: AiChatInput = {
        input: input,
      };

      const response: AiChatOutput = (await axios.post(url, data)).data;

      const botMessage: Message = {
        sender: "bot",
        text: "Botto: " + response.output,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
    } finally {
      setWait4Response(false);
    }
  };

  const handleClearChat = async () => {
    const apiBaseUrl = import.meta.env.VITE_AI_SERVICE_BASE_URL;
    const url = apiBaseUrl + "/api/v1/ai/reset-chat-history";

    try {
      await axios.get(url);
    } catch {}
  };

  useEffect(() => {
    handleClearChat();
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, wait4Response]);

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <div className="card">
        <div className="card-header bg-outline-primary">
          <h5 className="m-0">ChatBot</h5>
        </div>
        <div
          ref={chatBodyRef}
          className="card-body overflow-auto"
          style={{
            height: "400px",
            overscrollBehavior: "contain",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 d-flex ${
                message.sender === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  message.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-light text-dark"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {message.text}
              </div>
            </div>
          ))}
          {wait4Response && (
            <div className="mb-2 d-flex justify-content-start">
              <div
                className="p-2 rounded bg-light text-dark"
                style={{ maxWidth: "75%" }}
              >
                Thinking...
              </div>
            </div>
          )}
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={wait4Response}
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
