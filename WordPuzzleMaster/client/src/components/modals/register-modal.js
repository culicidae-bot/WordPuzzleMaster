var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
// import { apiRequest } from "@/lib/queryClient";
// Using direct fetch for debugging
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Extend the schema with password confirmation
const registerSchema = insertUserSchema.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
export function RegisterModal({ open, onClose, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    });
    function onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            setIsLoading(true);
            try {
                const { username, password } = values;
                // Using direct fetch to troubleshoot the registration process
                const response = yield fetch("/api/users/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });
                // Check if the request was successful
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || "Registration failed");
                }
                toast({
                    title: "Registration successful!",
                    description: "Your account has been created.",
                });
                onSuccess();
            }
            catch (error) {
                console.error("Registration error:", error);
                toast({
                    title: "Registration failed",
                    description: error instanceof Error ? error.message : "Unknown error occurred",
                    variant: "destructive",
                });
            }
            finally {
                setIsLoading(false);
            }
        });
    }
    return (<Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">Create Account</DialogTitle>
          <DialogDescription className="text-center text-slate-300">
            Register to save your progress and compete on leaderboards
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField control={form.control} name="username" render={({ field }) => (<FormItem>
                  <FormLabel className="text-white">Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-slate-700 border-slate-600 text-white" placeholder="Enter a unique username" disabled={isLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <FormField control={form.control} name="password" render={({ field }) => (<FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="bg-slate-700 border-slate-600 text-white" placeholder="Choose a secure password" disabled={isLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem>
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="bg-slate-700 border-slate-600 text-white" placeholder="Confirm your password" disabled={isLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <DialogFooter>
              <Button type="submit" disabled={isLoading} style={{
            backgroundColor: "hsl(210, 100%, 60%)",
            color: "white",
            fontWeight: "bold"
        }} className="w-full">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>);
}
