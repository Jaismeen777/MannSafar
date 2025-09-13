import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AddNewClientForm: React.FC = () => {
  return (
    <form className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Full Name
        </Label>
        <Input id="name" placeholder="Jane Doe" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input id="email" type="email" placeholder="jane.doe@example.com" className="col-span-3" />
      </div>
      <Button type="submit" className="w-full mt-4">
        Save Client
      </Button>
    </form>
  );
};