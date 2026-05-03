import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";


const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState([
  {
    id: "welcome",
    sender: "bot",
    text: "🎬 Welcome to QuickShow!\n\nI can help you:\n- Find movies\n- Check show timings\n- Book tickets\n- Seat hold policy (10 mins)\n\nWhat would you like to do? 🍿",
  },
]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setError("");
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError("");

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/chat`, { message: trimmed });
      const replyText =
        (data && typeof data.reply === "string" && data.reply.trim()) ||
        "Sorry, I couldn’t respond right now. Please try again.";

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyText,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-error-${Date.now()}`,
          sender: "bot",
          text: "Oops, I had trouble answering. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        type="button"
        onClick={handleToggle}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-300 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-100" />
        </span>
        <span>Chat with us</span>
      </button>

      {/* Chat modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-end bg-black/10 sm:items-center sm:justify-end">
          <div className="m-4 w-full max-w-sm rounded-2xl border border-slate-800/80 bg-slate-950/95 text-slate-100 shadow-2xl shadow-indigo-500/20 backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">QuickShow AI Assistant</p>
                <p className="text-xs text-slate-400">
                  Ask about movies, timings, or booking help.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggle}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              >
                <span className="sr-only">Close chat</span>
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex max-h-80 flex-col gap-3 overflow-y-auto px-3 py-3 text-sm 
">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex transition-all duration-300 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                 <div
  className={`max-w-[85%] rounded-2xl px-5 py-4 text-[14px] leading-7 shadow-lg transition-all duration-300 ${
    msg.sender === "user"
      ? "bg-indigo-600 text-white"
      : "bg-slate-800 text-slate-100"
  }`}
>
  <ReactMarkdown
    components={{
      p: ({ ...props}) => (
        <p className="mb-3" {...props} />
      ),
      ul: ({ ...props}) => (
        <ul className="list-disc ml-5 space-y-1 mb-3" {...props} />
      ),
      strong: ({ ...props}) => (
        <strong className="font-semibold text-white" {...props} />
      )
    }}
  >
    {msg.text}
  </ReactMarkdown>
</div>

                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-slate-800 px-3 py-2 text-xs text-slate-300">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                    <span className="ml-1">QuickShow AI is typing…</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 pb-1 text-xs text-rose-400">{error}</div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-slate-800 px-3 py-2.5">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a movie, show, or booking…"
                className="max-h-20 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {isLoading ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;



