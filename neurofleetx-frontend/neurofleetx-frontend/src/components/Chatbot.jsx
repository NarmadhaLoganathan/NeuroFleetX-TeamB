import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Bot, User } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your Driver Assistant. How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInput("");
    setLoading(true);

    try {
      // Adjust URL if your backend is running elsewhere
      const response = await axios.post("http://localhost:8080/api/chat", {
        user_id: "driver_user",
        message: userMessage,
      });

      const reply = response.data.reply || "Sorry, I didn't get a response.";
      setMessages((prev) => [...prev, { text: reply, isBot: true }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I am having trouble connecting to the server.", isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-6 right-28 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 md:w-[28rem] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 pointer-events-auto flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-5 font-sans">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center text-white shadow-md">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              <Bot size={24} className="text-white" /> Driver AI Support
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-[28rem] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.isBot ? "justify-start" : "justify-end"}`}
              >
                {msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.isBot
                    ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none"
                    : "bg-blue-600 text-white rounded-tr-none"
                    }`}
                >
                  {msg.isBot ? (
                    <div className="markdown-body prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-4" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 mt-3" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1 mt-2" {...props} />,
                          code: ({ node, inline, ...props }) =>
                            inline
                              ? <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs font-mono" {...props} />
                              : <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-xs font-mono mb-2 overflow-x-auto" {...props} />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>

                {!msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={16} className="text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-900 dark:text-white text-sm transition-all"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 pointer-events-auto border-4 border-white/20"
        >
          <MessageCircle size={32} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
