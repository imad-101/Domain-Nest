"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icons } from "@/components/shared/icons";

const domainSchema = z.object({
  domainName: z
    .string()
    .min(1, "Domain name is required")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/, "Please enter a valid domain name (e.g., example.com)"),
});

type DomainFormData = z.infer<typeof domainSchema>;

interface DomainFormProps {
  onDomainAdded: () => void;
}

export function DomainForm({ onDomainAdded }: DomainFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<DomainFormData>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domainName: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/domains/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to add domain");
        }

        const result = await response.json();
        toast.success(result.message || "Domain added successfully!");
        reset();
        setOpen(false);
        onDomainAdded(); // Trigger refresh of domains table
      } catch (error) {
        toast.error("Failed to add domain", {
          description: "Please try again later.",
        });
      }
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="premium-hover pulse-glow shadow-lg">
          <Icons.add className="mr-2 size-4" />
          Add Domain
        </Button>
      </DialogTrigger>
      <DialogContent className="premium-card luxury-shadow sm:max-w-[500px]">
        <DialogHeader className="pb-4 text-center">
          <DialogTitle className="premium-text-gradient text-2xl font-bold">
            Add New Domain
          </DialogTitle>
          <DialogDescription className="text-base font-medium">
            Add a domain to your portfolio for management and monitoring.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="domainName" className="text-base font-semibold">Domain Name</Label>
            <Input
              id="domainName"
              placeholder="example.com"
              className="premium-card h-12 border-2 text-base focus:border-secondary focus:ring-secondary/20"
              {...register("domainName")}
            />
            {errors?.domainName && (
              <p className="text-sm font-medium text-red-500">
                {errors.domainName.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="px-6">
              Cancel
            </Button>
            <Button type="submit" variant="secondary" disabled={isPending} className="premium-hover px-6">
              {isPending ? (
                <>
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Icons.add className="mr-2 size-4" />
                  Add Domain
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 