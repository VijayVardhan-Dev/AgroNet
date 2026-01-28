import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
    // Initial state with a welcome message
    const [messages, setMessages] = useState([
        {
            role: 'model', // Using 'model' to match Gemini terminology internal storage, mapped to UI
            content: 'Hello! I am your AgroNet AI assistant powered by Gemma. How can I help you regarding crops, weather, or farming today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // User message
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const API_KEY = import.meta.env.VITE_GEMMA_API_KEY;
            // Using the requested model: gemma-3-27b-it
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${API_KEY}`;

            // Prepare history for the API

            // System instruction for brevity
            const systemInstruction = {
                role: 'user', // Gemma API treats "user" prompts as instructions efficiently
                parts: [{ text: "You are an agricultural expert AI. Provide SHORT, SIMPLE, and WELL-STRUCTURED answers. Use bullet points and bold text for readability. Avoid long paragraphs." }]
            };

            const contents = [systemInstruction];

            // Append history
            messages
                .filter(m => m.content) // details
                .forEach(m => {
                    contents.push({
                        role: m.role === 'assistant' ? 'model' : m.role,
                        parts: [{ text: m.content }]
                    });
                });

            // Add current new message
            contents.push({
                role: 'user',
                parts: [{ text: userMessage.content }]
            });

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents
                })
            });

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                // Extract response text
                const aiResponseText = data.candidates[0].content.parts[0].text;
                setMessages(prev => [...prev, { role: 'model', content: aiResponseText }]);
            } else {
                console.error("API Error or Empty Response:", data);
                setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I not receive a valid response. Please try again.' }]);
            }

        } catch (error) {
            console.error("Network Error:", error);
            setMessages(prev => [...prev, { role: 'model', content: 'Network error. Please check your connection.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="bg-green-600 p-4 text-white flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <h2 className="font-bold text-lg">AgroNet AI (Gemma)</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] md:max-w-[75%] p-3 rounded-2xl text-sm md:text-base ${msg.role === 'user'
                                ? 'bg-green-600 text-white rounded-br-none shadow-md'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                                }`}
                        >
                            <div className="prose prose-sm max-w-none 
                                prose-headings:font-bold prose-headings:text-sm prose-headings:mb-1 
                                prose-ul:list-disc prose-ul:pl-4 prose-ul:mb-2 
                                prose-p:mb-2 last:prose-p:mb-0
                                prose-strong:font-bold
                                ">
                                <ReactMarkdown>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                            <span className="text-xs text-gray-500">Gemma is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about crops, weather..."
                        className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-green-600 disabled:bg-gray-300 text-white p-3 rounded-xl hover:bg-green-700 transition-colors shadow-md"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
