import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {Link, useNavigate } from "react-router-dom";

const FaceDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [emotion, setEmotion] = useState<string>("");
  const navigate = useNavigate();

  // Start webcam
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => console.error("Play error:", err));
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  }, []);

  // Capture frame and send to backend
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b as Blob), "image/jpeg")
      );

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const res = await fetch("http://localhost:5000/api/analyze-face", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.emotion) setEmotion(data.emotion);
      } catch (err) {
        console.error("Face API error:", err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black">
        {/* Back Button */}
        <header className="w-full flex items-center justify-start py-4 px-4">
          <Link to="/share-feelings">
            <Button className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </header>
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width="640"
        height="480"
        className="rounded-lg shadow-md"
      />
      <p className="mt-4 text-lg font-semibold">
        Detected Emotion: {emotion || "Detecting..."}
      </p>
      {/* Start Conversation Button */}
      {emotion && (
        <Button
          className="mt-6 px-8 py-4 text-lg bg-rose-500 hover:bg-rose-600 text-white shadow-lg"
          onClick={() => navigate(`/mood-assessment/${emotion}`)}
        >
          Start Conversation
        </Button>
      )}
    </div>
    </div>
  );
};

export default FaceDetection;
