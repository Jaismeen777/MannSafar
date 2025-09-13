import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const moods = [
  { label: "Happy", color: "bg-red-400", face: "(˶ᵔ ᵕ ᵔ˶)"  },
  { label: "Lonely", color: "bg-blue-400", face: "(っ- ‸ - ς)" },
  { label: "Angry", color: "bg-yellow-500", face: "(¬`‸´¬)" },
  { label: "Carefree", color: "bg-green-400", face: "(¬_¬)" },
  { label: "Demotivated", color: "bg-purple-400", face: "¯\\_(ツ)_/¯" },
  { label: "Tensed", color: "bg-pink-400", face: "(,,•᷄‎ࡇ•᷅ ,,)?" },
  { label: "Curious", color: "bg-indigo-400", face: "( •̯́ ₃ •̯̀)" },
];

export function DropdownInput() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (mood: string) => {
    setSelected(mood);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 p-4 font-sans flex flex-col items-center">

      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between py-4 px-2">
        <Link to="/share-feelings">
          <Button className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </header>

      <main className="flex flex-col items-center w-full p-2 md:p-6">
        <h1 className="text-3xl font-bold text-[#1E63F6] mb-6">
          How are you feeling right now?
        </h1>

        <Card className="w-full max-w-2xl bg-transparent shadow-none">
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {moods.slice(0, 6).map((mood) => (
                <button
                  key={mood.label}
                  className={`h-32 rounded-xl shadow-lg flex flex-col justify-center items-center text-white font-semibold text-lg transition transform hover:scale-105 ${mood.color} ${
                    selected === mood.label ? "ring-4 ring-white" : ""
                  }`}
                  onClick={() => handleSelect(mood.label)}
                >
                  <span className="text-2xl">{mood.face}</span>
                  <span className="mt-2">{mood.label}</span>
                </button>
              ))}
            </div>

            {/* Last centered mood */}
            <div className="flex justify-center mt-6">
              <button
                key={moods[6].label}
                className={`h-32 w-32 rounded-xl shadow-lg flex flex-col justify-center items-center text-white font-semibold text-lg transition transform hover:scale-105 ${moods[6].color} ${
                  selected === moods[6].label ? "ring-4 ring-white" : ""
                }`}
                onClick={() => handleSelect(moods[6].label)}
              >
                <span className="text-2xl">{moods[6].face}</span>
                <span className="mt-2">{moods[6].label}</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {selected && (
  <Link to={`/mood-assessment/${selected}`}>
    <Button
      className="mt-8 w-full max-w-lg px-8 py-4 bg-rose-500 text-lg font-semibold hover:bg-rose-600 text-white shadow-lg"
    >
      Start Conversation
    </Button>
  </Link>
)}
      </main>
    </div>
  );
}
