
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_STORES, APP_NAME } from '../../constants';
import { generateComparison } from '../../services/geminiService';

const ChatDashboard = ({ selectedStoreIds, onLogout }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const selectedStoreNames = INITIAL_STORES
        .filter(s => selectedStoreIds.has(s.id))
        .map(s => s.name);
        
      const result = await generateComparison(input, selectedStoreNames);
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: result.text,
        comparisonData: result.comparisonData
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', sender: 'ai', text: "Sorry, I had trouble processing that request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-[#0f1411]">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-zinc-900 flex flex-col justify-between p-6 border-r border-gray-100 dark:border-white/5 h-full shrink-0">
        <div className="flex flex-col gap-8 overflow-hidden">
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 text-white">
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-smart-dark dark:text-white">{APP_NAME}</h1>
          </div>
          
          <div className="flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-gray/40 dark:text-gray-500">Selected Stores</h2>
            </div>
            <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
              {INITIAL_STORES.filter(s => selectedStoreIds.has(s.id)).map(store => (
                <div key={store.id} className="group flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-800/50 shadow-sm border border-gray-100 dark:border-white/5 transition-all hover:border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                      <span className="material-symbols-outlined text-sm text-slate-gray/60 dark:text-gray-400">{store.icon}</span>
                    </div>
                    <span className="text-sm font-bold text-smart-dark dark:text-white">{store.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-50 dark:border-white/5 shrink-0">
          <button 
            onClick={() => navigate('/onboarding')}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">add_business</span>
            <span className="text-xs">Edit Stores</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full flex flex-col items-center relative">
        <div className="max-w-[960px] w-full px-6 flex flex-col h-full">
          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth py-8 flex flex-col gap-10 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-gray/40 dark:text-gray-500 uppercase tracking-widest">SMARTBOT AI</span>
                  </div>
                )}
                
                <div className={`max-w-[85%] ${
                  msg.sender === 'user' 
                  ? 'bg-primary/10 text-smart-dark dark:text-white px-5 py-3 rounded-2xl rounded-tr-none border border-primary/20 shadow-sm' 
                  : 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 p-6 rounded-2xl rounded-tl-none shadow-xl shadow-black/[0.02]'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.comparisonData && (
                    <div className="mt-6 flex flex-col gap-6 animate-slide-up">
                      <div className="flex flex-col md:flex-row gap-5">
                        <img 
                          alt={msg.comparisonData.productName} 
                          className="w-28 h-28 rounded-2xl object-cover shrink-0 shadow-lg" 
                          src={msg.comparisonData.productImage || `https://picsum.photos/seed/${msg.comparisonData.productName}/200`} 
                        />
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="text-xs font-extrabold text-slate-gray/40 uppercase tracking-widest mb-1">Comparing Prices For</p>
                          <h4 className="text-xl font-extrabold text-smart-dark dark:text-white">{msg.comparisonData.productName}</h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {msg.comparisonData.stores.map((s, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-white/5 group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-primary text-lg">{s.storeIcon || 'storefront'}</span>
                              <span className="text-sm font-bold text-smart-dark dark:text-white">{s.storeName}</span>
                            </div>
                            <span className="text-sm font-extrabold text-primary">{s.currency || 'RM'} {s.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-5 bg-[#f0fdf4] dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-4">
                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">lightbulb</span>
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">AI RECOMMENDATIONS:</p>
                          <ul className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed list-disc ml-4 space-y-1.5 font-medium">
                            {msg.comparisonData.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col gap-3 items-start animate-pulse">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-gray/40 uppercase tracking-widest">SMARTBOT IS THINKING...</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 p-6 rounded-2xl rounded-tl-none w-2/3 h-24 shadow-sm" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="pb-8 pt-4 w-full bg-background-light dark:bg-[#0f1411]">
            <div className="relative group">
              <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-black/[0.05] border border-gray-100 dark:border-white/5 p-3 flex flex-col min-h-[140px] focus-within:border-primary/30 transition-all">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="w-full bg-transparent border-0 focus:ring-0 text-smart-dark dark:text-white placeholder-gray-400 p-4 flex-1 resize-none text-sm leading-relaxed font-medium" 
                  placeholder="Ask AI about this product (e.g. Compare prices for Red Onion 1kg)..."
                />
                <div className="flex items-center justify-end p-2">
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="flex items-center justify-center w-11 h-11 bg-primary hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatDashboard;
