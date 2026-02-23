"use client"
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";

interface DropdownItem {
  label: string;
  description?: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  {label: "Home", href: "/"},
  {label: "Pricing", href: "/"},

];

const Header = () => {
  const { user, isSignedIn } = useUser();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="mb-3">
          <nav
      className={cn(
        "fixed z-50 min-h-[var(--nav-height)] transition-all duration-300",
        "shadow-lg",
        "top-4 left-6 right-6 md:left-8 md:right-8 rounded-xl max-w-5xl mx-auto",
        !mobileOpen && "h-[var(--nav-height)] overflow-hidden",
        mobileOpen && "overflow-visible bg-background",
        !mobileOpen && (scrolled ? "bg-background/60 backdrop-blur-xl" : "bg-background")
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 min-h-[var(--nav-height)] relative z-20",
          mobileOpen && "bg-background rounded-t-xl shadow-lg"
        )}
      >
        {/* Logo */}
        <a href="/" className="flex h-full max-h-full items-center font-semibold text-foreground py-1 shrink-0">
          <Image
            src="/cut.png"
            alt="Kiwi"
            width={160}
            height={45}
            // className="h-9 max-h-full w-auto object-contain object-center"
            priority
            draggable={false}
            unoptimized
          />
        </a>

        {/* Desktop nav */}
        <div ref={dropdownRef} className="hidden md:flex items-center gap-1">
          {navItems.map((item) =>
            item.dropdown ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "text-secondary-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      openDropdown === item.label && "rotate-180"
                    )}
                  />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-border bg-popover p-2 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150">
                    {item.dropdown.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-accent"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="text-sm font-medium text-foreground">{sub.label}</div>
                        {sub.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">{sub.description}</div>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-secondary"
              >
                {item.label}
              </a>
            )
          )}
        </div>

        {/* Right side */}
        {!isSignedIn ? <SignInButton mode="modal"><div className="flex items-center gap-2">
          <a
            href="#get-started"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
          </a>
        </div></SignInButton> : <UserButton/>}

        {/* Mobile toggle */}
        {/* <div className="flex md:hidden items-center shrink-0">
          <button
            className="p-2.5 -m-2.5 text-foreground hover:bg-accent/50 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6 stroke-[2.5]" /> : <Menu className="h-6 w-6 stroke-[2.5]" />}
          </button>
        </div> */}
      </div>

      {/* Mobile menu */}
      {/* {mobileOpen && (
        <div className="md:hidden absolute z-10 top-[var(--nav-height)] left-0 right-0 bg-background border-b border-x border-border rounded-b-xl shadow-lg animate-in slide-in-from-top-2 duration-200 overflow-visible">
          <div className="p-4 pt-5">
            <div className="flex flex-col gap-1">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobileSubOpen(mobileSubOpen === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-secondary-foreground hover:text-foreground"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          mobileSubOpen === item.label && "rotate-180"
                        )}
                      />
                    </button>
                    {mobileSubOpen === item.label && (
                      <div className="ml-3 space-y-0.5 border-l-2 border-border pl-3 mb-1">
                        {item.dropdown.map((sub) => (
                          <a
                            key={sub.label}
                            href={sub.href}
                            className="block rounded-md px-3 py-2 text-sm text-secondary-foreground transition-colors hover:text-secondary"
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={item.label}
                    href={item.href ?? "#"}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
            {!user ?             <div className="pt-3 border-t border-border mt-3 flex flex-col gap-2">
              <a
                href="#get-started"
                className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground text-center"
              >
                Get started
              </a>
            </div> : <UserButton/>}
          </div>
        </div>
      )} */}
    </nav>
    </div>
  );
};

export default Header;
