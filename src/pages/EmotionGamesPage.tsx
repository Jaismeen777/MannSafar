import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { Smile, Frown, Leaf, Sun, Zap, Search, HeartCrack, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

//Supabase Hook
function useSupabaseGameData(userId: string, emotion: string) {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const { data: record, error } = await supabase
        .from("emotion_games")
        .select("content")
        .eq("user_id", userId)
        .eq("emotion", emotion)
        .single();

      if (!error && record?.content) {
        setData(record.content as string[]);
      }
    };
    fetchData();
  }, [userId, emotion]);

  const saveData = async (newData: string[]) => {
    setData(newData);
    const { error } = await supabase.from("emotion_games").upsert({
      user_id: userId,
      emotion,
      content: newData,
    });
    if (error) console.error(error);
  };

  return [data, saveData] as const;
}


//Games

function GratitudeTree({ userId }: { userId: string }) {
  const [input, setInput] = useState("");
  const [leaves, saveLeaves] = useSupabaseGameData(userId, "Happy");

  const addLeaf = () => {
    if (input.trim()) {
      saveLeaves([...leaves, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-gray-700">Each gratitude note grows a leaf 🌱</p>
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I’m grateful for..."
        />
        <Button onClick={addLeaf}>Grow</Button>
      </div>
      <div className="relative w-full h-64 bg-green-100 rounded overflow-hidden">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-28 bg-yellow-800 rounded" />
        {leaves.map((leaf, i) => (
          <div
            key={i}
            className="absolute text-green-800 text-sm"
            style={{
              top: `${40 + Math.floor(i / 3) * 30}px`,
              left: `${120 + (i % 3) * 50 - 50}px`,
            }}
          >
            🍃 {leaf}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanionStars({ userId }: { userId: string }) {
  const [input, setInput] = useState("");
  const [stars, saveStars] = useSupabaseGameData(userId, "Lonely");

  const addStar = () => {
    if (input.trim()) {
      saveStars([...stars, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-gray-700">Each thought lights up a star ⭐</p>
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comforting thought..."
        />
        <Button onClick={addStar}>Shine</Button>
      </div>
      <div className="relative w-full h-64 bg-black rounded overflow-hidden">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 text-xs"
            style={{
              top: `${(i * 40) % 220}px`,
              left: `${40 + (i * 60) % 280}px`,
            }}
          >
            ✨ {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function MotivationMountain({ userId }: { userId: string }) {
  const [input, setInput] = useState("");
  const [steps, saveSteps] = useSupabaseGameData(userId, "Demotivated");

  const addStep = () => {
    if (input.trim()) {
      saveSteps([...steps, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-gray-700">Every task is a step up the mountain 🏔️</p>
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Small task..."
        />
        <Button onClick={addStep}>Add</Button>
      </div>
      <div className="relative w-full h-72 bg-blue-100 rounded overflow-hidden">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[100px] border-r-[100px] border-b-[200px] border-transparent border-b-gray-400" />
        {steps.map((s, i) => (
          <div
            key={i}
            className="absolute bg-green-200 text-xs rounded px-2 py-1 shadow"
            style={{
              bottom: `${20 + i * 25}px`,
              left: `${120 + (i % 2 === 0 ? -40 : 40)}px`,
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function CalmSmash({ userId }: { userId: string }) {
  const [count, saveCount] = useSupabaseGameData(userId, "Angry");
  const [smashCount, setSmashCount] = useState(count.length || 0);

  const smash = () => {
    const newCount = smashCount + 1;
    setSmashCount(newCount);
    saveCount(Array(newCount).fill("smash"));
  };

  return (
    <div className="text-center space-y-4">
      {smashCount < 5 ? (
        <>
          <p className="text-gray-700">Tap to smash stress out 💢</p>
          <Button onClick={smash}>Smash {smashCount}</Button>
        </>
      ) : (
        <>
          <p className="text-gray-700">Now, breathe with the circle 🌸</p>
          <div className="w-32 h-32 mx-auto rounded-full bg-blue-300 animate-ping mt-2" />
        </>
      )}
    </div>
  );
}

function DreamDoodle({ userId }: { userId: string }) {
  const [input, setInput] = useState("");
  const [doodles, saveDoodles] = useSupabaseGameData(userId, "Carefree");

  const addDoodle = () => {
    if (input.trim()) {
      saveDoodles([...doodles, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-gray-700">Write doodles & let imagination flow 🎨</p>
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Emoji + words..."
        />
        <Button onClick={addDoodle}>Add</Button>
      </div>
      <div className="p-4 bg-purple-100 rounded min-h-[150px] flex flex-wrap gap-3 justify-center">
        {doodles.map((d, i) => (
          <span key={i} className="text-xl bg-white shadow px-2 py-1 rounded">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

function BreathingGarden({ userId }: { userId: string }) {
  const [count, setCount] = useState(0);
  const [petals, savePetals] = useSupabaseGameData(userId, "Tensed");

  useEffect(() => {
    if (count > 0) {
      savePetals([...petals, "🌸"]);
    }
  }, [count]);

  return (
    <div className="text-center space-y-4">
      <p className="text-gray-700">
        Breathe in → flower grows, Breathe out → petals bloom
      </p>
      <Button onClick={() => setCount(count + 1)}>Take a Breath</Button>
      <div className="flex flex-wrap gap-2 justify-center">
        {petals.map((p, i) => (
          <span key={i} className="text-2xl">
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

function KnowledgeExplorer({ userId }: { userId: string }) {
  const facts = [
    "Bananas are berries 🍌",
    "Sharks existed before trees 🌊🌳",
    "Octopuses have three hearts 🐙",
    "Your stomach gets a new lining every 3–4 days 🫀",
    "Butterflies taste with their feet 🦋",
    "Sloths can hold their breath longer than dolphins 🦥",
    "A day on Venus is longer than a year on Venus 🌌",
    "Wombat poop is cube-shaped 🟦",
    "There are more stars in space than grains of sand on Earth ✨",
    "Koalas have fingerprints almost identical to humans 🐨",
    "Water can boil and freeze at the same time 🌡️",
    "Sea otters hold hands while they sleep 🦦",
    "Banana plants are herbs, not trees 🌱",
    "The heart of a blue whale is the size of a car 🚙",
    "Ants don’t have lungs 🐜",
    "The Eiffel Tower can grow taller in summer due to heat ☀️",
    "A group of flamingos is called a flamboyance 🦩",
    "Your bones are stronger than steel 🦴",
    "Some turtles can breathe through their butts 🐢",
    "Cows have best friends and get stressed when separated 🐄",
  ];
  const [path, savePath] = useSupabaseGameData(userId, "Curious");

  const discover = () => {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    savePath([...path, fact]);
  };

  return (
    <div className="text-center space-y-4">
      <Button onClick={discover}>Discover</Button>
      <div className="space-y-2 mt-4">
        {path.map((f, i) => (
          <div key={i} className="p-2 bg-yellow-50 rounded shadow text-sm text-gray-800">
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

//Main Page

export function EmotionGamesPage() {
  const location = useLocation();
  const initialEmotion = location.state?.emotion || "Happy";
  const [currentEmotion, setCurrentEmotion] = useState(initialEmotion);
  const [userId, setUserId] = useState<string>("");

  // fetching user from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || "demo-user"); 
    };
    fetchUser();
  }, []);

  if (!userId) {
    return <p className="text-center mt-20">Loading your games...</p>;
  }

  const emotionMap: any = {
    Happy: {
      component: <GratitudeTree userId={userId} />,
      title: "Gratitude Tree",
      description: "Grow a tree of positivity 🌳",
    },
    Lonely: {
      component: <CompanionStars userId={userId} />,
      title: "Companion Stars",
      description: "Write kind words that shine as stars ⭐",
    },
    Demotivated: {
      component: <MotivationMountain userId={userId} />,
      title: "Motivation Mountain",
      description: "Climb higher with every small task 🏔️",
    },
    Angry: {
      component: <CalmSmash userId={userId} />,
      title: "Calm Smash + Breathe",
      description: "Smash out anger, then calm your breath 🔥🌸",
    },
    Carefree: {
      component: <DreamDoodle userId={userId} />,
      title: "Dream Doodle",
      description: "Free your creativity with doodles 🎨",
    },
    Tensed: {
      component: <BreathingGarden userId={userId} />,
      title: "Breathing Garden",
      description: "Each breath grows a flower 🌸",
    },
    Curious: {
      component: <KnowledgeExplorer userId={userId} />,
      title: "Knowledge Explorer",
      description: "Explore fun discoveries 🧠",
    },
  };

  const currentData = emotionMap[currentEmotion];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">
              Your Emotion-Focused Games
            </h1>
          </div>
        </div>
      </header>

        {/* Emotion Selector */}
        <Card className="p-6 text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              How are you feeling right now?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4">
            {Object.keys(emotionMap).map((emo) => {
              const Icon =
                emo === "Happy"
                  ? Smile
                  : emo === "Lonely"
                  ? HeartCrack
                  : emo === "Demotivated"
                  ? Frown
                  : emo === "Angry"
                  ? Zap
                  : emo === "Carefree"
                  ? Sun
                  : emo === "Tensed"
                  ? Leaf
                  : Search;
              return (
                <Button
                  key={emo}
                  variant={currentEmotion === emo ? "default" : "secondary"}
                  onClick={() => setCurrentEmotion(emo)}
                >
                  <Icon className="mr-2 h-4 w-4" /> {emo}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Render Game */}
        <div className="flex flex-col md:flex-row items-center gap-12 bg-card p-8 rounded-xl shadow-lg">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-4xl font-bold text-primary">
              {currentData.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {currentData.description}
            </p>
            <div className="mt-4">{currentData.component}</div>
          </div>
        </div>
      </div>
  ); 
}

export default EmotionGamesPage;
