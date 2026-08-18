import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  X,
  HelpCircle,
  Wheat,
  Droplets,
  Bug,
  Globe,
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
          ? "नमस्ते! मैं एग्रीविज़न एआई कृषि वैज्ञानिक हूँ। आप फसल रोग, खाद (NPK), सिंचाई या कीट नियंत्रण के बारे में कुछ भी पूछ सकते हैं।"
          : language === "pa"
          ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਐਗਰੀਵਿਜ਼ਨ ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ਹਾਂ। ਤੁਸੀਂ ਫਸਲ ਬਿਮਾਰੀ, ਖਾਦ ਜਾਂ ਸਿੰਚਾਈ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।"
          : "Hello! I am your AgriVision AI Agronomist. Ask me anything about crop health, precision irrigation, soil NPK balancing, organic remedies, or farming solutions.",
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
      const botReply = data.reply || data.fallbackReply || "Agronomist recommendation received.";
      setMessages([...updatedHistory, { role: "model", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedHistory,
        {
          role: "model",
          text: "I am ready to help. Please check your soil moisture levels and inspect for fungal spot patterns under older leaves.",
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
    utterance.lang = language === "hi" ? "hi-IN" : language === "es" ? "es-ES" : "en-US";
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const samplePrompts = [
    "How to treat yellow rust in wheat organically?",
    "Calculate NPK dosage for 5 tons/ha Basmati rice",
    "How much water does cotton need during flowering?",
    "Why are my tomato leaves curling upwards?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[85vh] max-h-[700px] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                AgriVision AI Agronomist
                <span className="text-[10px] font-semibold bg-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-600">
                  Live
                </span>
              </h3>
              <p className="text-[11px] text-emerald-300">
                Specialized in crop diagnostics, hydrology & organic remedies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 text-xs">
          {messages.map((msg, index) => {
            const isBot = msg.role === "model";
            return (
              <div
                key={index}
                className={`flex gap-3 ${isBot ? "items-start" : "items-start flex-row-reverse"}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isBot ? "bg-emerald-800 text-emerald-100" : "bg-slate-800 text-white"
                  }`}
                >
                  {isBot ? "AI" : <User className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 shadow-xs space-y-1.5 ${
                    isBot
                      ? "bg-white text-slate-800 border border-slate-200"
                      : "bg-emerald-700 text-white"
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                  {isBot && (
                    <div className="flex items-center justify-end pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleSpeak(msg.text, index)}
                        className="text-[10px] text-slate-400 hover:text-emerald-700 font-medium flex items-center gap-1"
                        title="Read aloud"
                      >
                        {speakingIndex === index ? (
                          <>
                            <VolumeX className="w-3 h-3 text-emerald-600" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            Listen
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
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Agronomist AI is analyzing farm parameters...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starter Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
            Suggested:
          </span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0 transition-colors"
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
            placeholder="Type your agricultural question in English, Hindi, Punjabi, Spanish..."
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm shrink-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
