"use client";
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Hi! I am your AI Tutor. Ask me anything about your lessons!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // TODO: Integrate with Gemini API
        // For now, mock response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'system', content: "That's a great question! Let me explain..." }]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-primary"
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    padding: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 50,
                    display: isOpen ? 'none' : 'flex'
                }}
            >
                <MessageCircle size={32} />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="card" style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '350px',
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden',
                    zIndex: 50,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0 }}>AI Tutor</h3>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white' }}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'var(--background)',
                                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                padding: '0.75rem',
                                borderRadius: '1rem',
                                maxWidth: '80%',
                                borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                                borderBottomLeftRadius: msg.role === 'system' ? '0' : '1rem'
                            }}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                Thinking...
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '1rem',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a doubt..."
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #cbd5e1',
                                outline: 'none'
                            }}
                        />
                        <button onClick={handleSend} className="btn btn-primary" style={{ padding: '0.5rem' }}>
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
