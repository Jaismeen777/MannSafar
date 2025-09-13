import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const NewSessionNoteForm: React.FC = () => {
  return (
    <form className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-name" className="text-right">
          Client
        </Label>
        <Input id="client-name" placeholder="Select a client..." className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="notes" className="text-right pt-2">
          Notes
        </Label>
        <Textarea id="notes" placeholder="Type your session notes here." className="col-span-3 min-h-[120px]" />
      </div>
      <Button type="submit" className="w-full mt-4">
        Save Note
      </Button>
    </form>
  );
};