import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, Loader2 } from "lucide-react";

export default function ExpertChat({ context }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your EcoWatch AI Expert. I've reviewed the analysis report above. Do you have any questions about this environmental issue?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context: context // Pass the analysis result as context
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-xl mt-6 flex flex-col h-[500px]">
      {/* Chat Header */}
      <div className="bg-slate-950/80 p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <MessageSquare className="text-blue-400" size={18} />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Ask the Expert</h3>
          <p className="text-xs text-slate-400">Interactive AI Environmental Consultant</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'user' 
                ? 'bg-emerald-900/50 border border-emerald-500/30 text-emerald-400' 
                : 'bg-blue-900/50 border border-blue-500/30 text-blue-400'
            }`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-emerald-600/20 border border-emerald-500/20 text-emerald-50 rounded-tr-sm'
                : 'bg-slate-800/60 border border-slate-700 text-slate-200 rounded-tl-sm'
            }`}>
              {msg.content.split('\\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
             <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-900/50 border border-blue-500/30 text-blue-400">
              <Bot size={14} />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-200 rounded-tl-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-blue-400" />
              <span className="text-xs text-slate-400">Expert is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/50 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask a question about this report..."
            className="w-full bg-slate-900 border border-slate-700 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            <Send size={14} className={input.trim() && !isLoading ? 'translate-x-[1px] -translate-y-[1px]' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
}
