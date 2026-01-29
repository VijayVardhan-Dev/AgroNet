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
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]  rounded-2xl overflow-hidden">

   

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed `}
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
                        <div className="p-3 rounded-2xl rounded-bl-none border border-gray-100  flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                            <span className="text-xs text-gray-500">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4">
                <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about crops, weather..."
                        className="flex-1 bg-transparent border-none px-4 py-2.5 text-sm md:text-base focus:ring-0 placeholder:text-gray-400 outline-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-green-600 disabled:bg-gray-300 text-white p-2.5 rounded-full hover:bg-green-700 transition-all shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
