"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

export function ChatInterface({ pdfId, pdfName }: { pdfId: string; pdfName: string }) {
  // Pass configuration via explicit cast to generic to bypass SDK version issues
  const config = {
    api: "/api/chat",
    body: { pdfId },
  } as Record<string, unknown>;

  const chatObj = useChat(config) as Record<string, unknown>;
  const messages = chatObj.messages as Array<{ id: string, role: string, content: string }>;
  const isLoading = chatObj.isLoading as boolean;
  const input = chatObj.input as string;
  const handleInputChange = chatObj.handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void;
  const handleSubmit = chatObj.handleSubmit as (e: React.FormEvent) => void;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-background/50">
      <div className="border-b border-border/50 p-4 bg-card/50 backdrop-blur flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-sm">Chatting with</h2>
          <p className="text-xs text-muted-foreground truncate max-w-sm">{pdfName}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages?.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 mt-12">
            <Bot className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              Ask a question about <strong>{pdfName}</strong>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pb-4">
            {messages?.map((m: { id: string, role: string, content: string }) => (
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
            {isLoading && (
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
            onChange={handleInputChange}
            placeholder="Ask something about this document..."
            className="flex-1 bg-background/50 border-border/50 pr-12 h-12 rounded-full focus-visible:ring-primary/20"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input?.trim?.()}
            className="absolute right-1.5 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 transition-transform active:scale-95"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
