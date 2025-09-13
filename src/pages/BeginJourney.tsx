import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Mic, List, ArrowLeft, Compass } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function BeginJourney() {
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold text-primary">Begin Your Journey</h1>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Compass className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Begin Your Journey</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Choose how you’d like to share your feelings today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Face Detection */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" /> Face Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/face-detection")}>
                  Use Camera
                </Button>
              </CardContent>
            </Card>

            {/* Voice Detection */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" /> Voice Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/voice-detection")}>
                  Use Microphone
                </Button>
              </CardContent>
            </Card>

            {/* Manual Input */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" /> Manual Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/dropdown-input")}>
                  Choose Emotion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
