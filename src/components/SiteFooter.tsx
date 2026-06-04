import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Instagram, Facebook, Music2 } from "lucide-react";
import { brand } from "@/lib/brand";
import logo from "@/assets/aston-electronics-logo.svg";

const SOCIALS = [
  { href: brand.social.instagram, label: "Instagram", icon: Instagram },
  { href: brand.social.tiktok, label: "TikTok", icon: Music2 },
  { href: brand.social.facebook, label: "Facebook", icon: Facebook },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="rounded-lg bg-background p-1">
              <img src={logo} alt={brand.name} className="h-10 w-auto" />
            </span>
          </div>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Genuine electronics and mobile accessories from {brand.location}. Fast delivery, fair
            prices.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${brand.name} on ${social.label}`}
                className="grid h-9 w-9 place-items-center rounded-lg border border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li>
              <Link to="/shop" className="hover:text-accent">
                All products
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "cases" }} className="hover:text-accent">
                Phone cases
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "chargers" }} className="hover:text-accent">
                Chargers
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "audio" }} className="hover:text-accent">
                Audio
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li>
              <Link to="/about" className="hover:text-accent">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-accent">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-accent">
                Returns Policy
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-accent">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Reach us</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" /> {brand.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" /> {brand.email}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" /> {brand.location}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
