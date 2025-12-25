import { useEffect, useRef, useState } from "react";
import { sendMessage,fetchChatHistory } from "./api";
import "./App.css";

type Message = {
  sender: "user" | "ai";
  text: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem("sessionId"));
  
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!sessionId) return;
  
    fetchChatHistory(sessionId)
      .then((data) => {
        setMessages(data.messages);
      })
      .catch((err) => {
        console.error("Failed to restore history", err);
      });
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await sendMessage(userText, sessionId ?? undefined);
      setSessionId(res.sessionId);
      localStorage.setItem("sessionId", res.sessionId);

      setMessages((prev) => [...prev, { sender: "ai", text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="chat-card">
        <header className="chat-header">AI Support Chat</header>

        <div className="chat-body">
          {messages.length === 0 && (
            <div className="empty">
              👋 Hi! Ask me about shipping, returns, or support hours.
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.sender}`}>
              {m.text}
            </div>
          ))}

          {loading && <div className="bubble ai">Agent is typing…</div>}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input">
          <input
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
