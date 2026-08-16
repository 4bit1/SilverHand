import { supabase } from "@/integrations/supabase/client";

/** A person in the expert directory (Cloud table `experts`). */
export interface ExpertService {
  id: string;
  name: string;
  description: string;
  skill: string;
  price: string;
  availability: string;
}

export interface ExpertTutorial {
  id: string;
  title: string;
  description: string;
  learnings: string[];
  durationMin: number;
  difficulty: string;
  priceCents: number;
  thumbnailUrl?: string;
}

export interface Expert {
  id: string;
  name: string;
  initials: string;
  age: number | null;
  city: string;
  primarySkill: string;
  skills: string[];
  experienceYears: number;
  experienceNote: string;
  languages: string[];
  verified: boolean;
  bio: string;
  priceCents: number;
  availabilityNote: string;
  rating: number | null;
  reviewsCount: number;
  services: ExpertService[];
  tutorials: ExpertTutorial[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toExpert(row: any): Expert {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    age: row.age ?? null,
    city: row.city,
    primarySkill: row.primary_skill,
    skills: row.skills ?? [],
    experienceYears: row.experience_years ?? 0,
    experienceNote: row.experience_note ?? "",
    languages: row.languages ?? [],
    verified: !!row.verified,
    bio: row.bio ?? "",
    priceCents: row.price_cents ?? 0,
    availabilityNote: row.availability_note ?? "",
    rating: row.rating === null || row.rating === undefined ? null : Number(row.rating),
    reviewsCount: row.reviews_count ?? 0,
    services: (row.services ?? []) as ExpertService[],
    tutorials: (row.tutorials ?? []) as ExpertTutorial[],
  };
}

const COLUMNS =
  "id, name, initials, age, city, primary_skill, skills, experience_years, experience_note, languages, verified, bio, price_cents, availability_note, rating, reviews_count, services, tutorials";

export async function fetchExperts(): Promise<Expert[]> {
  const { data, error } = await supabase.from("experts").select(COLUMNS).limit(200);
  if (error) throw error;
  return (data ?? []).map(toExpert);
}

export async function fetchExpert(id: string): Promise<Expert | null> {
  const { data, error } = await supabase.from("experts").select(COLUMNS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toExpert(data) : null;
}

/* ---------- need matching ---------- */

const STOPWORDS = new Set([
  "i", "a", "an", "the", "to", "for", "of", "in", "on", "with", "want", "need", "would",
  "like", "learn", "learning", "help", "me", "my", "someone", "some", "person", "people",
  "experienced", "experience", "teach", "teaching", "how", "and", "or", "is", "am", "get",
  "guide", "guidance", "basic", "basics", "from", "at", "who", "can", "please", "about",
]);

function tokenize(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/** Light stem so "gardening" matches "garden" and "cooking" matches "cook". */
function stem(t: string) {
  return t.replace(/(ing|ers|er|es|s)$/, "");
}

function hits(haystack: string, token: string) {
  return haystack.includes(token) || haystack.includes(stem(token));
}

export interface ScoredExpert {
  expert: Expert;
  score: number;
  matched: string[];
}

/**
 * Rank experts against a buyer's described need using the profile fields we
 * actually store. No AI — plain keyword relevance over expertise, skills,
 * biography, experience and location.
 */
export function rankExperts(experts: Expert[], query: string): ScoredExpert[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return experts
      .map((expert) => ({ expert, score: 0, matched: [] as string[] }))
      .sort(
        (a, b) =>
          (b.expert.rating ?? 0) - (a.expert.rating ?? 0) ||
          b.expert.experienceYears - a.expert.experienceYears,
      );
  }

  const scored = experts.map((expert) => {
    const primary = expert.primarySkill.toLowerCase();
    const skills = expert.skills.map((s) => s.toLowerCase());
    const text = [expert.bio, expert.experienceNote, expert.services.map((s) => `${s.name} ${s.description} ${s.skill}`).join(" "), expert.tutorials.map((t) => `${t.title} ${t.description}`).join(" ")]
      .join(" ")
      .toLowerCase();
    const city = expert.city.toLowerCase();

    let score = 0;
    const matched: string[] = [];
    for (const token of tokens) {
      let best = 0;
      if (hits(primary, token)) best = Math.max(best, 10);
      for (const s of skills) if (hits(s, token)) best = Math.max(best, 7);
      if (hits(text, token)) best = Math.max(best, 3);
      if (hits(city, token)) best = Math.max(best, 2);
      if (best > 0) {
        score += best;
        matched.push(token);
      }
    }
    if (score > 0) {
      score += Math.min(expert.experienceYears, 50) / 25; // experience nudge
      score += (expert.rating ?? 0) / 5;
    }
    return { expert, score, matched };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.expert.experienceYears - a.expert.experienceYears);
}
