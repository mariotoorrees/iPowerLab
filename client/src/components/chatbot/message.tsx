import { ChatMessage } from "@shared/schema";
import { AlertTriangle, Bot, User } from "lucide-react";

type MessageProps = {
  message: ChatMessage;
};

export function Message({ message }: MessageProps) {
  const isUserMessage = message.isUserMessage;

  // Helper function to format message content with lists, etc.
  const formatContent = (content: string) => {
    // Check if the content contains a numbered list
    if (content.includes("\n1. ")) {
      const parts = content.split(/\n(\d+\. )/);
      
      return (
        <>
          {parts.map((part, index) => {
            if (index === 0) {
              return <p key={index} className="text-sm">{part}</p>;
            } else if (/^\d+\. $/.test(part)) {
              // This is a list marker
              return null;
            } else {
              // This is list content
              return (
                <ol key={index} className="text-sm list-decimal ml-4 mt-2 space-y-1">
                  <li>{part.trim()}</li>
                </ol>
              );
            }
          })}
        </>
      );
    }
    
    // Check if content contains sections with headings indicated by bold text
    if (content.includes("\n\n")) {
      return content.split("\n\n").map((paragraph, index) => {
        if (paragraph.startsWith("Sample") || paragraph.includes(":")) {
          // This is likely a heading
          const parts = paragraph.split(":");
          if (parts.length > 1) {
            return (
              <div key={index} className="mt-2">
                <p className="text-sm font-medium">{parts[0]}:</p>
                <p className="text-sm mt-2">{parts.slice(1).join(":")}</p>
              </div>
            );
          }
          return <p key={index} className="text-sm font-medium mt-2">{paragraph}</p>;
        }
        return <p key={index} className="text-sm mt-2">{paragraph}</p>;
      });
    }
    
    // Default formatting
    return <p className="text-sm">{content}</p>;
  };

  return (
    <div className={`flex mb-4 ${isUserMessage ? "justify-end" : ""}`}>
      {!isUserMessage && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div
        className={`p-3 rounded-lg max-w-[80%] ${
          isUserMessage
            ? "bg-primary text-white rounded-tr-none"
            : "bg-surface-variant rounded-tl-none"
        }`}
      >
        {formatContent(message.content)}
      </div>
      
      {isUserMessage && (
        <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center ml-2 flex-shrink-0">
          <User className="h-4 w-4 text-on-surface-variant" />
        </div>
      )}
    </div>
  );
}

export function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="flex mb-4">
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div className="p-3 rounded-lg max-w-[80%] bg-red-50 text-red-800 rounded-tl-none">
        <p className="text-sm">
          {error || "There was an error sending your message. Please try again."}
        </p>
      </div>
    </div>
  );
}
