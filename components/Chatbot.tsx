import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, ChevronUp, Sparkles } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MOCK_PRODUCTS } from '../constants';

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am the Buy Xtra virtual assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastWidth = useRef(window.innerWidth);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && !isDesktop) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, isDesktop]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  useEffect(() => {
    if (isOpen) {
        const timer = setTimeout(scrollToBottom, 350);
        return () => clearTimeout(timer);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const initChat = async () => {
        if (!chatSessionRef.current) {
          const productData = MOCK_PRODUCTS.map(p => `
ID: ${p.id} | Name: ${p.name} | Brand: ${p.brand} | Price: ₹${p.variants[0].price}
Specs: ${Object.entries(p.specs).map(([k,v]) => `${k}:${v}`).join(', ')}
`).join('\n---\n');

          const systemInstruction = `
Buy Xtra Chatbot (FINAL VERSION)
Role: AI Assistant for Buy Xtra Store.
Objective: Quick, concise, to-the-point sales support.

STRICT BEHAVIOR RULES:
1. Conciseness: Responses MUST be short and direct. No long paragraphs.
2. Languages: English, Bengali (বাংলা), or Hindi (हिंदी). Reply in the user's language.
3. Inventory: Use ONLY: ${productData}. If not found, say it can be arranged via WhatsApp.
4. Return Policy: Do NOT say "no returns". If asked about returns/issues, say: "Please contact the brand's authorized service center for support."
5. Trust: All products are 100% brand new with GST bill. Open-box delivery.
6. Payments: Cash on Delivery (COD) available. 1-day delivery.
7. Orders: Guide to click "Buy on WhatsApp" at +91 7797037684.

Style: professional, brief, sales-oriented.
`;

          try {
              const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
              chatSessionRef.current = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                  systemInstruction: systemInstruction,
                  thinkingConfig: { thinkingBudget: 0 }
                },
              });
          } catch (error) {
              console.error("AI Init Error", error);
          }
        }
    };
    initChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg });
      let fullText = '';
      let isFirstChunk = true;
      for await (const chunk of result) {
          const c = chunk as GenerateContentResponse;
          if (c.text) {
              fullText += c.text;
              if (isFirstChunk) {
                  setIsLoading(false);
                  setMessages(prev => [...prev, { role: 'model', text: fullText }]);
                  isFirstChunk = false;
              } else {
                  setMessages(prev => {
                      const newMessages = [...prev];
                      newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: fullText };
                      return newMessages;
                  });
              }
          }
      }
    } catch (error) {
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'model', text: "Service error. Please try again." }]);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <div 
        ref={chatbotRef}
        style={{ height: isDesktop ? 'max(600px, calc(100vh - 120px))' : 'calc(var(--vh, 1vh) * 55)', maxHeight: '720px' }}
        className={`fixed z-[100] flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 w-[92%] left-1/2 top-[68px] -translate-x-1/2 lg:w-[380px] lg:left-auto lg:right-6 lg:top-[74px] lg:translate-x-0 ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}
      >
        <div className="bg-[#2874F0] p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm">Buy Xtra Support</h3>
              <div className="flex items-center gap-1 opacity-90">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[10px]">Active Now</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><ChevronUp className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-[#F1F3F6] space-y-4 overscroll-contain">
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#2874F0] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                  {msg.text}
                </div>
             </div>
           ))}
           {isLoading && (
             <div className="flex justify-start">
               <div className="bg-white p-3 rounded-xl rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin text-[#2874F0]" />
                  <span className="text-[11px] text-gray-400">Typing...</span>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-gray-100 shrink-0 pb-[calc(env(safe-area-inset-bottom)+0.6rem)]">
           <div className="flex gap-2 items-center">
             <input
               type="text" value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Ask anything..."
               className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#2874F0] bg-gray-50"
             />
             <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-[#2874F0] text-white p-2.5 rounded-full hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"><Send className="w-5 h-5" /></button>
           </div>
           
           <div className="mt-3 flex items-center justify-center gap-1.5 opacity-50 select-none grayscale hover:grayscale-0 transition-all">
             <span className="text-[10px] font-medium text-gray-500">Powered by</span>
             <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-gray-700">BuyXtra AI</span>
                <Sparkles className="w-2 h-2 text-blue-500" />
             </div>
           </div>
        </div>
      </div>
    </>
  );
};
