import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LovyDubbyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-center px-6">
      <Heart className="h-16 w-16 text-blue-400 animate-pulse mb-6" />
      <h1 className="text-5xl md:text-6xl font-bold text-blue-300 mb-4 animate-fade-in">
        LovyDubby 
      </h1>
      <p className="text-4xl md:text-4xl font-bold text-gray-300 mb-4 animate-fade-in">
  Are you as super excited as we are?
</p>
<p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 animate-fade-in">
  Something incredible is taking shape behind the scenes — a lifelike 3D model
  with smooth, natural interaction. Get ready to meet LovyDubby soon… stay tuned!
</p>
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
        onClick={() => window.history.back()}
      >
        Go Back
      </Button>
    </div>
  );
}