import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, Tags, ShoppingBag, LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: `Admin - ${brand.name}` }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

function AdminLayout() {
  const { session, isAdmin, loading } = useIsAdmin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="grid place-items-center py-24 text-sm text-muted-foreground">Checking access…</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-accent" />
          <h1 className="mt-4 font-display text-2xl font-bold">Sign in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please sign in with an admin account to access this area.</p>
          <Button asChild variant="hero" className="mt-6"><Link to="/auth">Sign in</Link></Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 font-display text-2xl font-bold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({session.user.email}) doesn't have admin access. Ask the site owner to grant you the admin role.
          </p>
          <Button asChild variant="outline" className="mt-6"><Link to="/">Back home</Link></Button>
        </div>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-secondary/30">
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr] md:px-6 md:py-8">
        <aside className="rounded-xl border border-border bg-card p-3">
          <div className="px-2 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</div>
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive(n.to, n.exact)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-secondary"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            ))}
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
