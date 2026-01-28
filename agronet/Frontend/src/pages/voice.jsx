
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

const MODEL = "models/gemini-2.5-flash-native-audio-latest"; // Updated to valid available model
const API_KEY = "AIzaSyD5A6dPNtYK_VMsd4V7Z590QbvM1r9778g"; // Replace with your key
const WEBSOCKET_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

const Voice = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Refs to manage non-react state (sockets, audio context)
    const socketRef = useRef(null);
    const audioContextRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const processorRef = useRef(null);

    // --- 1. Audio Output (Text-to-Speech playback) ---
    const playAudioChunk = (base64Audio) => {
        if (!audioContextRef.current) return;

        // Convert Base64 -> Binary -> Float32
        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // The API sends 16-bit PCM (Int16), usually at 24kHz
        const int16Data = new Int16Array(bytes.buffer);
        const float32Data = new Float32Array(int16Data.length);

        // Convert Int16 to Float32 (Standard Web Audio format)
        for (let i = 0; i < int16Data.length; i++) {
            float32Data[i] = int16Data[i] / 32768.0;
        }

        // Queue the audio
        const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
        buffer.getChannelData(0).set(float32Data);

        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();
    };

    // --- 2. Connection Logic ---
    const connect = async () => {
        // A. Init Audio Context
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });

        // B. Connect WebSocket
        const ws = new WebSocket(WEBSOCKET_URL);

        ws.onopen = () => {
            console.log("Connected to Gemini Live");
            setIsConnected(true);

            // Send Initial Setup Message
            const setupMsg = {
                setup: {
                    model: MODEL,
                    generation_config: { response_modalities: ["AUDIO"] }
                }
            };
            ws.send(JSON.stringify(setupMsg));
        };

        ws.onmessage = async (event) => {
            // Handle the Blob response (Audio/JSON mix)
            const data = event.data;

            if (data instanceof Blob) {
                const text = await data.text();
                try {
                    const json = JSON.parse(text);
                    // Verify if we have server audio content
                    if (json.serverContent?.modelTurn?.parts?.[0]?.inlineData) {
                        const audioData = json.serverContent.modelTurn.parts[0].inlineData.data;
                        playAudioChunk(audioData);
                    }
                } catch (e) {
                    console.error("Error parsing JSON", e);
                }
            }
            // Sometimes it sends pure text JSON
            else {
                const json = JSON.parse(data);
                // Handle audio here as well just in case format differs
            }
        };

        ws.onerror = (err) => console.error("WebSocket Error:", err);
        ws.onclose = (event) => {
            console.log("WebSocket Closed", event.code, event.reason);
            setIsConnected(false);
        };

        socketRef.current = ws;
    };

    // --- 3. Microphone Input Logic ---
    const startRecording = async () => {
        setIsSpeaking(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000
                }
            });
            mediaStreamRef.current = stream;

            const context = audioContextRef.current;

            // Define AudioWorklet processor code
            const workletCode = `
        class PCMProcessor extends AudioWorkletProcessor {
          process(inputs, outputs, parameters) {
            const input = inputs[0];
            if (input.length > 0) {
              const float32Data = input[0];
              const int16Data = new Int16Array(float32Data.length);
              for (let i = 0; i < float32Data.length; i++) {
                let s = Math.max(-1, Math.min(1, float32Data[i]));
                int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }
              this.port.postMessage(int16Data);
            }
            return true;
          }
        }
        registerProcessor('pcm-processor', PCMProcessor);
      `;

            // Load Worklet
            const blob = new Blob([workletCode], { type: 'application/javascript' });
            const workletUrl = URL.createObjectURL(blob);
            await context.audioWorklet.addModule(workletUrl);

            const source = context.createMediaStreamSource(stream);
            const processor = new AudioWorkletNode(context, 'pcm-processor');

            processor.port.onmessage = (e) => {
                if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

                const pcmData = e.data;
                const base64Audio = btoa(
                    String.fromCharCode(...new Uint8Array(pcmData.buffer))
                );

                const msg = {
                    realtime_input: {
                        media_chunks: [{
                            mime_type: "audio/pcm",
                            data: base64Audio
                        }]
                    }
                };
                socketRef.current.send(JSON.stringify(msg));
            };

            source.connect(processor);
            // AudioWorkletNode does not need to connect to destination if it doesn't output audio, 
            // but it might be needed for the graph to run in some browsers. 
            // Connecting to destination is safe here as we don't passthrough audio in the processor.
            processor.connect(context.destination);

            processorRef.current = processor;

        } catch (err) {
            console.error("Mic Error:", err);
            setIsSpeaking(false);
        }
    };

    const stopRecording = () => {
        setIsSpeaking(false);
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
    };

    const disconnect = () => {
        stopRecording();
        if (socketRef.current) socketRef.current.close();
        if (audioContextRef.current) audioContextRef.current.close();
        setIsConnected(false);
    };

    return (
        <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center gap-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Gemini Live</h2>
                <p className="text-sm text-gray-500">Native Audio Integration</p>
            </div>

            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isSpeaking ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
                }`}>
                {isSpeaking ? (
                    <Volume2 className="w-10 h-10 text-red-500" />
                ) : (
                    <MicOff className="w-10 h-10 text-gray-400" />
                )}
            </div>

            <div className="flex gap-4 w-full">
                {!isConnected ? (
                    <button
                        onClick={connect}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Connect
                    </button>
                ) : (
                    <>
                        {!isSpeaking ? (
                            <button
                                onClick={startRecording}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Mic className="w-4 h-4" /> Start Mic
                            </button>
                        ) : (
                            <button
                                onClick={stopRecording}
                                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium"
                            >
                                Mute Mic
                            </button>
                        )}

                        <button
                            onClick={disconnect}
                            className="px-4 py-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-medium"
                        >
                            End
                        </button>
                    </>
                )}
            </div>

            {isConnected && (
                <div className="text-xs text-green-600 font-mono bg-green-50 px-2 py-1 rounded">
                    ● Connected to WebSocket
                </div>
            )}
        </div>
    );
};

export default Voice;