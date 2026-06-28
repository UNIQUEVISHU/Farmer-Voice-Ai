"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Mic, Send, Leaf, Square } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/usespeechrecgniation";
import { useTextToSpeech } from "@/hooks/usetextspeech";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  viaVoice?: boolean;
};

const SUGGESTIONS = [
  "When should I irrigate wheat?",
  "Is neem oil safe for tomatoes?",
  "Best natural fertilizer for soil health?",
  "How to prevent leaf curl in chilli?",
];

const MessageBubble = memo(function MessageBubble({
  msg,
  onSpeak,
  isSpeaking,
}: {
  msg: Message;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-green-700 px-4 py-2.5 text-sm text-white shadow-sm sm:max-w-[70%]">
          {msg.viaVoice && (
            <span className="mb-1 flex items-center gap-1 text-xs text-green-200">
              <Mic className="h-3 w-3" aria-hidden="true" /> Voice input
            </span>
          )}
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 shadow-sm">
        <Leaf className="h-4 w-4 text-green-700" aria-hidden="true" />
      </span>
      <div className="max-w-[85%] sm:max-w-[75%]">
        <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 shadow-sm border border-green-100">
          {msg.text}
        </div>
        <button
          onClick={() => onSpeak(msg.text)}
          className="mt-1.5 ml-1 text-xs font-medium text-green-700 hover:text-green-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
        >
          {isSpeaking ? "🔊 Speaking..." : "🔊 Listen"}
        </button>
      </div>
    </div>
  );
});

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    transcript,
    isListening,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { speak, isSpeaking } = useTextToSpeech();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      setInput("");
      resetTranscript();
      startListening();
    }
  }, [isListening, startListening, stopListening, resetTranscript]);

  const sendMessage = useCallback(
    async (text: string, viaVoice = false) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        text: trimmed,
        viaVoice,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      resetTranscript();
      setIsTyping(true);
      setError(null);
      inputRef.current?.focus();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, language: "en" }),
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to get response.");
        }

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: data.data.reply,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsTyping(false);
      }
    },
    [resetTranscript]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input, isListening || transcript.length > 0);
    },
    [input, isListening, transcript, sendMessage]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#F4F7F0]">

      {/* CHAT SCROLL AREA */}
      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-5">

          {messages.length === 0 && (
            <div className="mt-4 flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 shadow-sm">
                <Leaf className="h-6 w-6 text-green-700" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-lg font-semibold text-green-900">
                Ask me anything about farming
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Speak or type your question in English or Hindi
              </p>
              <div className="mt-5 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-xl border border-green-200 bg-white px-4 py-3 text-left text-sm text-gray-700 shadow-sm transition-all hover:border-green-400 hover:bg-green-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onSpeak={speak}
              isSpeaking={isSpeaking}
            />
          ))}

          {isTyping && (
            <div className="flex items-center gap-3" aria-label="Assistant is typing">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 shadow-sm">
                <Leaf className="h-4 w-4 text-green-700" aria-hidden="true" />
              </span>
              <div className="flex gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm border border-green-100">
                <span className="h-2 w-2 rounded-full bg-green-500 motion-safe:animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-green-500 motion-safe:animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-green-500 motion-safe:animate-bounce" />
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT BAR */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-green-100 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6"
      >
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <button
            type="button"
            onClick={toggleVoice}
            disabled={!isVoiceSupported}
            aria-pressed={isListening}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            title={!isVoiceSupported ? "Voice input not supported in this browser" : undefined}
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:opacity-40 ${
              isListening
                ? "bg-red-500 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isListening ? (
              <Square className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Mic className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <div className="flex flex-1 items-center rounded-full border border-green-200 bg-[#F4F7F0] px-4 py-2.5 shadow-sm transition-colors focus-within:border-green-400 focus-within:bg-white">
            <label htmlFor="chat-input" className="sr-only">
              Type your farming question
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Message your farming consultant..."}
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-700 text-white shadow-sm transition-colors hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {!isVoiceSupported && (
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-amber-600">
            Voice input isn&apos;t supported in this browser — try Chrome or Edge.
          </p>
        )}
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-gray-400">
          Voice input works best in Hindi or English
        </p>
      </form>
    </div>
  );
}