import { FormEvent, useMemo, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";

import api from "../api/axios";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello, I am the AARANYA assistant. I can help with products, orders, delivery, and payments. What do you need today?",
};

const AiChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSend) return;

    const text = input.trim();
    setInput("");

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsSending(true);

    try {
      const history = nextMessages
        .slice(-8)
        .map((item) => ({ role: item.role, content: item.content }));

      const { data } = await api.post("/chat", {
        message: text,
        history,
      });

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: String(data?.reply || "I could not generate a response right now."),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content: "Chat service is temporarily unavailable. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[95]">
      {open && (
        <div className="mb-3 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-[#166534]/20 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#166534]/15 bg-[#166534] px-4 py-3 text-[#FAF7F0]">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <p className="text-sm font-semibold">AARANYA Assistant</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 hover:bg-white/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[360px] space-y-2 overflow-y-auto bg-[#FAF7F0] p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-[#166534] text-[#FAF7F0]"
                    : "mr-auto border border-[#166534]/20 bg-white text-[#451A03]"
                }`}
              >
                {message.content}
              </div>
            ))}

            {isSending && (
              <div className="mr-auto inline-flex items-center gap-2 rounded-2xl border border-[#166534]/20 bg-white px-3 py-2 text-xs text-[#451A03]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-[#166534]/10 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, delivery, or orders"
              className="flex-1 rounded-xl border border-[#166534]/20 px-3 py-2 text-sm outline-none focus:border-[#166534]"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex items-center gap-1 rounded-xl bg-[#166534] px-3 py-2 text-sm font-semibold text-[#FAF7F0] disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#166534] px-4 py-3 text-sm font-semibold text-[#FAF7F0] shadow-xl hover:bg-[#14532D]"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </button>
    </div>
  );
};

export default AiChatWidget;
