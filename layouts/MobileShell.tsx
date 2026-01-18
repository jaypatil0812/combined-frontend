import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ChatSession, ModelType } from '../types';
import { Sidebar } from '../components/Sidebar';
import { SettingsSection } from '../components/SettingsModal';

interface MobileShellProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    onDeleteSession: (id: string) => void;
    onRenameSession: (id: string, newTitle: string) => void;
    onCreateNewSession: () => void;
    onSelectSession: (id: string) => void;
    theme: 'dark' | 'light';
    selectedModel: ModelType;
    setSelectedModel: (m: ModelType) => void;
    onUpgrade: () => void;
    onOpenSearch: () => void;
    onOpenSettings: (section: SettingsSection) => void;
    context?: any;
}

export const MobileShell: React.FC<MobileShellProps> = ({
    sessions,
    currentSessionId,
    onDeleteSession,
    onRenameSession,
    onCreateNewSession,
    onSelectSession,
    theme,
    selectedModel,
    setSelectedModel,
    onUpgrade,
    onOpenSearch,
    onOpenSettings,
    context
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Get current page title based on route
    const pageTitle = location.pathname === '/dashboard' ? 'Dashboard' : 'Helixar';

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#000000] text-white overflow-hidden selection:bg-white/20">
            {/* 1. Header (Minimal) */}
            <header className="flex h-14 items-center justify-between px-4 shrink-0 bg-transparent relative z-20 pointer-events-none">
                <div className="pointer-events-auto">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-white/90 hover:text-white">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                </div>

                <div className="flex items-center gap-1 opacity-90">
                    <span className="font-bold text-lg tracking-tight">{pageTitle}</span>
                </div>

                <div className="pointer-events-auto">
                    <button onClick={onCreateNewSession} className="p-2 -mr-2 text-white/90">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                </div>
            </header>

            {/* 2. Main Content - React Router Outlet */}
            <main className="flex-1 overflow-y-auto w-full relative">
                <Outlet context={context || { onCreateNewSession }} />
            </main>

            {/* 3. Mobile Drawer */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[60] flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>

                    {/* Panel */}
                    <div className="relative w-[85%] max-w-[340px] h-full bg-black/70 backdrop-blur-xl shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col border-r-0 pb-6">
                        {/* Search Header in Drawer */}
                        <div className="px-4 pt-6 pb-2">
                            <button
                                onClick={() => { onOpenSearch(); setIsSidebarOpen(false); }}
                                className="flex items-center gap-3 w-full bg-white/5 border-none rounded-xl px-4 py-3 text-white placeholder-gray-500 mb-2 hover:bg-white/10 transition-colors text-left focus:ring-1 focus:ring-gray-700"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                <span className="text-sm font-medium">Search</span>
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto pl-1">
                            <Sidebar
                                sessions={sessions}
                                currentId={currentSessionId}
                                onSelect={(id) => { onSelectSession(id); setIsSidebarOpen(false); }}
                                onDelete={onDeleteSession}
                                onRename={onRenameSession}
                                onNewChat={() => { onCreateNewSession(); setIsSidebarOpen(false); }}
                                onToggleSidebar={() => { }}
                                model={selectedModel}
                                setModel={setSelectedModel}
                                onUpgrade={onUpgrade}
                                onOpenSearch={onOpenSearch}
                                onOpenSettings={onOpenSettings}
                                onOpenGroupLink={() => { }}
                                theme={theme}
                                isCollapsed={false}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
