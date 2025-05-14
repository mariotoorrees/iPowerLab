import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message, ErrorMessage } from "@/components/chatbot/message";
import { useChatMessages, useSendMessage } from "@/hooks/use-chatbot";
import { useUser } from "@/hooks/use-metrics";
import { Skeleton } from "@/components/ui/skeleton";

export default function Chatbot() {
  const { data: user } = useUser();
  const userId = user?.id || 1; // Default to 1 for demo
  const { data: messages = [], isLoading } = useChatMessages(userId);
  const { mutate: sendMessage, isPending, error } = useSendMessage();
  
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    
    sendMessage({
      userId,
      content: inputValue,
      isUserMessage: true
    });
    
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick suggestion chips
  const suggestions = [
    "Meal suggestions",
    "Workout nutrition",
    "Recipe ideas",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] animate-in fade-in duration-300">
      <div className="px-5 py-6 pb-0 flex-shrink-0">
        <h1 className="text-2xl font-semibold mb-4">AI Nutritionist</h1>
        <div className="bg-white rounded-[12px] shadow-card p-4 mb-6">
          <p className="text-sm">Your personalized nutrition assistant. Ask about meal plans, nutrition advice, or how to reach your goals.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5 py-4" id="chat-messages">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, i) => (
            <div key={i} className={`flex mb-4 ${i % 2 === 1 ? "justify-end" : ""}`}>
              {i % 2 === 0 && <Skeleton className="w-8 h-8 rounded-full mr-2 flex-shrink-0" />}
              <Skeleton className={`p-3 rounded-lg max-w-[80%] h-20 ${i % 2 === 1 ? "rounded-tr-none" : "rounded-tl-none"}`} />
              {i % 2 === 1 && <Skeleton className="w-8 h-8 rounded-full ml-2 flex-shrink-0" />}
            </div>
          ))
        ) : messages.length > 0 ? (
          // Message list
          <>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {error && <ErrorMessage error={(error as Error).message} />}
            <div ref={messagesEndRef} />
          </>
        ) : (
          // Welcome message
          <Message 
            message={{
              id: 0,
              userId: 0,
              content: "Hello! I'm your AI nutrition assistant. How can I help you today?",
              isUserMessage: false,
              timestamp: new Date()
            }} 
          />
        )}
      </div>
      
      <div className="px-5 py-4 border-t border-divider bg-background">
        <div className="flex">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your question..."
            className="flex-1 px-4 py-3 bg-surface rounded-l-lg border-0 focus-visible:ring-2 focus-visible:ring-primary"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isPending}
          />
          <Button 
            className="bg-primary text-white px-4 rounded-r-lg"
            onClick={handleSendMessage}
            disabled={isPending || inputValue.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex mt-2 justify-center gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="bg-surface-variant text-on-surface-variant text-xs px-3 py-1 h-auto rounded-full border-0"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isPending}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
