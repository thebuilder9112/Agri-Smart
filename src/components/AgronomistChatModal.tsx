import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Volume2,
  VolumeX,
  Loader2,
  X,
  HelpCircle,
} from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

interface AgronomistChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export const AgronomistChatModal: React.FC<AgronomistChatModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text:
        language === "hi"
          ? "नमस्ते! आप फसल रोग, खाद (यूरिया/DAP), सिंचाई या खेती के किसी भी सवाल के बारे में पूछ सकते हैं।"
          : language === "pa"
          ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਫਸਲ ਬਿਮਾਰੀ, ਖਾਦ ਜਾਂ ਸਿੰਚਾਈ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।"
          : "Hello! Ask me any question about crops, plant diseases, fertilizer (Urea/DAP), watering, or soil in plain words.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (customMsg?: string) => {
    const textToSend = customMsg || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", text: textToSend };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: updatedHistory,
          language,
        }),
      });
      const data = await response.json();
      const botReply = data.reply || data.fallbackReply || "Advice received.";
      setMessages([...updatedHistory, { role: "model", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedHistory,
        {
          role: "model",
          text: "Please check your soil moisture levels and inspect for pest or fungus on leaves.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string, index: number) => {
    if (!("speechSynthesis" in window)) return;
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : language === "es" ? "es-ES" : "en-US";
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const samplePrompts = [
    "How to save wheat crop from yellow rust?",
    "When to put Urea in paddy crop?",
    "How much water does cotton need in heat?",
    "Why are tomato leaves turning yellow?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[85vh] max-h-[700px] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                Ask Farm Question (AI)
                <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                  Online
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Ask about crops, diseases, fertilizer, or water
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-xs">
          {messages.map((msg, index) => {
            const isBot = msg.role === "model";
            return (
              <div
                key={index}
                className={`flex gap-3 ${isBot ? "items-start" : "items-start flex-row-reverse"}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isBot ? "bg-emerald-700 text-white" : "bg-slate-800 text-white"
                  }`}
                >
                  {isBot ? "🌾" : <User className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 space-y-1.5 ${
                    isBot
                      ? "bg-white text-slate-800 border border-slate-200 shadow-xs"
                      : "bg-emerald-700 text-white shadow-xs"
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</div>

                  {isBot && (
                    <div className="flex items-center justify-end pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleSpeak(msg.text, index)}
                        className="text-[10px] text-slate-500 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                        title="Read aloud"
                      >
                        {speakingIndex === index ? (
                          <>
                            <VolumeX className="w-3 h-3 text-emerald-600" />
                            Stop Voice
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            Listen in Voice
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Finding advice...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
            Example:
          </span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question here (in English, Hindi, Punjabi, etc.)..."
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm shrink-0 cursor-pointer hover:scale-105 active:scale-95"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
