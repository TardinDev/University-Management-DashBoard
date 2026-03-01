"use client";

import { useState } from "react";

import { CircleHelp, Shield, GraduationCap, BookOpen } from "lucide-react";

import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLink, useLogin, useRefineOptions } from "@refinedev/core";

export const SignInForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Link = useLink();

  const { title } = useRefineOptions();

  const { mutate: login } = useLogin();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({
      email,
      password,
    });
  };

  const quickLogin = (role: string) => {
    login({ role });
  };

  return (
    <div
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "px-6",
        "py-8",
        "min-h-svh"
      )}
    >
      <div className={cn("flex", "items-center", "justify-center")}>
        {title.icon && (
          <div
            className={cn("text-foreground", "[&>svg]:w-12", "[&>svg]:h-12")}
          >
            {title.icon}
          </div>
        )}
      </div>

      <Card className={cn("sm:w-[456px]", "p-12", "mt-6")}>
        <CardHeader className={cn("px-0")}>
          <CardTitle
            className={cn(
              "text-blue-600",
              "dark:text-blue-400",
              "text-3xl",
              "font-semibold"
            )}
          >
            Sign in
          </CardTitle>
          <CardDescription
            className={cn("text-muted-foreground", "font-medium")}
          >
            Welcome back
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className={cn("px-0")}>
          <form onSubmit={handleSignIn}>
            <div className={cn("flex", "flex-col", "gap-2")}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div
              className={cn("relative", "flex", "flex-col", "gap-2", "mt-6")}
            >
              <Label htmlFor="password">Password</Label>
              <InputPassword
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div
              className={cn(
                "flex items-center justify-between",
                "flex-wrap",
                "gap-2",
                "mt-4"
              )}
            >
              <div className={cn("flex items-center", "space-x-2")}>
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked === "indeterminate" ? false : checked)
                  }
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Link
                to="/forgot-password"
                className={cn(
                  "text-sm",
                  "flex",
                  "items-center",
                  "gap-2",
                  "text-primary hover:underline",
                  "text-blue-600",
                  "dark:text-blue-400"
                )}
              >
                <span>Forgot password</span>
                <CircleHelp className={cn("w-4", "h-4")} />
              </Link>
            </div>

            <Button type="submit" size="lg" className={cn("w-full", "mt-6")}>
              Sign in
            </Button>

            <div className={cn("flex", "items-center", "gap-4", "mt-6")}>
              <Separator className={cn("flex-1")} />
              <span className={cn("text-sm", "text-muted-foreground")}>Connexion rapide</span>
              <Separator className={cn("flex-1")} />
            </div>

            <div className={cn("grid", "grid-cols-3", "gap-3", "mt-6")}>
              <Button
                variant="outline"
                className={cn("flex", "flex-col", "items-center", "gap-1", "h-auto", "py-3", "border-red-200", "hover:bg-red-50", "dark:border-red-800", "dark:hover:bg-red-950")}
                onClick={() => quickLogin("ADMIN")}
                type="button"
              >
                <Shield className={cn("h-5", "w-5", "text-red-600", "dark:text-red-400")} />
                <span className={cn("text-xs", "font-medium")}>Admin</span>
              </Button>
              <Button
                variant="outline"
                className={cn("flex", "flex-col", "items-center", "gap-1", "h-auto", "py-3", "border-blue-200", "hover:bg-blue-50", "dark:border-blue-800", "dark:hover:bg-blue-950")}
                onClick={() => quickLogin("PROFESSOR")}
                type="button"
              >
                <GraduationCap className={cn("h-5", "w-5", "text-blue-600", "dark:text-blue-400")} />
                <span className={cn("text-xs", "font-medium")}>Professeur</span>
              </Button>
              <Button
                variant="outline"
                className={cn("flex", "flex-col", "items-center", "gap-1", "h-auto", "py-3", "border-green-200", "hover:bg-green-50", "dark:border-green-800", "dark:hover:bg-green-950")}
                onClick={() => quickLogin("STUDENT")}
                type="button"
              >
                <BookOpen className={cn("h-5", "w-5", "text-green-600", "dark:text-green-400")} />
                <span className={cn("text-xs", "font-medium")}>Étudiant</span>
              </Button>
            </div>
          </form>
        </CardContent>

        <Separator />

        <CardFooter>
          <div className={cn("w-full", "text-center text-sm")}>
            <span className={cn("text-sm", "text-muted-foreground")}>
              No account?{" "}
            </span>
            <Link
              to="/register"
              className={cn(
                "text-green-600",
                "dark:text-green-400",
                "font-semibold",
                "underline"
              )}
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

SignInForm.displayName = "SignInForm";
