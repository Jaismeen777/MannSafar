import React, { useState, useEffect, useRef } from "react";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {ArrowLeft,MessageCircle,Bot,User,Mic,StopCircle,Send,} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RecordRTC from "recordrtc";

export function AICompanion() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [inputText, setInputText] = useState("");

  // Recording & playback
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (user) {
      initializeConversation();
    }
  }, [user]);

  const initializeConversation = async () => {
    try {
      const { data: conversations } = await supabase
        .from("ai_conversations")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1);

      if (conversations && conversations.length > 0) {
        const conversation = conversations[0];
        setCurrentConversationId(conversation.id);
        setMessages(
          Array.isArray(conversation.messages) ? conversation.messages : []
        );
      } else {
        const initialMessage = {
          id: 1,
          sender: "ai",
          text: "Hello! I'm here to listen and support you. How are you feeling today?",
          timestamp: new Date().toISOString(),
        };

        const { data: newConversation, error } = await supabase
          .from("ai_conversations")
          .insert({
            user_id: user?.id,
            title: "New Conversation",
            messages: [initialMessage],
          })
          .select()
          .single();

        if (error) throw error;

        setCurrentConversationId(newConversation.id);
        setMessages([initialMessage]);
      }
    } catch (error) {
      console.error("Error initializing conversation:", error);
      setMessages([
        {
          id: 1,
          sender: "ai",
          text: "Hello! I'm here to listen and support you. How are you feeling today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
      });
      recorder.startRecording();
      recorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use this feature.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(async () => {
        const audioBlob = recorderRef.current!.getBlob();
        setIsRecording(false);
        handleSendAudio(audioBlob);
      });
    }
  };

  //Sending recorded audio
  const handleSendAudio = async (audioBlob: Blob) => {
    setLoading(true);

    const localUrl = URL.createObjectURL(audioBlob);

    const userAudioMessage = {
      id: Date.now(),
      sender: "user",
      isAudio: true,
      audio_url: localUrl,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, userAudioMessage];
    setMessages(updatedMessages);

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: result.response,
        transcript: result.transcript,
        audio_url: result.audio_url,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = result.audio_url;
        audioPlayerRef.current.play();
      }

      saveConversation(finalMessages);
    } catch (error) {
      console.error("Error analyzing audio:", error);
      toast({
        title: "API Error",
        description: "Failed to connect to the backend.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sending text message
  const handleSendText = async () => {
    if (!inputText.trim()) return;
    setLoading(true);

    const userTextMessage = {
      id: Date.now(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, userTextMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: result.response,
        transcript: result.transcript,
        audio_url: result.audio_url,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = result.audio_url;
        audioPlayerRef.current.play();
      }

      saveConversation(finalMessages);
    } catch (error) {
      console.error("Error sending text:", error);
      toast({
        title: "API Error",
        description: "Failed to connect to backend.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setInputText("");
    }
  };

  // Saving conversation to Supabase
  const saveConversation = async (finalMessages: any[]) => {
    if (currentConversationId) {
      await supabase
        .from("ai_conversations")
        .update({
          messages: finalMessages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentConversationId);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">AI Companion</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <MessageCircle className="h-16 w-16 text-accent mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">AI Companion</h1>
            <p className="text-xl text-muted-foreground">
              Your empathetic AI companion is here to listen and provide support.
            </p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                Share your thoughts and feelings in a safe space
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        msg.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          msg.sender === "ai"
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {msg.sender === "ai" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          msg.sender === "ai"
                            ? "bg-accent/10"
                            : "bg-primary/10"
                        }`}
                      >
                        {msg.isAudio ? (
                          <p className="italic text-muted-foreground">
                            ...recording sent...
                          </p>
                        ) : (
                          <>
                            {msg.text && <p>{msg.text}</p>}
                            {msg.transcript && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                Your words: "{msg.transcript}"
                              </p>
                            )}
                            {msg.audio_url && (
                              <audio
                                controls
                                src={msg.audio_url}
                                className="mt-2 w-full"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <audio ref={audioPlayerRef} className="hidden" />
              </div>

              {/* Input row */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                />
                <Button onClick={handleSendText} disabled={loading || isRecording}>
                  <Send className="h-4 w-4" />
                </Button>

                {isRecording ? (
                  <Button onClick={stopRecording} variant="destructive">
                    <StopCircle className="h-4 w-4 mr-2" /> Stop
                  </Button>
                ) : (
                  <Button onClick={startRecording} disabled={loading || inputText.length > 0}>
                    <Mic className="h-4 w-4 mr-2" /> Record
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}