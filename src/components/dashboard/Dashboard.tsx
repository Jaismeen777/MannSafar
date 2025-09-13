import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';
import { LogOut, Heart, MessageCircle,ChevronDown, BookOpen, BarChart3, Play, Mail, Phone, MapPin, Users, Award, Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import wellnessQuizImage from '@assets/mental-wellness.png';
import aiCompanionImage from '@assets/ai-companion.png';
import personalJournalImage from '@assets/personal-journal.png';
import progressTrackerImage from '@assets/progress-tracker.png';
import emotionGamesImage from '@assets/emotion-games.png';


const quotes = [
  {
    text: "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.",
    author: "William James",
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama",
  },
  {
    text: "Do not anticipate trouble, or worry about what may never happen. Keep in the sunlight.",
    author: "Benjamin Franklin",
  },
  {
    text: "Turn your wounds into wisdom.",
    author: "Oprah Winfrey",
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
  },
  {
    text: "Out of difficulties grow miracles.",
    author: "Jean de La Bruyère",
  },
  {
    text: "Every day may not be good, but there’s something good in every day.",
    author: "Alice Morse Earle",
  },
];

const todayIndex = new Date().getDate() % quotes.length;
const todayQuote = quotes[todayIndex];




export function Dashboard() {
  const { user, signOut } = useAuth();

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border animate-fade-in">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary animate-pulse-slow">MannSafar</h1>
            <Link to="/profile">
              <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-300 hover:scale-110">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-muted-foreground">Come, Feel, Embrace and Grow!</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-4 animate-slide-in-right">
              <Link
                to="/lovydubby"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:scale-105 group"
              >
                <Heart className="h-4 w-4 text-primary group-hover:animate-pulse" />
                <span className="text-sm font-medium">LovyDubby</span>
              </Link>
              <Link
                to="/ai-companion"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent/10 transition-all duration-200 hover:scale-105 group"
              >
                <MessageCircle className="h-4 w-4 text-accent group-hover:animate-pulse" />
                <span className="text-sm font-medium">EmotionBot</span>
              </Link>
              <Link
                to="/personal-journal"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:scale-105 group"
              >
                <BookOpen className="h-4 w-4 text-primary group-hover:animate-pulse" />
                <span className="text-sm font-medium">Journal</span>
              </Link>

              <Link
                to="/emotion-games"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:scale-105 group"
              >
                <BookOpen className="h-4 w-4 text-primary group-hover:animate-pulse" />
                <span className="text-sm font-medium">Games</span>
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" onClick={signOut} size="sm" className="hover:scale-105 transition-transform duration-200">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-end bg-black">
<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
  <source src="/assets/Youthful_Serenity_in_Nature_Video.mp4" type="video/mp4" />
</video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

        <div className="relative z-10 w-full max-w-3xl pr-12 text-right space-y-6 animate-scale-in">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">
            MannSafar
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Discover personalized tools and insights to support your emotional well-being
          </p>
          <Link to="/share-feelings">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <Play className="h-5 w-5 mr-2" />
              Begin Your Journey
            </Button>
          </Link>
        </div>
      </section>


      <main className="pt-20">
        {/* Lovedubby Section */}
  <section className="relative min-h-screen flex items-center bg-card">
    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3">
          <Heart className="h-8 w-8 text-primary animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold">LovyDubby</h2>
        </div>
        <p className="text-xl text-muted-foreground">
          Real 3D model of a person integrated with human brain to respond as per
          the users' queries to provide realistic presence and natural interaction.
        </p>
        <Link to="/lovydubby">
  <Button
    size="lg"
    className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
  >
    Call LovyDubby
  </Button>
</Link>

      </div>
      <div className="relative animate-scale-in">
        <img
          src={wellnessQuizImage} 
          alt="Lovedubby"
          className="rounded-xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl"></div>
      </div>
    </div>
  </section>
        {/* AI Companion Section */}
        <section className="relative min-h-screen flex items-center bg-background">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1 animate-scale-in">
              <img
                src={aiCompanionImage}
                alt="AI Companion"
                className="rounded-xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl"></div>
            </div>
            <div className="space-y-6 order-1 md:order-2 animate-fade-in">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-8 w-8 text-accent animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-bold">AI Companion</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Chat with your empathetic AI companion anytime. Get support, guidance, and a listening ear whenever you
                need it most.
              </p>
              <Link to="/ai-companion">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
                >
                  Start Conversation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Personal Journal Section */}
        <section className="relative min-h-screen flex items-center bg-card">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-primary animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-bold">Personal Journal</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Express your thoughts, feelings, and experiences in a private, secure space. Track your emotional
                patterns and personal growth over time.
              </p>
              <Link to="/personal-journal">
                <Button size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200">
                  Write Entry
                </Button>
              </Link>
            </div>
            <div className="relative animate-scale-in">
              <img
                src={personalJournalImage}
                alt="Personal Journal"
                className="rounded-xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl"></div>
            </div>
          </div>
        </section>

        {/* Emotion Games Section */}
        <section className="relative min-h-screen flex items-center bg-background">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1 animate-scale-in">
              <img
                src={emotionGamesImage}
                alt="Emotion Games"
                className="rounded-xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl"></div>
            </div>
            <div className="space-y-6 order-1 md:order-2 animate-fade-in">
              <div className="flex items-center space-x-3">
                <Play className="h-8 w-8 text-accent animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-bold">Emotion Games</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Engage in fun and therapeutic games designed to help you identify, understand, and manage your emotions
                in a playful way.
              </p>
              <Link to="/emotion-games">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200">
                  Play Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Progress Tracker Section */}
        <section className="relative min-h-screen flex items-center bg-card">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-primary animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-bold">Progress Tracker</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Monitor your wellness journey with detailed analytics, mood trends, and personalized insights to help
                you understand your growth.
              </p>
              <Link to="/progress-tracker">
                <Button size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200">
                  View Progress
                </Button>
              </Link>
            </div>
            <div className="relative animate-scale-in">
              <img
                src={progressTrackerImage}
                alt="Progress Tracker"
                className="rounded-xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl"></div>
            </div>
          </div>
        </section>

        {/* Daily Inspiration Footer */}
        <section className="relative py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-6 text-center">
            <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-primary/20 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary animate-fade-in">
                  Daily Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 animate-fade-in">
                <blockquote className="text-xl italic text-foreground/80">
                  “{todayQuote.text}”
                </blockquote>
                <cite className="text-muted-foreground">— {todayQuote.author}</cite>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Company Information Section */}
        <section className="relative py-20 bg-card">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold mb-6 text-primary">About MannSafar</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Leading the future of mental wellness with AI-powered tools and compassionate care
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-background/50 backdrop-blur-sm border-primary/20 text-center animate-scale-in">
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse-slow" />
                  <CardTitle>10M+ Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Trusted by millions worldwide for their mental wellness journey
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/50 backdrop-blur-sm border-primary/20 text-center animate-scale-in">
                <CardHeader>
                  <Award className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse-slow" />
                  <CardTitle>Award Winning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Recognized by leading healthcare organizations for innovation
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/50 backdrop-blur-sm border-primary/20 text-center animate-scale-in">
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse-slow" />
                  <CardTitle>Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your data is protected with enterprise-grade security and privacy
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-3xl font-bold">Our Mission</h3>
                <p className="text-lg text-muted-foreground">
                  At MannSafar, we believe everyone deserves access to quality mental health support. Our AI-powered
                  platform combines cutting-edge technology with evidence-based therapeutic approaches to provide
                  personalized wellness solutions that fit into your daily life.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-slow"></div>
                    <span>24/7 AI companion support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse-slow"></div>
                    <span>Evidence-based wellness assessments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-slow"></div>
                    <span>Personalized progress tracking</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 animate-fade-in">
                <h3 className="text-3xl font-bold">Contact Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary animate-pulse" />
                    <span>support@mannsafar.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary animate-pulse" />
                    <span>+91 9642178956</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary animate-pulse" />
                    <span>New Delhi, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}