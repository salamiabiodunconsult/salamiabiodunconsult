/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, ExternalLink, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello! Welcome to Pulzitive! 🤝",
      time: getCurrentTime()
    },
    {
      id: 'welcome-2',
      sender: 'bot',
      text: "I am your virtual WhatsApp Assistant. Ask me anything about our Digital Marketing, SEO, Web Design services, or Pulzitive Academy. How can I assist you today?",
      time: getCurrentTime()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const handleFAQClick = (question: string) => {
    handleBotResponse(question);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    handleBotResponse(userText);
  };

  const handleBotResponse = (userText: string) => {
    // Add user message
    const newMsg: WhatsAppMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: getCurrentTime()
    };

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    // Bot matches questions
    setTimeout(() => {
      let replyText = "";
      const textLower = userText.toLowerCase();

      if (textLower.includes('service') || textLower.includes('offer') || textLower.includes('do you do') || textLower.includes('digital marketing')) {
        replyText = "At Pulzitive, we engineer conversion-optimized landing pages, manage high-growth programmatic Google/Meta ad funnels, structure local SEO schemas, and execute comprehensive brand audits that turn traffic into recurring client revenues.";
      } else if (textLower.includes('seo') || textLower.includes('search') || textLower.includes('rank') || textLower.includes('google search')) {
        replyText = "Our SEO services focus on keyword targeting, local schema structure, mobile-responsive layout performance, and content hierarchy tuning. We've helped portfolios scale search indexing and improve organic traffic by up to 92%!";
      } else if (textLower.includes('audit') || textLower.includes('free audit') || textLower.includes('site audit')) {
        replyText = "We offer a 100% Free Site & SEO Audit! Click the 'Request Free Site Audit' button on our homepage, enter your details, and our technical director will examine your search indexing constraints.";
      } else if (textLower.includes('academy') || textLower.includes('course') || textLower.includes('learn') || textLower.includes('tek12')) {
        replyText = "Pulzitive EdTech Academy provides premium gamified digital skills learning. Students learn React, TypeScript, and digital strategy with personal mentorship, active XP leaderboards, and accredited diplomas.";
      } else if (textLower.includes('who') || textLower.includes('director') || textLower.includes('founder') || textLower.includes('pulzitive')) {
        replyText = "Pulzitive is led by our Director, integrating premium digital advertising with our high-caliber STEAM technical learning portals.";
      } else if (textLower.includes('price') || textLower.includes('cost') || textLower.includes('paystack') || textLower.includes('fee')) {
        replyText = "We offer flexible pricing options! You can view our premium digital packages and academy subscription pricing tier models directly in our pricing portal. All payments are securely routed via Paystack.";
      } else if (textLower.includes('contact') || textLower.includes('phone') || textLower.includes('email') || textLower.includes('office')) {
        replyText = "You can contact our consultancy desk via email at pulzitive@gmail.com. Alternatively, click the link below to initiate an active direct WhatsApp session with one of our specialized team members!";
      } else {
        replyText = "Interesting question! As Pulzitive's digital consult specialist, I recommend exploring our Google/Meta ad plans or free SEO audits to boost your business. Ask me about: 'Services', 'SEO Strategy', 'Free Audit', or 'Tech Academy'!";
      }

      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        time: getCurrentTime()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const sampleFAQs = [
    "What digital marketing services do you offer?",
    "How can I get a Free SEO Audit?",
    "Tell me about the Pulzitive Tech Academy",
    "How do I contact Pulzitive?"
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-[#efeae2] rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden mb-4"
          >
            {/* WhatsApp Custom Header */}
            <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-emerald-400 flex items-center justify-center font-black text-xs text-white uppercase shrink-0">
                  PZ
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Pulzitive Chatbot</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] text-emerald-100 font-mono">Answers Frequently Asked Questions</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-[#128c7e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Chat Wallpaper & Message list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[82%] rounded-xl p-3 text-xs leading-relaxed relative ${
                    msg.sender === 'user'
                      ? 'bg-[#d9fdd3] text-slate-800 rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 rounded-tl-none shadow-sm'
                  }`}>
                    <p className="font-normal">{msg.text}</p>
                    <span className="block text-[8.5px] text-slate-400 mt-1 text-right font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-800 border border-slate-100 rounded-xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              {/* Instant FAQs Options Chips */}
              <div className="space-y-1.5 pt-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Click to Ask Virtual Consultant:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sampleFAQs.map((faq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleFAQClick(faq)}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10.5px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm font-medium text-left"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={chatEndRef} />
            </div>

            {/* Direct WhatsApp External Transition */}
            <div className="bg-[#128c7e]/10 p-2.5 border-t border-slate-200 text-center flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#075e54] font-bold">Need customized solutions?</span>
              <a 
                href="https://wa.me/2348154224426" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#075e54] border border-[#075e54]/20 font-black text-[11px] px-4 py-2 rounded-xl w-full justify-center transition-all shadow-sm"
              >
                <span>Launch Direct Client WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#f0f0f0] flex gap-2 border-t border-slate-200">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a query about SEO, Ads or Audit..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#075e54]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-white text-slate-800 border border-slate-200 p-2.5 rounded-full hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center disabled:bg-slate-50 disabled:text-gray-300 disabled:cursor-not-allowed shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#25d366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:bg-[#128c7e] border border-emerald-400 relative"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.474 1.332 4.988L2 22l5.137-1.348c1.472.802 3.125 1.226 4.871 1.226 5.505 0 9.988-4.482 9.988-9.988s-4.483-9.988-9.984-9.988zm4.723 13.52c-.22.62-1.27 1.15-1.74 1.19-.44.04-.98.05-1.59-.15-.75-.24-1.63-.64-2.52-1.33-.89-.69-1.57-1.46-2.07-2.12-.5-.66-.82-1.14-.99-1.47-.17-.33-.2-.59-.2-.59s-.02-.27.1-.42c.12-.15.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.53-1.28-.73-1.76-.2-.48-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.48-.29zm-4.723-11.52c4.412 0 8 3.588 8 8s-3.588 8-8 8c-1.408 0-2.731-.366-3.894-1.012l-.279-.155-2.887.758.771-2.812-.17-.282C4.316 14.542 4 13.308 4 12c0-4.412 3.588-8 8-8z"/>
          </svg>
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#075e54] text-[9px] font-bold items-center justify-center text-white">FAQ</span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
