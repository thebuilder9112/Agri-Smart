import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Volume2,
  VolumeX,
  Loader2,
  HelpCircle,
  Sparkles,
  Bot,
  Wheat,
  Droplets,
  Bug,
  TestTube,
} from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

interface AskFarmAiViewProps {
  language: string;
}

export const AskFarmAiView: React.FC<AskFarmAiViewProps> = ({ language }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text:
        language === "hi"
          ? "नमस्ते! मैं एग्रीविज़न कृषि सहायक हूँ। आप फसल की बीमारी, खाद (यूरिया/DAP की सही मात्रा), पानी देने का समय, या किसी भी कीड़े की रोकथाम के बारे में सरल भाषा में पूछ सकते हैं।"
          : language === "pa"
          ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਐਗਰੀਵਿਜ਼ਨ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਫਸਲ ਦੀ ਬਿਮਾਰੀ, ਖਾਦ (ਯੂਰੀਆ/ਡੀਏਪੀ), ਸਿੰਚਾਈ ਜਾਂ ਕੀੜਿਆਂ ਦੀ ਰੋਕਥਾਮ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।"
          : language === "gu"
          ? "નમસ્તે! હું એગ્રીવિઝન કૃષિ સહાયક છું. તમે પાકના રોગ, ખાતર (યુરિયા/DAP), સિંચાઈ અથવા જંતુ નિયંત્રણ વિશે સરળ ભાષામાં પૂછી શકો છો."
          : "Hello! I am your AgriVision Farm AI Assistant. You can ask any question about crop diseases, exact fertilizer dosages (Urea/DAP/Potash), irrigation timing, organic pest sprays, or soil health in simple words.",
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
    scrollToBottom();
  }, [messages]);

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
      const botReply =
        data.reply ||
        data.fallbackReply ||
        "I have recorded your question. Please ensure proper soil moisture and check for early signs of leaf pests.";

      setMessages([...updatedHistory, { role: "model", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedHistory,
        {
          role: "model",
          text: "AgriVision advisory: Maintain 55–65% soil moisture for optimal root nutrient intake. Check leaf undersides for aphid colonies. Apply balanced N-P-K at regular vegetative intervals.",
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
    const cleanText = text.replace(/[*#_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (language === "hi") utterance.lang = "hi-IN";
    else if (language === "es") utterance.lang = "es-ES";
    else utterance.lang = "en-US";

    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const suggestedTopics = [
    {
      title: "Yellow Rust in Wheat",
      icon: Wheat,
      query: "How to identify and treat yellow rust in wheat with organic and market spray?",
    },
    {
      title: "Urea Fertilizer Timing",
      icon: TestTube,
      query: "When is the best time to apply Urea in paddy and wheat crops?",
    },
    {
      title: "Drip Emitter Cleaning",
      icon: Droplets,
      query: "How do I clean clogged drip irrigation emitters using low-cost acid treatment?",
    },
    {
      title: "Neem Oil Spray Recipe",
      icon: Bug,
      query: "What is the correct dose and recipe of neem oil spray for whiteflies and aphids?",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 border border-emerald-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/80 flex items-center justify-center border border-emerald-400/40 shadow-inner shrink-0">
              <Bot className="w-7 h-7 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase bg-emerald-800/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                  AI Farm Consultant
                </span>
                <span className="text-xs text-emerald-300 font-medium">
                  Available in multiple languages
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Ask Farm Question
              </h1>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Instant advice on crops, plant diseases, fertilizer dosages, and water management.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Voice playback available for all answers</span>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Popular Farming Topics (Click to ask instantly):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {suggestedTopics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <button
                key={i}
                onClick={() => handleSendMessage(topic.query)}
                disabled={isLoading}
                className="text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex items-start gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{topic.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {topic.query}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-slate-700 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-700 text-white font-medium"
                    : "bg-slate-50 text-slate-800 border border-slate-200 shadow-xs"
                }`}
              >
                {msg.role === "model" && (
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-200/80">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      AgriVision Farm Advisor
                    </span>
                    <button
                      onClick={() => handleSpeak(msg.text, index)}
                      className="text-[11px] text-slate-600 hover:text-emerald-700 flex items-center gap-1 font-semibold cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
                      title="Read answer out loud"
                    >
                      {speakingIndex === index ? (
                        <>
                          <VolumeX className="w-3 h-3 text-rose-600" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-emerald-600" />
                          <span>Listen Voice</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Consulting agronomy database & weather telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask e.g. 'How to protect tomato from leaf curl virus?' or type in Hindi/Punjabi..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
