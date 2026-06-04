import { Link } from "@tanstack/react-router";
import { ShoppingCart, Menu, X, Shield, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useIsAdmin } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";
import { brand } from "@/lib/brand";
import logo from "@/assets/aston-electronics-logo.svg";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const { session, isAdmin } = useIsAdmin();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-3 font-display text-lg font-bold"
          aria-label={`${brand.name} home`}
        >
          <img src={logo} alt={brand.name} className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-accent"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden h-10 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 md:inline-flex"
            >
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
          {session ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
              }}
              className="hidden h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-secondary md:inline-flex"
              title={session.user.email ?? ""}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="hidden h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-secondary md:inline-flex"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
          )}
          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent/10"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                <Shield className="h-4 w-4" /> Admin dashboard
              </Link>
            )}
            {session ? (
              <button
                onClick={async () => {
                  setOpen(false);
                  await supabase.auth.signOut();
                }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
