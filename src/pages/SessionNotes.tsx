import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SessionNotes: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        
        <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-start md:items-center space-x-4">
              <div className="p-4 rounded-xl bg-teal-400/10">
                 <FileText className="h-7 w-7 text-teal-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Session Notes</CardTitle>
                <CardDescription>Access and update therapy session documentation.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <p>A list of client session notes and a text editor for creating new notes will go here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};