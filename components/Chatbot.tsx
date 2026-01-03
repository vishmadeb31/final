import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, ChevronUp } from 'lucide-react';
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        setTimeout(scrollToBottom, 300);
    }
  }, [messages, isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Back Button / History API support for mobile
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ chatbotOpen: true }, '');

      const handlePopState = (event: PopStateEvent) => {
        setIsOpen(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, setIsOpen]);

  const handleClose = () => {
    if (window.history.state?.chatbotOpen) {
      window.history.back();
    }
    setIsOpen(false);
  };

  // Dynamic Viewport Height Logic
  useEffect(() => {
    const updateVh = () => {
      const vh = (window.visualViewport?.height || window.innerHeight) * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      if (isOpen) scrollToBottom();
    };

    window.visualViewport?.addEventListener('resize', updateVh);
    window.visualViewport?.addEventListener('scroll', updateVh);
    window.addEventListener('resize', updateVh);
    updateVh();

    return () => {
      window.visualViewport?.removeEventListener('resize', updateVh);
      window.visualViewport?.removeEventListener('scroll', updateVh);
      window.removeEventListener('resize', updateVh);
    };
  }, [isOpen]);

  useEffect(() => {
    const initChat = async () => {
        if (!chatSessionRef.current) {
            const productData = MOCK_PRODUCTS.map(p => `
ID: ${p.id} | Name: ${p.name} | Brand: ${p.brand} | Category: ${p.category} | Price: ₹${p.variants[0].price}
Specs: ${Object.entries(p.specs).map(([k,v]) => `${k}:${v}`).join(', ')}
`).join('\n---\n');

          const systemInstruction = `
Buy Xtra Chatbot (FINAL VERSION - HIGH SPEED MODE)
Role: Buy Xtra Assistant for mobile/electronics.
Goal: Provide FAST product info and drive to WhatsApp (+91 7797037684).

🌐 Lang: Eng, Ben (বাংলা), Hin (हिंदी). Detect user lang and reply same. Be extremely concise.

📦 Data: ONLY use this inventory:
${productData}

🟢 Buying: ONLY via WhatsApp +91 7797037684. "Click Buy on WhatsApp button to order."
Rules: Keep answers VERY FAST and SHORT.
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
              console.error("Failed to initialize AI", error);
          }
        }
    };
    initChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!chatSessionRef.current) return;

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
          const text = c.text;
          if (text) {
              fullText += text;
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
      console.error("Chat error", error);
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'model', text: "Error. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // State to track if it's desktop view for height adjustment
  // Tablets are generally < 1024px in many cases or landscape up to 1280px.
  // We'll target <= 1023px for the "Mobile/Tablet Half Height" logic.
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div 
        className={`
            fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[90] transition-opacity duration-[280ms] lg:hidden
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div 
        ref={chatbotRef}
        style={{
          height: isDesktop ? '650px' : 'calc(var(--vh, 1vh) * 50)',
          maxHeight: isDesktop ? '650px' : 'calc(var(--vh, 1vh) * 50)',
        }}
        className={`
          fixed z-[100] flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100
          transition-all duration-[400ms] cubic-bezier(0.19, 1, 0.22, 1)
          w-[92%] left-1/2 top-[68px]
          -translate-x-1/2 
          origin-top
          lg:w-[380px] 
          lg:left-auto lg:right-6 lg:top-[74px]
          lg:translate-x-0
          lg:origin-top-right
          ${isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className="bg-[#2874F0] p-4 flex justify-between items-center text-white shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Buy Xtra Support</h3>
              <div className="flex items-center gap-1.5 opacity-90">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                <span className="text-[11px] font-medium text-blue-50">Online</span>
              </div>
            </div>
          </div>
          <button 
             onClick={handleClose} 
             className="hover:bg-white/20 p-2 rounded-full transition-colors active:scale-95"
             aria-label="Close Chat"
          >
             <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-[#F1F3F6] space-y-4 scroll-smooth overscroll-contain">
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${
                  msg.role === 'user' 
                    ? 'bg-[#2874F0] text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
             </div>
           ))}
           {isLoading && (
             <div className="flex justify-start animate-in fade-in duration-300">
               <div className="bg-white text-gray-800 border border-gray-100 shadow-sm p-4 rounded-2xl rounded-bl-none flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2874F0]" />
                  <span className="text-xs font-medium text-gray-500">Fast typing...</span>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-gray-100 shrink-0 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
           <div className="flex gap-2 items-center">
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleKeyPress}
               placeholder="Ask support..."
               className="flex-1 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#2874F0] bg-gray-50 transition-all"
               aria-label="Chat input"
             />
             <button 
               onClick={handleSend}
               disabled={isLoading || !input.trim()}
               className="bg-[#2874F0] text-white p-3 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-all shadow-sm active:scale-95 flex items-center justify-center w-11 h-11 shrink-0"
             >
               <Send className="w-5 h-5 ml-0.5" />
             </button>
           </div>
        </div>
      </div>
    </>
  );
};
