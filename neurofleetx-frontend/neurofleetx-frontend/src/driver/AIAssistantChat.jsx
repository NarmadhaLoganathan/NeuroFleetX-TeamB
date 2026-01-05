import { useState, useRef, useEffect } from "react";
import { AIChat } from "../api/aiApi";

const AIAssistantChat = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi 👋 I’m your Driver Assistant. Ask me about trips, GPS, traffic, vehicle status, or alerts.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");

    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await AIChat.sendMessage(userMsg);

      setMessages((prev) => [
        ...prev,
        { from: "ai", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "⚠️ AI service unavailable. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[480px] bg-white rounded-xl shadow-2xl flex flex-col z-50">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 bg-blue-600 text-white rounded-t-xl">
        <h3 className="font-semibold">Driver AI Assistant</h3>
        <button onClick={onClose} className="text-xl">✖</button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 flex ${
              m.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-lg ${
                m.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-gray-400 italic">AI is typing...</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="flex border-t p-2 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about driver panel..."
          className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIAssistantChat;
