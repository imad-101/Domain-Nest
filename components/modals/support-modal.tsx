"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupportContactForm } from "@/components/forms/support-contact-form";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Support</DialogTitle>
          <DialogDescription>
            Contact support for help with your domain management.
          </DialogDescription>
        </DialogHeader>
        <SupportContactForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
