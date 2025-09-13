import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target, TrendingDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend as ChartLegend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from 'chart.js';
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

ChartJS.register(
    ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, PointElement, LineElement
);

type MoodAssessment = Tables<'wellness_assessments'> & {
    emotion?: string;
    mainReason?: string;
};

const emotionColors: { [key: string]: string } = {
    'Happy': '#fb7185',
    'Lonely': '#60a5fa',
    'Angry': '#fbbf24',
    'Carefree': '#4ade80',
    'Demotivated': '#a78bfa',
    'Tensed': '#f472b6',
    'Curious': '#6366f1',
};

const emotionToScore: { [key: string]: number } = {
    'Happy': 5,
    'Carefree': 4,
    'Curious': 4,
    'Tensed': 2,
    'Lonely': 1,
    'Angry': 1,
    'Demotivated': 2,
};

const allQuestions: { [key: string]: { id: string, text: string, options: string[] }[] } = {
    Happy: [{ id: 'q1', text: 'Main reason for happiness?', options: ['Spending time with loved ones', 'Achieving a goal', 'Enjoying hobby', 'Something unexpected', 'Others'] }],
    Lonely: [{ id: 'q1', text: 'Main reason for loneliness?', options: ['Lack of conversations', 'Distance from loved ones', 'Feeling misunderstood', 'Not able to share feelings'] }],
    Angry: [{ id: 'q1', text: 'Main reason for anger?', options: ['Feeling disrespected', 'Unjust situation', 'Specific person', 'Feeling powerless'] }],
    Carefree: [{ id: 'q1', text: 'Main reason for carefree feeling?', options: ['Positive outcome', 'Feeling relaxed', 'Spontaneous day', 'Feeling in control'] }],
    Tensed: [{ id: 'q1', text: 'Main reason for tension?', options: ['Work pressure', 'Future worry', 'Overthinking', 'Physical discomfort'] }],
    Curious: [{ id: 'q1', text: 'Main reason for curiosity?', options: ['New idea', 'Discovering hobby', 'Learning', 'Intriguing person'] }],
    Demotivated: [{ id: 'q1', text: 'Main reason for demotivation?', options: ['Lack of progress', 'Overwhelmed', 'Boredom', 'Negative feedback'] }],
};

export function ProgressTracker() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [stats, setStats] = useState({
        averageMood: 0,
        streakDays: 0,
        journalEntries: 0,
        aiConversations: 0,
        assessments: 0,
        moodEntries: 0
    });
    const [moodData, setMoodData] = useState<any>({ datasets: [] });
    const [weeklyMoodData, setWeeklyMoodData] = useState<any>({ datasets: [] });
    const [mostSelectedMoods, setMostSelectedMoods] = useState<any[]>([]); // store weekly moods
    const [reasonsData, setReasonsData] = useState<any>({ datasets: [] });
    const [moodHeatmap, setMoodHeatmap] = useState<any[]>([]);
    const [moodSwingDetected, setMoodSwingDetected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchAllData();
        else setLoading(false);
    }, [user]);

    useEffect(() => {
        const handleJournalUpdate = () => {
            fetchAllData();
        };
        window.addEventListener('journal-updated', handleJournalUpdate);
        return () => window.removeEventListener('journal-updated', handleJournalUpdate);
    }, []);
const fetchAllData = async () => {
  if (!user) return setLoading(false);

  try {
    // Wellness Assessments
    const { data: moodAssessments, error: moodError } = await supabase
      .from("wellness_assessments")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: true });

    if (moodError) throw moodError;

    // AI Conversations
    const { count: aiCount, error: aiError } = await supabase
      .from("ai_conversations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (aiError) throw aiError;

    // Journal Entries
    const { count: journalCount, error: journalError } = await supabase
      .from("journal_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (journalError) throw journalError;

    // STREAK CALCULATION
    function formatLocalDate(date: Date) {
      return date.toLocaleDateString("en-CA");
    }

    // Collect unique days from wellness assessments
    const uniqueDays = new Set(
      moodAssessments.map((doc: any) =>
        formatLocalDate(new Date(doc.completed_at))
      )
    );

    // --- Streak Calculation ---
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (true) {
      const dateStr = formatLocalDate(today);
      if (uniqueDays.has(dateStr)) {
        streak++;
        today.setDate(today.getDate() - 1); 
      } else {
        break;
      }
    }
    // Update base stats
    setStats(prev => ({
      ...prev,
      journalEntries: journalCount || 0,
      aiConversations: aiCount || 0,
      moodEntries: moodAssessments?.length || 0,
      assessments: moodAssessments?.length || 0,
      streakDays: streak,
    }));

    // MAP assessments with emotion/reason
    const allAssessments: MoodAssessment[] =
      moodAssessments?.map(doc => {
        const emotion = doc.assessment_type || "Unknown";
        const mainReasonIndex = (doc.answers as any)?.q1;
        const mainReason =
          allQuestions[emotion]?.[0]?.options[mainReasonIndex] || "Other";
        return { ...doc, emotion, mainReason };
      }) || [];

    // DAILY TREND 
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const todaysEntries = allAssessments
      .filter(doc => {
        const entryDate = new Date(doc.completed_at);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === todayDate.getTime();
      })
      .sort(
        (a, b) =>
          new Date(a.completed_at).getTime() -
          new Date(b.completed_at).getTime()
      );

    setMoodData({
      labels: todaysEntries.map(doc =>
        new Date(doc.completed_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      ),
      datasets: [
        {
          label: "Today's Mood Score",
          data: todaysEntries.map(
            doc => emotionToScore[doc.emotion as string] || 3
          ),
          borderColor: "#1E63F6",
          backgroundColor: todaysEntries.map(
            doc => emotionColors[doc.emotion as string] || "#d4d4d4"
          ),
          pointBackgroundColor: todaysEntries.map(
            doc => emotionColors[doc.emotion as string] || "#d4d4d4"
          ),
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#1E63F6",
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          fill: false,
        },
      ],
    });

    // WEEKLY MOST SELECTED MOOD
    const weeklyMoods: { [date: string]: { [emotion: string]: number } } = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    allAssessments
      .filter(doc => new Date(doc.completed_at) >= sevenDaysAgo)
      .forEach(doc => {
        const date = new Date(doc.completed_at).toLocaleDateString();
        if (!weeklyMoods[date]) weeklyMoods[date] = {};
        const emotion = doc.emotion as string;
        weeklyMoods[date][emotion] =
          (weeklyMoods[date][emotion] || 0) + 1;
      });

    const weeklyLabels = Object.keys(weeklyMoods).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const weeklyMoodsList = weeklyLabels.map(date => {
      const emotionCounts = weeklyMoods[date];
      const mostSelectedEmotion = Object.keys(emotionCounts).reduce(
        (a, b) => (emotionCounts[a] > emotionCounts[b] ? a : b)
      );
      return {
        date,
        mood: mostSelectedEmotion,
        score: emotionToScore[mostSelectedEmotion] || 3,
        color: emotionColors[mostSelectedEmotion] || "#d4d4d4",
      };
    });

    setMostSelectedMoods(weeklyMoodsList);
    setWeeklyMoodData({
      labels: weeklyMoodsList.map(item => item.date),
      datasets: [
        {
          label: "Most Selected Mood",
          data: weeklyMoodsList.map(item => item.score),
          borderColor: "#4ade80",
          pointBackgroundColor: weeklyMoodsList.map(item => item.color),
          pointBorderColor: "#fff",
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.3,
          fill: false,
        },
      ],
    });

    // REASONS BREAKDOWN
    const reasonCounts: { [key: string]: number } = {};
    const reasonEmotionMap: { [key: string]: string } = {};
    allAssessments.slice(-20).forEach(doc => {
      const reason = doc.mainReason || "Other";
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      if (doc.emotion) reasonEmotionMap[reason] = doc.emotion;
    });
    setReasonsData({
      labels: Object.keys(reasonCounts),
      datasets: [
        {
          data: Object.values(reasonCounts),
          backgroundColor: Object.keys(reasonCounts).map(
            label =>
              emotionColors[reasonEmotionMap[label]] || "#d4d4d4"
          ),
          borderColor: "#1f2937",
          borderWidth: 1,
        },
      ],
    });

    // MONTHLY HEATMAP
    const dailyEmotionCounts: { [date: string]: { [emotion: string]: number } } =
      {};
    allAssessments.forEach(doc => {
      const date = new Date(doc.completed_at).toISOString().split("T")[0];
      if (!dailyEmotionCounts[date]) dailyEmotionCounts[date] = {};
      const emotion = doc.emotion as string;
      dailyEmotionCounts[date][emotion] =
        (dailyEmotionCounts[date][emotion] || 0) + 1;
    });

    const startOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    const endOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
    const heatmapArray = [];
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const emotionCountsForDay = dailyEmotionCounts[dateStr];
      const mostSelectedEmotion = emotionCountsForDay
        ? Object.keys(emotionCountsForDay).reduce((a, b) =>
            emotionCountsForDay[a] > emotionCountsForDay[b] ? a : b
          )
        : null;
      heatmapArray.push({
        day: d.getDate(),
        emotion: mostSelectedEmotion,
        color: mostSelectedEmotion
          ? emotionColors[mostSelectedEmotion]
          : "#262626",
      });
    }
    setMoodHeatmap(heatmapArray);

    // MOOD SWING DETECTION
    const latestScores = allAssessments
      .slice(-5)
      .map(doc => emotionToScore[doc.emotion as string] || 3);
    setMoodSwingDetected(
      latestScores.some(
        (score, i) =>
          i < latestScores.length - 1 &&
          Math.abs(score - latestScores[i + 1]) >= 3
      )
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};

    const handleFeatureComingSoon = () => {
        toast({
            title: "Feature coming soon!",
            description: "We're working on it. Stay tuned for updates.",
        });
    };

    const handleNavigateToGames = () => {
        navigate('/emotion-games');
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-primary">Progress Tracker</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12">
                        <BarChart3 className="h-16 w-16 text-accent mx-auto mb-6" />
                        <h1 className="text-4xl font-bold mb-4">Progress Tracker</h1>
                        <p className="text-xl text-muted-foreground">
                            Monitor your wellness journey with detailed analytics and insights.
                        </p>
                    </div>

                    {/* Mood Swing Alert */}
                    {moodSwingDetected && (
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-white shadow-xl mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center text-primary">
                                    <TrendingDown className="h-6 w-6 mr-2" />
                                    Sudden Mood Swing Detected
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">Your recent mood entries show a significant change. Here are some actions you can take:</p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Button onClick={handleFeatureComingSoon} className="w-full">
                                        Schedule with a Psychiatrist
                                    </Button>
                                    <Link to="/lovydubby">
                                      <Button
                                        size="lg"
                                        className="w-full"
                                      >
                                        Call LovyDubby
                                      </Button>
                                      </Link>
                                    <Button onClick={handleNavigateToGames} className="w-full">
                                        Play Emotion Games
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                                    Mood Entries
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold text-primary">{stats.moodEntries}</div>
                                        <p className="text-sm text-muted-foreground">Total assessments</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-accent" />
                                    Streak
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold text-accent">{stats.streakDays} days</div>
                                        <p className="text-sm text-muted-foreground">Daily check-ins</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Target className="h-5 w-5 mr-2 text-primary" />
                                    Goals Met
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary">85%</div>
                                <p className="text-sm text-muted-foreground">This month</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid lg:grid-cols-2 gap-8 mt-8">
                        {/* Daily Trend */}
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle>Daily Mood Trend</CardTitle>
                                <CardDescription>Your mood ratings for all entries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (<div className="h-64 flex items-center justify-center">Loading...</div>) : (
                                    <Line data={moodData} />
                                )}
                            </CardContent>
                        </Card>
                        
                        {/* Weekly Trend with moods */}
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle>Weekly Most Selected Mood Trend</CardTitle>
                                <CardDescription>Most frequent mood for each of the last 7 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-64 flex items-center justify-center">Loading...</div>
                                ) : (
                                    <>
                                        <Line 
                                            data={weeklyMoodData} 
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    tooltip: {
                                                        callbacks: {
                                                            label: (context) => {
                                                                const mood = mostSelectedMoods[context.dataIndex]?.mood || "N/A";
                                                                return `Mood: ${mood}`;
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />

                                        {/* Mood strip under chart */}
                                        <div className="mt-6 grid grid-cols-7 gap-2 text-center">
                                            {mostSelectedMoods.map((item, index) => (
                                                <div 
                                                    key={index}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div 
                                                        className="w-6 h-6 rounded-full mb-1"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="text-xs">{item.mood}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Reasons Breakdown */}
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Reasons Breakdown</CardTitle>
                                <CardDescription>Why you've felt a certain way recently.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                {loading ? (<div className="h-64 flex items-center justify-center">Loading...</div>) : (
                                    <div className="max-w-md mx-auto h-full">
                                        <Pie
                                            data={reasonsData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                cutout: '50%',
                                            }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Monthly Heatmap */}
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Monthly Mood Heatmap</CardTitle>
                                <CardDescription>Your primary emotion for each day.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-w-[500px] mx-auto grid grid-cols-7 gap-1 text-center">
                                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                                        <div key={day} className="text-sm font-semibold text-muted-foreground">{day}</div>
                                    ))}
                                    {moodHeatmap.map((item, index) => (
                                        <div
                                            key={index}
                                            className="w-12 h-12 rounded-md flex items-center justify-center text-xs font-bold transition-transform duration-200 hover:scale-105"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            {item.day}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    </div>

                    {/* Recent Activities */}
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mt-8">
                        <CardHeader>
                            <CardTitle>Recent Activities</CardTitle>
                            <CardDescription>Your wellness activities this week</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span>Journal Entries</span>
                                        <span className="text-primary font-semibold">{stats.journalEntries}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>AI Conversations</span>
                                        <span className="text-accent font-semibold">{stats.aiConversations}</span>
                                    </div>
                                     {/* <div className="flex items-center justify-between">
                                        <span>Wellness Assessments</span>
                                        <span className="text-primary font-semibold">{stats.assessments}</span>
                                    </div>  */}
                                    <div className="flex items-center justify-between">
                                        <span>Mood Check-ins</span>
                                        <span className="text-accent font-semibold">{stats.moodEntries}</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
            </main>
        </div>
    );
}
