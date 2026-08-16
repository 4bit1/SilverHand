import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChefHat,
  Scissors,
  BookOpen,
  Languages,
  Sprout,
  Baby,
  Palette,
  Hammer,
  Music2,
  Briefcase,
  Star,
  Mic,
  ArrowRight,
  ArrowUpRight,
  Check,
} from "lucide-react";

import heroPhoto from "@/assets/hero.jpg";
import { categoryImages } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  SilverHands — landing page                                        */
/*  React + Tailwind core utilities + lucide-react, wired into the     */
/*  app's real routing, fonts (see __root.tsx), and photography.       */
/* ------------------------------------------------------------------ */

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SilverHands — Turn a lifetime of skill into income" },
      {
        name: "description",
        content:
          "An AI-powered marketplace connecting senior citizens and homemakers with customers seeking trusted local services, handmade products, and mentorship.",
      },
      { property: "og:title", content: "SilverHands — Turn a lifetime of skill into income" },
      {
        property: "og:description",
        content:
          "Discover trusted local services and handmade goods, or offer your own skills on SilverHands.",
      },
    ],
  }),
  component: Landing,
});

/* -------------------------- utility hooks -------------------------- */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function useInView(options: IntersectionObserverInit = {}): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView();
  const style = reduced ? {} : { transitionDelay: `${delay}ms` };
  return (
    <Tag
      ref={ref}
      style={style}
      className={`${className} ${
        reduced
          ? ""
          : `transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`
      }`}
    >
      {children}
    </Tag>
  );
}

function useCountUp(target: number, inView: boolean, duration = 1400): number {
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let start: number | null = null;
    let frame: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration, reduced]);
  return value;
}

/* ---------------------------- photography ---------------------------- */
/* Real photography where the asset library has a match; falls back to a
   labeled placeholder tile for categories we don't have a shot for yet
   (currently: Language). */

function Photo({
  src,
  caption,
  aspect = "aspect-[4/5]",
  className = "",
}: {
  src?: string | undefined;
  caption: string;
  aspect?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${aspect} ${className}`}>
        <img src={src} alt={caption} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`relative overflow-hidden ${aspect} ${className}`}
      style={{ backgroundColor: "#E7E0C9" }}
    >
      <div
        className="absolute inset-0 flex items-end p-4"
        style={{
          background: "linear-gradient(160deg, rgba(107,122,62,0.18), rgba(201,140,58,0.14))",
        }}
      >
        <span className="text-xs uppercase tracking-[0.14em] font-medium" style={{ color: "#4A4630" }}>
          {caption}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------ page -------------------------------- */

function Landing() {
  const reduced = usePrefersReducedMotion();
  const [role, setRole] = useState<"buy" | "sell">("buy");
  const [statsRef, statsInView] = useInView({ threshold: 0.4 });

  const sellers = useCountUp(4200, statsInView);
  const customers = useCountUp(12500, statsInView);
  const orders = useCountUp(25000, statsInView);
  const cities = useCountUp(38, statsInView);

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "#FFFDF5", color: "#2F312B", fontFamily: "var(--font-sans)" }}
    >
      <style>{`
        .sh-focus:focus-visible {
          outline: 3px solid #C98C3A;
          outline-offset: 3px;
          border-radius: 2px;
        }
        @keyframes shSoundwave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .sh-bar { animation: shSoundwave 1.1s ease-in-out infinite; }
      `}</style>

      {/* ---------------------------- top bar ---------------------------- */}
      <header className="w-full">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 md:px-10 py-5">
          <span className="font-display text-xl font-semibold tracking-tight">SilverHands</span>
          <Link
            to="/login"
            className="sh-focus text-sm font-medium underline decoration-[#C98C3A] decoration-2 underline-offset-4"
            style={{ color: "#47531F" }}
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* ------------------------------ hero ------------------------------ */}
      <section className="relative w-full overflow-hidden" aria-label="Introduction">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-6 md:pt-10 pb-16 md:pb-24">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <p
                className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-5"
                style={{ color: "#C98C3A" }}
              >
                A livelihood marketplace, built on skill
              </p>
              <h1 className="font-display font-semibold leading-[0.98] text-[13vw] md:text-[5.4vw] lg:text-7xl">
                Turn a lifetime
                <br />
                of skill into{" "}
                <span className="italic font-medium" style={{ color: "#6B7A3E" }}>
                  income.
                </span>
              </h1>
              <p className="mt-7 text-lg md:text-xl leading-relaxed max-w-xl" style={{ color: "#4A4630" }}>
                Cooking. Tailoring. Tutoring. Craft passed down for generations. SilverHands
                helps senior citizens and homemakers across India get discovered, trusted, and
                paid — for what they already know how to do.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#entry"
                  className="sh-focus inline-flex items-center gap-2 px-7 py-4 rounded-full text-base font-semibold min-h-[44px]"
                  style={{ backgroundColor: "#47531F", color: "#FFFDF5" }}
                >
                  Start earning
                  <ArrowRight size={18} strokeWidth={2.2} />
                </a>
                <a
                  href="#categories"
                  className="sh-focus inline-flex items-center gap-2 px-7 py-4 rounded-full text-base font-semibold min-h-[44px] border-2"
                  style={{ borderColor: "#2F312B", color: "#2F312B" }}
                >
                  Explore skills
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <Photo
                src={heroPhoto}
                caption="An older woman preparing dough beside handmade linen keepsakes on a sunlit table"
                aspect="aspect-[4/5]"
                className="rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ proof ----------------------------- */}
      <section
        ref={statsRef}
        aria-label="Platform scale"
        className="w-full py-16 md:py-20"
        style={{ backgroundColor: "#47531F", color: "#FFFDF5" }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {(
              [
                { value: sellers, label: "sellers earning today", suffix: "+" },
                { value: customers, label: "customers who've booked", suffix: "+" },
                { value: orders, label: "orders completed", suffix: "+" },
                { value: cities, label: "cities and counting", suffix: "" },
              ] as const
            ).map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div>
                  <div className="font-display font-semibold text-4xl md:text-5xl">
                    {s.value.toLocaleString("en-IN")}
                    {s.suffix}
                  </div>
                  <p className="mt-2 text-sm md:text-base" style={{ color: "#D9DCC0" }}>
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- categories --------------------------- */}
      <section id="categories" className="w-full py-20 md:py-28" aria-label="What you can find">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <h2 className="font-display font-semibold text-3xl md:text-5xl max-w-2xl">
              Every skill has a home here.
            </h2>
            <p className="mt-4 text-lg max-w-xl" style={{ color: "#4A4630" }}>
              Ten categories, thousands of quiet experts — found by what they make, not by a
              resume.
            </p>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-12 gap-4 md:gap-5">
            {/* spotlight tile */}
            <Reveal className="md:col-span-7">
              <div className="relative rounded-sm overflow-hidden">
                <Photo
                  src={categoryImages.food}
                  caption="Homemade snacks and preserves, warm morning light"
                  aspect="aspect-[16/11]"
                />
                <div className="absolute bottom-5 left-5">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-display italic text-lg"
                    style={{ backgroundColor: "#FFFDF5", color: "#2F312B" }}
                  >
                    <ChefHat size={18} /> Home cooking
                  </span>
                </div>
              </div>
            </Reveal>

            {/* supporting tiles */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4 md:gap-5">
              {(
                [
                  { icon: Scissors, label: "Tailoring", caption: "Hands guiding fabric under a sewing machine", src: categoryImages.tailoring },
                  { icon: BookOpen, label: "Tutoring", caption: "A tutor and student at a table with an open notebook", src: categoryImages.tutoring },
                  { icon: Languages, label: "Language", caption: "Two people in easy conversation over tea", src: undefined },
                  { icon: Sprout, label: "Gardening", caption: "Soil-covered hands planting a seedling", src: categoryImages.garden },
                ] as const
              ).map((c, i) => (
                <Reveal key={c.label} delay={i * 80}>
                  <div className="relative rounded-sm overflow-hidden">
                    <Photo src={c.src} caption={c.caption} aspect="aspect-square" />
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{ backgroundColor: "#FFFDF5", color: "#2F312B" }}
                      >
                        <c.icon size={15} /> {c.label}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* remaining categories as a quiet inline row */}
          <Reveal delay={120}>
            <div className="mt-6 flex flex-wrap gap-3">
              {(
                [
                  { icon: Baby, label: "Childcare" },
                  { icon: Palette, label: "Traditional arts" },
                  { icon: Hammer, label: "Handicrafts" },
                  { icon: Music2, label: "Music" },
                  { icon: Briefcase, label: "Consulting" },
                ] as const
              ).map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border"
                  style={{ borderColor: "#D8CFAE", color: "#4A4630" }}
                >
                  <c.icon size={15} /> {c.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ story ------------------------------ */}
      <section
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: "#F6EFDD" }}
        aria-label="A seller's story"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          <Reveal className="md:col-span-5">
            <Photo
              src={categoryImages.craft}
              caption="Handmade snacks packaged for delivery, warm afternoon light"
              aspect="aspect-[4/5]"
              className="rounded-sm"
            />
          </Reveal>
          <Reveal delay={100} className="md:col-span-7">
            <p
              className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: "#C98C3A" }}
            >
              One seller, one Tuesday morning
            </p>
            <blockquote
              className="font-display italic font-medium text-2xl md:text-4xl leading-tight"
              style={{ color: "#2F312B" }}
            >
              "I used to just cook for my family. Now Hyderabad orders my murukku by the box."
            </blockquote>
            <p className="mt-6 text-lg leading-relaxed max-w-xl" style={{ color: "#4A4630" }}>
              Lakshmi Devi spent forty years cooking for her household. Today she runs a
              home-snacks business on SilverHands — earning roughly{" "}
              <strong style={{ color: "#2F312B" }}>₹15,000 a month</strong> from recipes she
              already knew by heart.
            </p>
            <div className="mt-7 flex items-center gap-4">
              <div className="flex items-center gap-1" aria-label="4.9 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < 5 ? "#C98C3A" : "none"} color="#C98C3A" />
                ))}
              </div>
              <span className="text-base font-semibold">4.9</span>
              <span className="text-base" style={{ color: "#4A4630" }}>
                from 214 reviews
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- how it works --------------------------- */}
      <section className="w-full py-20 md:py-28" aria-label="How it works">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <h2 className="font-display font-semibold text-3xl md:text-5xl max-w-2xl">
              From skill to customer, in four honest steps.
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-4 gap-8 md:gap-6">
            {/* step 1 */}
            <Reveal>
              <div className="text-xs uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: "#C98C3A" }}>
                Step one
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Speak, don't type</h3>
              <p className="text-base leading-relaxed" style={{ color: "#4A4630" }}>
                Say what you do, out loud, in your own words. No forms.
              </p>
            </Reveal>

            {/* step 2 — signature moment */}
            <Reveal delay={80} className="md:col-span-2">
              <div className="text-xs uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: "#C98C3A" }}>
                Step two — the SilverHands part
              </div>
              <h3 className="font-display text-xl font-semibold mb-4">AI writes your profile for you</h3>
              <div
                className="rounded-lg p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6"
                style={{ backgroundColor: "#FFFDF5", border: "1px solid #E4DCC0" }}
              >
                <div className="flex items-end gap-1 h-14 shrink-0" aria-hidden="true">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <span
                      key={i}
                      className={`w-1.5 rounded-full ${reduced ? "" : "sh-bar"}`}
                      style={{
                        height: `${18 + (i % 4) * 9}px`,
                        backgroundColor: "#6B7A3E",
                        animationDelay: `${i * 90}ms`,
                        transformOrigin: "bottom",
                      }}
                    />
                  ))}
                  <Mic size={20} className="ml-2" style={{ color: "#47531F" }} />
                </div>
                <ArrowRight size={20} className="shrink-0 hidden sm:block" style={{ color: "#C98C3A" }} />
                <div className="w-full rounded-md p-4" style={{ backgroundColor: "#F6EFDD" }}>
                  <p className="font-display italic text-base leading-snug" style={{ color: "#2F312B" }}>
                    "Home-style Andhra snacks, made fresh to order — 20 years of family
                    recipes."
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#6B7A3E" }}>
                    <Check size={13} /> Profile drafted
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm" style={{ color: "#4A4630" }}>
                A gentle first draft, ready to review and publish — never published without
                your okay.
              </p>
            </Reveal>

            {/* step 3 */}
            <Reveal delay={160}>
              <div className="text-xs uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: "#C98C3A" }}>
                Step three
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Get discovered</h3>
              <p className="text-base leading-relaxed" style={{ color: "#4A4630" }}>
                Nearby customers find you by what you offer.
              </p>
            </Reveal>
          </div>

          <Reveal delay={220}>
            <div className="mt-8 flex items-center gap-3 max-w-md">
              <div className="text-xs uppercase tracking-[0.14em] font-semibold" style={{ color: "#C98C3A" }}>
                Step four
              </div>
              <h3 className="font-display text-lg font-semibold">Connect, and get paid.</h3>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ entry ------------------------------ */}
      <section
        id="entry"
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: "#2F312B", color: "#FFFDF5" }}
        aria-label="Get started"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <h2 className="font-display font-semibold text-3xl md:text-5xl text-center max-w-2xl mx-auto">
              Which brings you here today?
            </h2>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <Reveal>
              <button
                type="button"
                onClick={() => setRole("buy")}
                aria-pressed={role === "buy"}
                className="sh-focus w-full text-left rounded-lg p-8 min-h-[44px] transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: role === "buy" ? "#6B7A3E" : "#3B3D34",
                  border: role === "buy" ? "2px solid #C98C3A" : "2px solid transparent",
                }}
              >
                <span className="text-xs uppercase tracking-[0.16em] font-semibold" style={{ color: "#E9E4C9" }}>
                  I'm looking for
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-semibold mt-2">
                  A trusted local expert
                </h3>
                <p className="mt-3 text-base" style={{ color: "#D9DCC0" }}>
                  Browse cooks, tutors, tailors and craftspeople near you.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                  I want to buy <ArrowUpRight size={16} />
                </span>
              </button>
            </Reveal>

            <Reveal delay={80}>
              <button
                type="button"
                onClick={() => setRole("sell")}
                aria-pressed={role === "sell"}
                className="sh-focus w-full text-left rounded-lg p-8 min-h-[44px] transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: role === "sell" ? "#C98C3A" : "#3B3D34",
                  border: role === "sell" ? "2px solid #FFFDF5" : "2px solid transparent",
                }}
              >
                <span className="text-xs uppercase tracking-[0.16em] font-semibold" style={{ color: "#F5E6CE" }}>
                  I have a skill to share
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-semibold mt-2">
                  My own customers
                </h3>
                <p className="mt-3 text-base" style={{ color: "#F1E3C9" }}>
                  Build a profile, set your own price, get discovered.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                  I want to sell <ArrowUpRight size={16} />
                </span>
              </button>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <div className="mt-10 text-center">
              <Link
                to="/login"
                search={{ role: role === "buy" ? "buyer" : "seller" }}
                className="sh-focus inline-flex items-center gap-2 px-9 py-4 rounded-full text-base font-semibold min-h-[44px]"
                style={{ backgroundColor: "#FFFDF5", color: "#2F312B" }}
              >
                Continue as {role === "buy" ? "a buyer" : "a seller"}
                <ArrowRight size={18} />
              </Link>
              <p className="mt-3 text-sm" style={{ color: "#B9B7A8" }}>
                Just your name to start — no password needed.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ close ------------------------------ */}
      <section className="w-full py-24 md:py-32 text-center" aria-label="Closing">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="font-display font-semibold text-4xl md:text-6xl leading-tight">
              Your skill has been waiting
              <br />
              for its{" "}
              <span className="italic" style={{ color: "#C98C3A" }}>
                customer.
              </span>
            </h2>
            <a
              href="#entry"
              className="sh-focus mt-9 inline-flex items-center gap-2 px-9 py-4 rounded-full text-base font-semibold min-h-[44px]"
              style={{ backgroundColor: "#47531F", color: "#FFFDF5" }}
            >
              Get started
              <ArrowRight size={18} />
            </a>
          </Reveal>
        </div>
      </section>

      <footer className="w-full py-8 border-t" style={{ borderColor: "#E4DCC0" }}>
        <div
          className="mx-auto max-w-7xl px-6 md:px-10 flex flex-wrap items-center justify-between gap-4 text-sm"
          style={{ color: "#7A7663" }}
        >
          <span>© 2026 SilverHands</span>
          <span>Made with respect, for every hand that built something.</span>
        </div>
      </footer>
    </div>
  );
}
