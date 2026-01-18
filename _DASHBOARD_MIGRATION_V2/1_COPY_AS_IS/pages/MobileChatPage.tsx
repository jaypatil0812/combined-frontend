import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChatSession, Message, ModelType } from '../types';

interface MobileChatContext {
    currentSession: ChatSession | undefined;
    onSendMessage: (text: string) => void;
    isTyping: boolean;
    inputValue: string;
    setInputValue: (v: string) => void;
    theme: 'dark' | 'light';
}

export const MobileChatPage: React.FC = () => {
    const {
        currentSession,
        onSendMessage,
        isTyping,
        inputValue,
        setInputValue,
        theme
    } = useOutletContext<MobileChatContext>();

    // Quick actions for empty state
    const quickActions = [
        { label: 'DeepSearch', icon: '🔍' },
        { label: 'Create Image', icon: '🎨' },
        { label: 'Pick Personas', icon: '👥' },
        { label: 'Voice', icon: '🎙️' }
    ];

    return (
        <div className="flex flex-col h-full overflow-y-auto scroll-smooth no-scrollbar">
            <div className="px-5 pb-[calc(180px+env(safe-area-inset-bottom))] min-h-full flex flex-col">
                {currentSession && currentSession.messages.length > 0 ? (
                    <div className="pt-4 space-y-6">
                        {currentSession.messages.map((msg: Message) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-[20px] ${msg.role === 'user' ? 'bg-white/10 rounded-tr-none' : 'bg-[#1a1a1a] rounded-tl-none'}`}>
                                    <p className="text-sm text-gray-200 whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="ml-0 mt-2 pl-0 max-w-[85%] w-fit">
                                <div className="flex flex-col gap-2 p-4 rounded-[20px] rounded-tl-none bg-transparent">
                                    <div className="h-2.5 bg-zinc-800 rounded-full w-24 animate-pulse"></div>
                                    <div className="h-2.5 bg-zinc-800 rounded-full w-32 animate-pulse delay-75"></div>
                                    <div className="h-2.5 bg-zinc-800 rounded-full w-16 animate-pulse delay-150"></div>
                                </div>
                            </div>
                        )}
                        {/* Spacer to prevent input box overlap */}
                        <div className="h-4"></div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                        <div className="mb-10 opacity-90 text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Helixar</h1>
                            <p className="text-gray-500 text-sm">Design. Code. Create.</p>
                        </div>

                        {/* Pill Grid */}
                        <div className="grid grid-cols-2 gap-3 w-full max-w-sm px-4">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => onSendMessage(action.label)}
                                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[13px] font-medium text-gray-300"
                                >
                                    <span className="opacity-70">{action.icon}</span>
                                    <span>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input always at bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    onSendMessage(inputValue);
                                    setInputValue('');
                                }
                            }}
                            placeholder="Message Helixar..."
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-full px-5 py-3.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 text-sm"
                        />
                        <button
                            onClick={() => {
                                onSendMessage(inputValue);
                                setInputValue('');
                            }}
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
