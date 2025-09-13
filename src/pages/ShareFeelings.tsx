import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic, Camera, Send, Smile, Frown, Meh, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function ShareFeelings() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [micAllowed, setMicAllowed] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [feelings, setFeelings] = useState("");
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Request camera & mic access
    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setMicAllowed(true);
        setCameraAllowed(true);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        toast({
          title: "Media Access Denied",
          description: "Please allow camera and microphone access to use this feature.",
          variant: "destructive",
        });
      }
    }
    initMedia();

    // Setup Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = "en-US";
      recog.interimResults = false;

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFeelings(transcript);
        analyzeEmotion(transcript);
        setRecording(false);
      };

      recog.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast({
            title: "Speech Recognition Error",
            description: "An error occurred with speech recognition. Please try again.",
            variant: "destructive",
        });
        setRecording(false);
        setAnalyzing(false);
      };

      recog.onend = () => {
          setRecording(false);
      }

      setRecognition(recog);
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
      toast({
          title: "Browser Not Supported",
          description: "Your browser does not support the Speech Recognition API.",
          variant: "destructive",
      });
    }
  }, []);

  // 🔹 Emotion Analysis Logic
  const analyzeEmotion = async (text: string) => {
    if (!text) return;

    setAnalyzing(true);
    setEmotion("Analyzing...");

    try {
      const response = await fetch("http://localhost:5000/api/analyze-sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment.");
      }

      const data = await response.json();
      const detectedEmotion = data.emotion;
      setEmotion(detectedEmotion);
    } catch (error) {
      console.error("Emotion analysis failed:", error);
      setEmotion("Could not detect emotion 😕");
      toast({
          title: "API Error",
          description: "Failed to analyze emotion. Check your backend server.",
          variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartRecording = () => {
    if (recognition && !recording) {
      setRecording(true);
      setFeelings(""); // Clear previous feelings
      setEmotion(null); // Clear previous emotion
      recognition.start();
    }
  };

  const handleStopRecording = () => {
    if (recognition && recording) {
        recognition.stop();
    }
  };

  const handleStartConversation = () => {
    navigate("/emotionbot", { state: { feelings, emotion } });
  };

  const getEmotionIcon = () => {
    switch (emotion) {
      case "Happy":
        return <Smile className="inline-block h-6 w-6 text-green-500 mr-2" />;
      case "Sad":
      case "Depressed":
        return <Frown className="inline-block h-6 w-6 text-blue-500 mr-2" />;
      case "Angry":
      case "Stressed":
        return <Meh className="inline-block h-6 w-6 text-red-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Share Your Feelings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Camera Preview */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Camera & Microphone Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border border-border"
              />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Camera className={`h-5 w-5 ${cameraAllowed ? "text-green-500" : "text-red-500"}`} />
                Camera {cameraAllowed ? "working" : "not allowed"}
                <Mic className={`h-5 w-5 ml-6 ${micAllowed ? "text-green-500" : "text-red-500"}`} />
                Microphone {micAllowed ? "working" : "not allowed"}
              </div>
            </CardContent>
          </Card>

          {/* Speech Input */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Speak Your Feelings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-2">
                Press the microphone button and describe how you’re feeling right now. 
                The AI will analyze it and start the conversation.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={recording ? handleStopRecording : handleStartRecording}
                  disabled={!micAllowed || analyzing}
                  className={`flex items-center gap-2 ${recording ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"}`}
                >
                  {recording ? <Mic className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
                  {recording ? "Stop Speaking" : "Start Recording"}
                </Button>
                <span className="text-muted-foreground italic">
                  {feelings || "Nothing recorded yet..."}
                </span>
              </div>

              {analyzing && (
                  <div className="flex items-center mt-4 text-lg font-semibold text-primary">
                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                    Analyzing your feelings...
                  </div>
              )}

              {!analyzing && emotion && (
                <div className="mt-4 text-lg font-semibold">
                  Detected Emotion:
                  <span className="text-primary ml-2 flex items-center">
                    {getEmotionIcon()}
                    {emotion}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Start Conversation */}
          <div className="flex justify-center">
            <Button
              onClick={handleStartConversation}
              disabled={!feelings.trim() || analyzing}
              className="px-6 py-3 text-lg font-semibold"
            >
              <Send className="h-5 w-5 mr-2" />
              Start Conversation
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}