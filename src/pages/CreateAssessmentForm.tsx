import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CreateAssessmentForm: React.FC = () => {
  return (
    <form className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-name" className="text-right">
          Client
        </Label>
        <Input id="client-name" placeholder="Select a client..." className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="assessment-type" className="text-right">
          Assessment
        </Label>
        <Select>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gad-7">GAD-7 (Anxiety)</SelectItem>
            <SelectItem value="phq-9">PHQ-9 (Depression)</SelectItem>
            <SelectItem value="custom">Custom Assessment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full mt-4">
        Start Assessment
      </Button>
    </form>
  );
};