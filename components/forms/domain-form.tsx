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
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Icons.add className="mr-2 size-4" />
          Add Domain
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Domain</DialogTitle>
          <DialogDescription>
            Add a domain to your portfolio for management and monitoring.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domainName">Domain Name</Label>
            <Input
              id="domainName"
              placeholder="example.com"
              {...register("domainName")}
            />
            {errors?.domainName && (
              <p className="text-sm text-red-600">
                {errors.domainName.message}
              </p>
            )}
          </div>



          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Domain"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 