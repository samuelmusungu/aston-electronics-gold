import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

const PASSWORD_REQUIREMENTS = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: `Sign in - ${brand.name}` }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const redirectUrl =
    import.meta.env.VITE_SITE_URL ||
    (isLocalhost ? window.location.origin : brand.website || window.location.origin);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!PASSWORD_REQUIREMENTS.test(password)) {
          toast.error(
            "Password must be at least 8 characters and include a letter, number, and symbol.",
          );
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${redirectUrl.replace(/\/$/, "")}/`,
            data: { full_name: name, phone },
          },
        });
        if (error) throw error;

        if (data.user && data.user.identities?.length === 0) {
          toast.error("An account with this email already exists. Please sign in instead.");
          setMode("signin");
          return;
        }

        toast.success("Account created! Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/" });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-md px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-2xl font-bold">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to track your orders."
              : `Join ${brand.name} to track orders and save addresses.`}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium">Full name</label>
                <input
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium">Phone number</label>
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  placeholder="+254 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                required
                type="password"
                minLength={8}
                pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}"
                title="Use at least 8 characters with a letter, number, and symbol."
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              {mode === "signup" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Use at least 8 characters with a letter, number, and symbol.
                </p>
              )}
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="font-semibold text-accent hover:underline"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="font-semibold text-accent hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
          <div className="mt-2 text-center text-xs text-muted-foreground">
            <Link to="/checkout" className="hover:text-accent">
              Or check out as guest →
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
