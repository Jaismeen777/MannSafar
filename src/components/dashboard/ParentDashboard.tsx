import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    AlertCircle, 
    TrendingUp, 
    MessageSquare, 
    Calendar, 
    BookOpen,
    Settings,
    UserCircle,
    LogOut,
    Play,
    Info 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ParentDashboard() {
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

  const getDisplayName = (user) => {
    const displayName = user?.user_metadata?.display_name;
    if (displayName && displayName.trim() !== '') {
      return displayName;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getAvatarUrl = (user) => {
    return user?.user_metadata?.avatar_url || null;
  };

  const getInitials = (user) => {
    const displayName = user?.user_metadata?.display_name;
    if (displayName && displayName.trim() !== '') {
      return displayName.slice(0, 2).toUpperCase();
    } else if (user?.email) {
      return user.email.split('@')[0].slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const insights = [
    {
      title: 'Child Wellness Overview',
      description: "Monitor your child's emotional and academic progress",
      icon: TrendingUp,
      action: 'View Reports',
      color: 'text-purple-400 bg-purple-400/10',
      path: '/child-reports'
    },
    {
      title: 'Communication Hub',
      description: "Messages and updates from your child's wellness journey",
      icon: MessageSquare,
      action: 'View Messages',
      color: 'text-teal-400 bg-teal-400/10',
      path: '/messages'
    },
    {
      title: 'Family Resources',
      description: 'Tools and guides for supporting your child',
      icon: BookOpen,
      action: 'Explore Resources',
      color: 'text-orange-400 bg-orange-400/10',
      path: '/family-resources'
    }
  ];

  const alerts = [
    {
      type: 'info',
      message: 'Your child completed their wellness assessment today',
      time: '2 hours ago',
      color: 'bg-blue-500/10 border-blue-500'
    },
    {
      type: 'warning',
      message: 'Mood tracking shows increased stress this week',
      time: '1 day ago',
      color: 'bg-yellow-500/10 border-yellow-500'
    }
  ];

  const childStats = [
    { label: 'Current Mood', value: 'Good', trend: '+5%', color: 'text-green-500' },
    { label: 'Weekly Score', value: '78%', trend: '+12%', color: 'text-green-500' },
    { label: 'Study Hours', value: '24h', trend: '-2h', color: 'text-red-500' },
    { label: 'Social Activity', value: 'Active', trend: 'stable', color: 'text-gray-500' }
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
                  {getAvatarUrl(user) ? (
                    <AvatarImage src={getAvatarUrl(user)} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-sm">{getDisplayName(user)}</span>
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
          <source src="/assets/Indian_Family_Nature_Video_Generation.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 w-full max-w-4xl px-4 text-center space-y-6 animate-scale-in">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">
            Parent Dashboard
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Track and support your child's emotional wellness journey
          </p>
          <Link to="/child-reports" className="block mt-8">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <Play className="h-5 w-5 mr-2" />
              View Child's Reports
            </Button>
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 pt-12">
        {/* Child Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {childStats.map((stat, index) => (
            <Card key={index} className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${stat.color} ${
                      stat.trend.includes('+') ? 'bg-green-500/20' :
                      stat.trend.includes('-') ? 'bg-red-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts & Notifications */}
        <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 shadow-lg animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <span className="text-lg font-semibold">Recent Updates</span>
              </CardTitle>
              <Link to="/all-updates">
                <Button variant="ghost" size="icon" aria-label="View all updates">
                  <Info className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-xl border-l-4 ${alert.color}`}>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((feature, index) => (
            <Card 
              key={index}
              onClick={() => navigate(feature.path)}
              className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${index * 150}ms` }}
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
              <CardContent className="mt-2">
                <Button className="w-full text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors" tabIndex={-1}>
                  {feature.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Child's Weekly Summary */}
        <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 shadow-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">This Week's Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Academic Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Your child has been maintaining good study habits with consistent focus periods. 
                  Math and Science scores have improved by 15% this week.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Emotional Wellness</h4>
                <p className="text-sm text-muted-foreground">
                  Overall mood has been positive with occasional stress related to upcoming exams. 
                  Recommended to encourage relaxation activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}