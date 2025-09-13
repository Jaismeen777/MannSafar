import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    Calendar, 
    FileText, 
    TrendingUp, 
    Brain, 
    Clock, 
    Settings, 
    UserCircle, 
    LogOut,
    Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddNewClientForm } from "@/pages/AddNewClientForm"; 
import { NewSessionNoteForm } from "@/pages/NewSessionNoteForm";
import { CreateAssessmentForm } from "@/pages/CreateAssessmentForm"; 

const getInitials = (email) => {
  return email ? email.split('@')[0].slice(0, 2).toUpperCase() : 'U';
};

export function TherapistDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon for your wellness journey!",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      title: 'Client Management',
      description: 'View and manage your client list and appointments',
      icon: Users,
      path: '/clients',
      color: 'text-purple-400 bg-purple-400/10'
    },
    {
      title: 'Session Notes',
      description: 'Access and update therapy session documentation',
      icon: FileText,
      path: '/notes',
      color: 'text-teal-400 bg-teal-400/10'
    },
    {
      title: 'Progress Analytics',
      description: 'Review client progress and wellness trends',
      icon: TrendingUp,
      path: '/analytics',
      color: 'text-orange-400 bg-orange-400/10'
    },
    {
      title: 'Assessment Tools',
      description: 'Access professional assessment and evaluation tools',
      icon: Brain,
      path: '/assessments',
      color: 'text-pink-400 bg-pink-400/10'
    }
  ];

  const todayStats = [
    { label: 'Scheduled Sessions', value: '8', icon: Calendar },
    { label: 'Active Clients', value: '24', icon: Users },
    { label: 'Pending Notes', value: '3', icon: FileText },
    { label: 'Avg Session', value: '45min', icon: Clock }
  ];

  const upcomingSessions = [
    { time: '09:00 AM', client: 'Sarah M.', type: 'Individual Therapy', status: 'confirmed' },
    { time: '10:30 AM', client: 'Michael R.', type: 'Family Session', status: 'confirmed' },
    { time: '02:00 PM', client: 'Emma L.', type: 'Assessment', status: 'pending' },
    { time: '03:30 PM', client: 'David K.', type: 'Follow-up', status: 'confirmed' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">MannSafar</h1>
            <Link to="/profile">
                <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user?.email)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">{user?.user_metadata?.display_name || user?.email?.split('@')[0]}</span>
                        <span className="text-xs text-muted-foreground">Come, Feel, Embrace and Grow!</span>
                    </div>
                </div>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/settings">
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative h-screen flex items-end justify-center bg-black overflow-hidden pb-20 md:pb-32">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/assets/Indian_Youth_Therapy_in_Nature.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 w-full max-w-5xl px-4 text-center space-y-6 animate-scale-in">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">
            Therapist Dashboard
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Manage your practice and support your clients' wellness journeys
          </p>
          <Link to="/clients" className="block mt-8">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <Play className="h-5 w-5 mr-2" />
              Manage Your Clients
            </Button>
          </Link>
        </div>
      </section>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {todayStats.map((stat, index) => (
            <Card key={index} className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 shadow-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-semibold text-primary">{session.time}</div>
                    <div>
                      <p className="font-medium text-lg">{session.client}</p>
                      <p className="text-sm text-muted-foreground">{session.type}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    session.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {session.status}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6" variant="outline">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 shadow-lg animate-slide-up" style={{ animationDelay: '700ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* New Session Note Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    New Session Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>New Session Note</DialogTitle>
                    <DialogDescription>
                      Select a client and add your session notes below.
                    </DialogDescription>
                  </DialogHeader>
                  <NewSessionNoteForm />
                </DialogContent>
              </Dialog>

              {/* Add New Client Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Add New Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new client. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <AddNewClientForm />
                </DialogContent>
              </Dialog>

              {/* Create Assessment Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <Brain className="h-4 w-4 mr-2" />
                    Create Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Assessment</DialogTitle>
                    <DialogDescription>
                      Select a client and an assessment type to begin.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateAssessmentForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}