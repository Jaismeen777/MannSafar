import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const VoiceDetection: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [micAllowed, setMicAllowed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  const navigate = useNavigate();
  const mapEmotion = (raw: string): string => {
  const mapping: Record<string, string> = {
    Neutral: "Carefree",
    Sad: "Lonely",
    Stressed: "Tensed",
  };
  return mapping[raw] || raw; 
};

  // Ask for mic permission
  useEffect(() => {
    async function askMicPermission() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicAllowed(true);
      } catch {
        setMicAllowed(false);
        setError("Microphone access denied. Please allow mic permissions.");
      }
    }
    askMicPermission();
  }, []);

  // Setup SpeechRecognition instance
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("SpeechRecognition API not supported in this browser.");
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recog = new SpeechRecognitionAPI();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onstart = () => {
      setRecording(true);
      setError(null);
    };

    recog.onerror = (event: any) => {
      setError("Speech recognition error: " + event.error);
      setRecording(false);
    };

    recog.onend = () => {
      setRecording(false);
    };

    recog.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAnalyzing(true);
      try {
        const res = await fetch("http://localhost:5000/api/analyze-sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript }),
        });
        const data = await res.json();
        if (data.emotion) {
          setEmotion(mapEmotion(data.emotion));
        } else {
          setError("No emotion detected.");
        }
      } catch (err) {
        setError("Error analyzing emotion.");
      } finally {
        setAnalyzing(false);
      }
    };

    setRecognition(recog);
  }, []);

  // Start recording
  const handleStartRecording = () => {
    if (recognition && micAllowed) {
      setEmotion(null);
      recognition.start();
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (recognition && recording) {
      recognition.stop();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
    {/* Back Button always top-left */}
    <header className="w-full flex items-center justify-start py-4 px-4">
      <Link to="/share-feelings">
        <Button className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>
    </header>
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Card className="w-[500px] shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-blue-600">
            🎤 Voice Emotion Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {error && <p className="text-red-500">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleStartRecording}
              disabled={!micAllowed || recording || analyzing}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {recording ? "Recording..." : "Start Recording"}
            </Button>

            <Button
              onClick={handleStopRecording}
              disabled={!recording}
              className="bg-red-500 hover:bg-red-600"
            >
              Stop Recording
            </Button>
          </div>

          {/* Status */}
          {analyzing && <p className="text-gray-400">Analyzing emotion...</p>}
          {emotion && (
            <div className="flex flex-col items-center gap-4 mt-4">
              <p className="text-lg font-medium text-green-400">
                Detected Emotion: <span className="font-bold">{emotion}</span>
              </p>

              {/* ✅ Start Conversation button */}
              <Button
                className="px-8 py-4 text-lg bg-rose-500 hover:bg-rose-600 text-white shadow-lg"
                onClick={() => navigate(`/mood-assessment/${emotion}`)}
              >
                Start Conversation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default VoiceDetection;