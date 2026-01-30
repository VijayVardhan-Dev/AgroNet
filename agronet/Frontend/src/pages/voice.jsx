import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2, Play, Square } from 'lucide-react';

const Voice = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    // --- Audio Recording Logic ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await sendAudioToBackend(audioBlob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setStatusMessage('Listening...');
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setStatusMessage('Error accessing microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setStatusMessage('Processing audio...');
        }
    };

    // --- Backend Communication ---
    const sendAudioToBackend = async (audioBlob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            // Replace with your actual backend URL
            const response = await fetch('https://agronet-i12n.onrender.com/api/chat-voice', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.text) {
                setStatusMessage('Speaking response...');
                speakResponse(data.text);
            } else {
                setStatusMessage('No response text received');
            }

        } catch (error) {
            console.error("Error sending audio:", error);
            setStatusMessage('Error communicating with server');
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Text to Speech (Browser Native) ---
    const speakResponse = (text) => {
        if (!window.speechSynthesis) {
            setStatusMessage('TTS not supported in this browser');
            return;
        }

        // Cancel any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Optional: Select a "Google" voice if available for better quality
        const voices = window.speechSynthesis.getVoices();
        const googleVoice = voices.find(v => v.name.includes("Google") && v.lang.includes("en"));
        if (googleVoice) utterance.voice = googleVoice;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
            setIsPlaying(false);
            setStatusMessage('');
        };
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setIsPlaying(false);
            setStatusMessage('Error playing audio');
        };

        window.speechSynthesis.speak(utterance);
    };

    const stopPlayback = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setStatusMessage('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">

                {/* Visualizer / Status Area */}
                <div className="h-48 bg-linear-to-br from-green-500 to-emerald-700 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
                    {/* Abstract Circles Background */}
                    <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-50%] right-[-20%] w-64 h-64 bg-emerald-300 opacity-20 rounded-full blur-3xl"></div>

                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-3 z-10">
                            <Loader2 className="w-12 h-12 animate-spin text-white/90" />
                            <span className="text-sm font-medium opacity-90">Thinking...</span>
                        </div>
                    ) : isPlaying ? (
                        <div className="flex flex-col items-center gap-3 z-10 animate-pulse">
                            <Volume2 className="w-16 h-16 text-white" />
                            <span className="text-sm font-medium opacity-90">Speaking...</span>
                        </div>
                    ) : isRecording ? (
                        <div className="flex flex-col items-center gap-3 z-10">
                            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg ring-4 ring-red-400/30">
                                <Mic className="w-10 h-10 text-white" />
                            </div>
                            <span className="text-sm font-medium opacity-90">Listening...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 z-10 opacity-80">
                            <Mic className="w-12 h-12" />
                            <span className="text-sm font-medium">Tap to Speak</span>
                        </div>
                    )}
                </div>

                {/* Controls Area */}
                <div className="p-8 flex flex-col items-center gap-6">
                    <div className="text-center space-y-1">
                        <h2 className="text-2xl font-bold text-gray-800">Voice Assistant</h2>
                        <p className="text-gray-500 text-sm min-h-[20px]">{statusMessage || "Ready to help you"}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {!isRecording && !isPlaying && (
                            <button
                                onClick={startRecording}
                                className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-green-200"
                            >
                                <Mic className="w-8 h-8" />
                            </button>
                        )}

                        {isRecording && (
                            <button
                                onClick={stopRecording}
                                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all animate-bounce-slight"
                            >
                                <Square className="w-6 h-6 fill-current" />
                            </button>
                        )}

                        {isPlaying && (
                            <button
                                onClick={stopPlayback}
                                className="w-16 h-16 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center shadow-md transition-all"
                            >
                                <Square className="w-6 h-6 fill-current" />
                            </button>
                        )}
                    </div>
                </div>

            </div>

            <p className="mt-8 text-xs text-gray-400 text-center max-w-xs">
                Powered by Gemini AI • Audio is processed securely
            </p>
        </div>
    );
};

export default Voice;