"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { X, Check } from 'lucide-react';

interface VoiceInputProps {
  onStopRecording: (isRecording: boolean) => void;
  onSubmit: (transcript: string) => void;
}

export function VoiceInput({ onStopRecording, onSubmit }: VoiceInputProps) {
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    window.SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!window.SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please try Chrome.");
      onStopRecording(false);
      return;
    }

    const recognition = new window.SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript + interimTranscript.slice(prev.length));
    };
    
    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        onStopRecording(false);
    }
    
    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onStopRecording]);

  const handleDiscard = () => {
    onStopRecording(false);
  };

  const handleSubmit = () => {
    onSubmit(transcript);
  };

  return (
    <div className="flex items-center w-full p-2 border rounded-md bg-muted">
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-1 h-6">
            <span className="w-1 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
            <span className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></span>
            <span className="w-1 h-6 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
            <span className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></span>
            <span className="w-1 h-5 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
        </div>
        <p className="text-sm text-muted-foreground flex-1">{transcript || 'Listening...'}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={handleDiscard}>
          <X className="w-5 h-5" />
        </Button>
        <Button size="icon" onClick={handleSubmit}>
          <Check className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
