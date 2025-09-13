import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, BookOpen, Save, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function PersonalJournal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodRating, setMoodRating] = useState(5);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          mood_rating: moodRating
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry saved successfully"
      });

      setTitle('');
      setContent('');
      setMoodRating(5);
      fetchEntries();
      window.dispatchEvent(new Event('journal-updated')); 
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Personal Journal</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Journal Entries List */}
          <div className="lg:col-span-1">
            <div className="text-center mb-6">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Your Entries</h2>
            </div>
            
            <Button className="w-full mb-4">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : entries.length > 0 ? (
                entries.map((entry) => (
                  <Card key={entry.id} className="cursor-pointer hover:bg-accent/10 transition-colors">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-foreground/80">
                        {entry.content.substring(0, 100)}...
                      </p>
                      {entry.mood_rating && (
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">
                            Mood: {entry.mood_rating}/10
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No journal entries yet. Start writing your first entry!
                </p>
              )}
            </div>
          </div>

          {/* Journal Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Write Your Thoughts</CardTitle>
                <CardDescription>Express yourself in a private, secure space</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title..."
                  className="text-lg"
                />
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Mood Rating (1-10): {moodRating}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={moodRating}
                    onChange={(e) => setMoodRating(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="How are you feeling today? What's on your mind?"
                  className="min-h-[300px] resize-none"
                />
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    {content.length} characters
                  </p>
                  <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}