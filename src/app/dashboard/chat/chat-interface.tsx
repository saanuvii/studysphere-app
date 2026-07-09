"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ChatInterface({ pdfId, pdfName }: { pdfId: string; pdfName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          pdfId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      // Add a placeholder assistant message
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: "Sorry, I encountered an error processing your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      <div className="border-b border-border/50 p-4 bg-card/50 backdrop-blur flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-sm">Chatting with</h2>
          <p className="text-xs text-muted-foreground truncate max-w-sm">{pdfName}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 mt-12">
            <Bot className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              Ask a question about <strong>{pdfName}</strong>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pb-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={`p-3 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card border border-border/50 shadow-sm rounded-tl-sm prose prose-sm dark:prose-invert"
                  }`}
                >
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-muted text-muted-foreground border border-border">
                  <Bot size={14} />
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border/50 shadow-sm rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 max-w-4xl mx-auto relative"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about this document..."
            className="flex-1 bg-background/50 border-border/50 pr-12 h-12 rounded-full focus-visible:ring-primary/20"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
