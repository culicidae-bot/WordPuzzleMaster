import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Extend the schema with password confirmation
const registerSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = {
  username: string;
  password: string;
  confirmPassword: string;
};

export function RegisterModal({
  open,
  onClose,
  onSuccess,
}: RegisterModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Use explicit type for form values to avoid deep instantiation error
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema as any), // Use 'as any' to avoid type recursion
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const { username, password } = values;

      // Using direct fetch to troubleshoot the registration process
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });

      onSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white border-slate-700 relative">
        <div className="flex flex-row items-center justify-between gap-4">
          {/* Left Logo (ISU) */}
          <div className="hidden md:flex items-center justify-center w-20 h-20">
            <img
              src="/attached_assets/isu-logo.png"
              alt="ISU Logo"
              className="logo-glow border-4 border-green-600 shadow-green-400"
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          {/* Main Register Form */}
          <div className="flex-1">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-2">
                Create Account
              </DialogTitle>
              <DialogDescription className="text-center text-slate-300">
                Register to save your progress and compete on leaderboards
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter a unique username"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Choose a secure password"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Confirm your password"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      backgroundColor: "hsl(210, 100%, 60%)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                    className="w-full"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
          {/* Right Logo (ICT) */}
          <div className="hidden md:flex items-center justify-center w-20 h-20">
            <img
              src="/attached_assets/ict-logo.png"
              alt="ICT Logo"
              className="logo-glow border-4 border-yellow-400 shadow-yellow-300"
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}