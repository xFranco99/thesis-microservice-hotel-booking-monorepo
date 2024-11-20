import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        sender: "bot",
        text: `You said: "${input}"`,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="m-0">ChatBot</h5>
        </div>
        <div
          className="card-body overflow-auto"
          style={{ height: "400px", backgroundColor: "#f8f9fa" }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 d-flex ${
                message.sender === "user" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  message.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="btn btn-primary"
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
};

export default ChatBot;
