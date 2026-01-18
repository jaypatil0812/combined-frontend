import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { ModelType } from '../types';

// Type for the context provided by AppShell
interface ChatPageContext {
    currentSession: any;
    onSendMessage: (text: string) => void;
    isTyping: boolean;
    selectedModel: ModelType;
    setSelectedModel: (m: ModelType) => void;
    theme: 'dark' | 'light';
    inputValue: string;
    setInputValue: (v: string) => void;
    onCreateNewSession: () => void;
}

export const ChatPage: React.FC = () => {
    const {
        currentSession,
        onSendMessage,
        isTyping,
        selectedModel,
        setSelectedModel,
        theme,
        inputValue,
        setInputValue,
        onCreateNewSession
    } = useOutletContext<ChatPageContext>();

    const [showModelMenu, setShowModelMenu] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const modelMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (modelMenuRef.current && !modelMenuRef.current.contains(target)) setShowModelMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentSession, isTyping]);

    const getCurrentModelLabel = () => {
        if (selectedModel === ModelType.FLASH) return "Helixar v0.1";
        if (selectedModel === ModelType.PRO) return "Helixar Pro";
        return "Helixar v0.1";
    };

    return (
        <div className="relative flex flex-col h-full bg-black">
            {/* Grok-style Minimal Header */}
            <header className="absolute top-0 left-0 right-0 z-20 flex h-14 items-center justify-between px-6 bg-transparent pointer-events-none">
                {/* Left - Model Selector */}
                <div className="flex items-center pointer-events-auto">
                    <div className="relative" ref={modelMenuRef}>
                        <button onClick={() => setShowModelMenu(!showModelMenu)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition-all text-[#8e8e93] hover:text-white font-medium text-[14px] group">
                            <span>{getCurrentModelLabel()}</span>
                            <svg className={`opacity-50 group-hover:opacity-100 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
                        </button>
                        {showModelMenu && (
                            <div className="absolute top-full left-0 mt-2 w-60 bg-[#121212] border border-[#2a2a2a] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-1.5 mb-1 border-b border-[#2a2a2a]">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Model Selection</span>
                                </div>
                                <button onClick={() => { setSelectedModel(ModelType.FLASH); setShowModelMenu(false); }} className="flex items-center justify-between w-full px-4 py-2.5 text-left text-[14px] font-medium text-white hover:bg-[#1a1a1a] transition-colors">
                                    Helixar v0.1
                                    {selectedModel === ModelType.FLASH && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
                                </button>
                                <button onClick={() => { setSelectedModel(ModelType.PRO); setShowModelMenu(false); }} className="flex items-center justify-between w-full px-4 py-2.5 text-left text-[14px] font-medium text-white hover:bg-[#1a1a1a] transition-colors">
                                    Helixar Pro
                                    {selectedModel === ModelType.PRO && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                        onClick={onCreateNewSession}
                        className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#2A2A2D] text-white border border-[#333] font-medium text-[13px] transition-colors flex items-center gap-2"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New Chat
                    </button>
                    <button className="p-2 text-[#555] hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg></button>
                    <button className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-[13px] hover:bg-neutral-200 transition-colors flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                        Share
                    </button>
                </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto relative flex flex-col items-center">
                {currentSession?.messages.length === 0 ? (
                    <div key={currentSession?.id} className="flex flex-col items-center justify-center h-full px-4 text-center max-w-2xl w-full animate-scale-in pb-20">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Helixar</h1>
                            <p className="text-gray-500 text-lg">Your creative intelligence engine.</p>
                        </div>
                        <ChatInput onSend={onSendMessage} disabled={isTyping} centered value={inputValue} onChange={setInputValue} />
                    </div>
                ) : (
                    <div className="w-full max-w-3xl mx-auto px-4 py-8 pb-40">
                        {currentSession?.messages.map((msg: any) => (
                            <ChatMessage key={msg.id} message={msg} theme={theme} />
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-3 animate-slide-up-fade text-gray-400 mt-4 mb-14">
                                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                                <span className="text-sm font-medium animate-pulse">Thinking...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {currentSession && currentSession.messages.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-10 shrink-0">
                    <ChatInput onSend={onSendMessage} disabled={isTyping} value={inputValue} onChange={setInputValue} />
                </div>
            )}
        </div>
    );
};
