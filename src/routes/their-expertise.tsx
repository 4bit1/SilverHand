import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { BadgeCheck, MapPin, Search, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpcomingSessions } from "@/components/elderskill/UpcomingSessions";
import { fetchExperts, rankExperts, type Expert } from "@/lib/elderskill/experts";
import { useDB } from "@/lib/elderskill/store";

export const Route = createFileRoute("/their-expertise")({
  head: () => ({
    meta: [
      { title: "Find an expert — ElderSkill" },
      {
        name: "description",
        content:
          "Describe what you would like to learn and find experienced people who can teach you — filter by price, place, age and experience.",
      },
      { property: "og:title", content: "Find an expert — ElderSkill" },
      {
        property: "og:description",
        content: "Describe what you want to learn and meet experienced people who can teach you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TheirExpertise,
});

const ANY = "any";

function money(cents: number) {
  return cents === 0 ? "Free" : `$${(cents / 100).toFixed(0)} / session`;
}

function TheirExpertise() {
  const db = useDB();

  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(ANY);
  const [skill, setSkill] = useState(ANY);
  const [price, setPrice] = useState(ANY);
  const [age, setAge] = useState(ANY);
  const [experience, setExperience] = useState(ANY);
  const [sort, setSort] = useState("relevance");

  const { data: experts = [], isLoading, error } = useQuery({
    queryKey: ["experts"],
    queryFn: fetchExperts,
    staleTime: 5 * 60_000,
  });

  const cities = useMemo(
    () => Array.from(new Set(experts.map((e) => e.city))).sort(),
    [experts],
  );
  const skills = useMemo(
    () => Array.from(new Set(experts.flatMap((e) => [e.primarySkill, ...e.skills]))).sort(),
    [experts],
  );

  const ranked = useMemo(() => rankExperts(experts, query), [experts, query]);

  const results = useMemo(() => {
    let list = ranked.filter(({ expert: e }) => {
      if (city !== ANY && e.city !== city) return false;
      if (skill !== ANY && ![e.primarySkill, ...e.skills].includes(skill)) return false;
      if (price === "under1000" && e.priceCents >= 1000) return false;
      if (price === "1000to2500" && (e.priceCents < 1000 || e.priceCents > 2500)) return false;
      if (price === "over2500" && e.priceCents <= 2500) return false;
      if (age !== ANY) {
        if (e.age === null) return false;
        const [min, max] = age.split("-").map(Number);
        if (e.age < (min ?? 0) || e.age > (max ?? 200)) return false;
      }
      if (experience === "1to5" && e.experienceYears > 5) return false;
      if (experience === "5to10" && (e.experienceYears < 5 || e.experienceYears > 10)) return false;
      if (experience === "10plus" && e.experienceYears < 10) return false;
      return true;
    });

    if (sort === "priceAsc") list = [...list].sort((a, b) => a.expert.priceCents - b.expert.priceCents);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.expert.priceCents - a.expert.priceCents);
    if (sort === "experience")
      list = [...list].sort((a, b) => b.expert.experienceYears - a.expert.experienceYears);
    return list;
  }, [ranked, city, skill, price, age, experience, sort]);

  const filtersActive =
    city !== ANY || skill !== ANY || price !== ANY || age !== ANY || experience !== ANY || sort !== "relevance";

  function clearFilters() {
    setCity(ANY);
    setSkill(ANY);
    setPrice(ANY);
    setAge(ANY);
    setExperience(ANY);
    setSort("relevance");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold sm:text-5xl">Find someone who knows</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Tell us what you would like to learn or get help with. We will show you experienced
          people whose skills match your need.
        </p>
      </header>

      {/* Need search */}
      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(draft.trim());
        }}
        role="search"
      >
        <label htmlFor="need" className="sr-only">
          What would you like to learn or get help with?
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="need"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What would you like to learn or get help with?"
            className="h-14 pl-12 text-base"
          />
        </div>
        <Button type="submit" className="h-14 px-8 text-base">
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <FilterSelect label="Expertise" value={skill} onChange={setSkill} anyLabel="Any expertise"
          options={skills.map((s) => ({ value: s, label: s }))} />
        <FilterSelect label="Location" value={city} onChange={setCity} anyLabel="Any location"
          options={cities.map((c) => ({ value: c, label: c }))} />
        <FilterSelect label="Price" value={price} onChange={setPrice} anyLabel="Any price"
          options={[
            { value: "under1000", label: "Under $10 / session" },
            { value: "1000to2500", label: "$10 – $25 / session" },
            { value: "over2500", label: "Over $25 / session" },
          ]} />
        <FilterSelect label="Age" value={age} onChange={setAge} anyLabel="Any age"
          options={[
            { value: "18-30", label: "18 – 30" },
            { value: "31-45", label: "31 – 45" },
            { value: "46-60", label: "46 – 60" },
            { value: "61-200", label: "61 and above" },
          ]} />
        <FilterSelect label="Experience" value={experience} onChange={setExperience} anyLabel="Any experience"
          options={[
            { value: "1to5", label: "1 – 5 years" },
            { value: "5to10", label: "5 – 10 years" },
            { value: "10plus", label: "10+ years" },
          ]} />
        <FilterSelect label="Sort by" value={sort} onChange={setSort} anyLabel="Relevance" anyValue="relevance"
          options={[
            { value: "priceAsc", label: "Price: low to high" },
            { value: "priceDesc", label: "Price: high to low" },
            { value: "experience", label: "Most experience" },
          ]} />
      </div>

      {/* Result summary */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg" aria-live="polite">
          {isLoading
            ? "Looking for experts…"
            : `${results.length} ${results.length === 1 ? "expert" : "experts"} found`}
          {query && !isLoading && (
            <span className="text-muted-foreground"> for “{query}”</span>
          )}
        </p>
        {filtersActive && (
          <Button variant="ghost" className="h-11 text-base" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-6 text-lg">
          We could not load the expert directory. Please try again.
        </p>
      )}

      {!isLoading && !error && results.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-card/60 p-8">
          <p className="text-xl font-semibold">No experts found for this combination.</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-lg text-muted-foreground">
            <li>Try removing the location, price or age filter to discover more experts.</li>
            <li>Describe your need more broadly — “cooking” instead of a specific dish.</li>
            <li>Try a related word, such as “gardening” instead of “terrace plants”.</li>
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ expert, score }, i) => (
            <li key={expert.id}>
              <ExpertCard
                expert={expert}
                label={query && score > 0 ? (i === 0 ? "Best match" : i < 3 ? "Recommended for your need" : null) : null}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-16">
        <UpcomingSessions bookings={db.bookings} />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  anyLabel,
  anyValue = ANY,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  anyLabel: string;
  anyValue?: string;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 w-full text-base" aria-label={label}>
          <SelectValue placeholder={anyLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={anyValue}>{anyLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ExpertCard({
  expert,
  label,
}: {
  expert: Expert;
  label: string | null;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-secondary font-serif text-xl font-semibold text-primary">
          {expert.initials}
        </div>
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-2 font-serif text-xl font-semibold">
            {expert.name}
            {expert.verified && <BadgeCheck className="size-5 text-primary" aria-label="Verified" />}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-base text-muted-foreground">
            <MapPin className="size-4" aria-hidden />
            {expert.age ? `${expert.age} · ` : ""}
            {expert.city}
          </p>
        </div>
      </div>

      <p className="mt-4 text-lg font-medium">{expert.primarySkill}</p>
      <p className="mt-1 text-base text-muted-foreground">
        {expert.skills.slice(0, 3).join(" · ")}
      </p>
      <p className="mt-3 line-clamp-3 text-base text-muted-foreground">{expert.bio}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary">{expert.experienceYears} years experience</Badge>
        <Badge variant="secondary">{money(expert.priceCents)}</Badge>
        {expert.availabilityNote && <Badge variant="secondary">{expert.availabilityNote}</Badge>}
      </div>

      {expert.rating !== null && (
        <p className="mt-3 flex items-center gap-1.5 text-base text-muted-foreground">
          <Star className="size-4 fill-primary text-primary" aria-hidden />
          {expert.rating.toFixed(1)} · {expert.reviewsCount} reviews
        </p>
      )}

      {label && (
        <p className="mt-4 rounded-md bg-secondary px-3 py-2 text-base font-medium text-foreground">
          {label}
        </p>
      )}

      <Button className="mt-5 h-12 w-full text-base" asChild>
        <Link to="/expert/$expertId" params={{ expertId: expert.id }}>
          View profile
        </Link>
      </Button>
    </article>
  );
}
