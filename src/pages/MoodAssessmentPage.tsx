import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Tables } from "@/integrations/supabase/types";

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface Answers {
  [key: string]: number;
}

// Questions for all emotions
const allQuestions: { [key: string]: Question[] } = {
  Happy: [
    { id: 'q1', text: 'Main reason for happiness?', options: ['Spending time with loved ones', 'Achieving a goal', 'Enjoying hobby', 'Something unexpected', 'Others'] },
    { id: 'q2', text: 'Sense of accomplishment impact?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q3', text: 'Social connections impact?', options: ['No impact', 'A little', 'Moderately', 'Very much'] },
    { id: 'q4', text: 'Did you feel progress today?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] }
  ],
  Lonely: [
    { id: 'q1', text: 'Main reason for loneliness?', options: ['Lack of conversations', 'Distance from loved ones', 'Feeling misunderstood', 'Not able to share feelings'] },
    { id: 'q2', text: 'Gap between you and others?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q3', text: 'Lack of social interaction impact?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q4', text: 'Strong desire for connection?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] }
  ],
  Angry: [
    { id: 'q1', text: 'Main reason for anger?', options: ['Feeling disrespected', 'Unjust situation', 'Specific person', 'Feeling powerless'] },
    { id: 'q2', text: 'Boundaries crossed?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q3', text: 'Frustration contribution?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q4', text: 'Loss of control?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] }
  ],
  Carefree: [
    { id: 'q1', text: 'Main reason for carefree feeling?', options: ['Positive outcome', 'Feeling relaxed', 'Spontaneous day', 'Feeling in control'] },
    { id: 'q2', text: 'Absence of stress contribution?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q3', text: 'Freedom from obligations?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q4', text: 'Going with the flow?', options: ['Not at all', 'A little', 'Moderately', 'Completely'] }
  ],
  Tensed: [
    { id: 'q1', text: 'Main reason for tension?', options: ['Work pressure', 'Future worry', 'Overthinking', 'Physical discomfort'] },
    { id: 'q2', text: 'Stress from task/deadline?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q3', text: 'Racing thoughts?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q4', text: 'Uncertainty about future?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] }
  ],
  Curious: [
    { id: 'q1', text: 'Main reason for curiosity?', options: ['New idea', 'Discovering hobby', 'Learning', 'Intriguing person'] },
    { id: 'q2', text: 'Desire for knowledge?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q3', text: 'Mind engaged/stimulated?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q4', text: 'Inspired to ask questions?', options: ['No', 'Few questions', 'Many questions', 'Constant stream'] }
  ],
  Demotivated: [
    { id: 'q1', text: 'Main reason for demotivation?', options: ['Lack of progress', 'Overwhelmed', 'Boredom', 'Negative feedback'] },
    { id: 'q2', text: 'Sense of lack of purpose?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q3', text: 'Disconnected from goals?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] },
    { id: 'q4', text: 'Energy to start tasks?', options: ['Not at all', 'A little', 'Moderately', 'Very much'] }
  ],
};

export function MoodAssessmentPage() {
  const { emotion } = useParams<{ emotion: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answers>({});
  const questions = allQuestions[emotion || ""] || [];

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionIndex = userAnswers[currentQuestion.id];

    if (selectedOptionIndex === undefined) {
      toast.error("Please select an option to continue.");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (!user) {
        toast.error("You must be logged in to save your assessment.");
        return;
      }

      try {
        const { error } = await supabase
          .from("wellness_assessments")
          .insert({
            user_id: user.id,
            assessment_type: emotion,
            answers: userAnswers,
            questions: questions,
            overall_score: null,
            recommendations: [],
            completed_at: new Date().toISOString(),
          } satisfies Tables<'wellness_assessments'>['Insert']);

        if (error) throw error;

        toast.success("Your assessment has been saved!");
        navigate("/progress-tracker");
      } catch (err) {
        console.error(err);
        toast.error("Failed to save assessment. Please try again.");
      }
    }
  };

  if (!emotion || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Invalid emotion selected. Please go back.</p>
        <Button onClick={() => navigate("/share-feelings")}>Go Back</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 p-4 font-sans flex flex-col items-center">
      <header className="w-full max-w-2xl flex items-center justify-between py-4 px-2">
        <Link to="/share-feelings">
          <Button className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </header>
      <main className="flex flex-col items-center w-full p-2 md:p-6">
        <h1 className="text-3xl font-bold text-[#1E63F6] mb-6">Your Assessment</h1>
        <div className="text-lg text-gray-300 mb-4">You selected: {emotion}</div>

        <Card className="w-full max-w-2xl bg-transparent shadow-none">
          <CardContent>
            <form onSubmit={handleAssessmentSubmit}>
              <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-inner">
                <p className="text-lg font-semibold text-gray-100 mb-4">{currentQuestion.text}</p>
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 text-gray-200 cursor-pointer">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={index}
                        checked={userAnswers[currentQuestion.id] === index}
                        onChange={() => setUserAnswers({ ...userAnswers, [currentQuestion.id]: index })}
                        className="form-radio h-5 w-5 text-[#1E63F6] bg-gray-700 border-gray-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white">
                  {currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
