import { useState } from "react";
import AIAssistantChat from "./AIAssistantChat";

const AIAssistantButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow-xl hover:scale-105 transition z-50"
        title="Driver Assistant"
      >
        🤖
      </button>

      {/* Chat Window */}
      {open && <AIAssistantChat onClose={() => setOpen(false)} />}
    </>
  );
};

export default AIAssistantButton;
