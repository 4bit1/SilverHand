import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * Market state (cart / favorites) — persisted to localStorage so a
 * page refresh mid-demo doesn't wipe the cart.
 * ------------------------------------------------------------------ */

type State = { favorites: string[]; cart: string[] };

const STORAGE_KEY = "silverhands.market";

function loadState(): State {
  if (typeof window === "undefined") return { favorites: [], cart: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { favorites: [], cart: [] };
    const parsed = JSON.parse(raw);
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
    };
  } catch {
    return { favorites: [], cart: [] };
  }
}

let state: State = loadState();
const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage unavailable (private browsing etc.) — state still works in-memory
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function toggleFavorite(id: string) {
  state.favorites = state.favorites.includes(id)
    ? state.favorites.filter((f) => f !== id)
    : [...state.favorites, id];
  emit();
}

export function addToCart(id: string) {
  state.cart = [...state.cart, id];
  emit();
}

export function removeFromCart(id: string) {
  const idx = state.cart.indexOf(id);
  if (idx === -1) return;
  state.cart = [...state.cart.slice(0, idx), ...state.cart.slice(idx + 1)];
  emit();
}

export function useMarketState(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => ({ favorites: [], cart: [] }),
  );
}

/* ------------------------------------------------------------------ *
 * Session — who's "logged in" and which role they're using SilverHands
 * as. This is a lightweight demo session, not real auth: any name is
 * accepted. It just needs to survive a refresh and gate the
 * first-time seller onboarding flow.
 * ------------------------------------------------------------------ */

export type Role = "buyer" | "seller";
export type Session = { name: string; role: Role; onboarded: boolean } | null;

const SESSION_KEY = "silverhands.session";

function loadSession(): Session {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

let session: Session = loadSession();
const sessionListeners = new Set<() => void>();

function emitSession() {
  if (typeof window !== "undefined") {
    try {
      if (session) {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore
    }
  }
  sessionListeners.forEach((l) => l());
}

export function signIn(name: string, role: Role) {
  session = { name: name.trim() || "Guest", role, onboarded: role === "buyer" };
  emitSession();
}

export function completeOnboarding() {
  if (!session) return;
  session = { ...session, onboarded: true };
  emitSession();
}

export function signOut() {
  session = null;
  emitSession();
}

export function useSession(): Session {
  return useSyncExternalStore(
    (l) => {
      sessionListeners.add(l);
      return () => sessionListeners.delete(l);
    },
    () => session,
    () => null,
  );
}

/**
 * Call before an action that needs an identity (favoriting, adding to cart,
 * booking, messaging). Returns true if signed in. If not, redirects to
 * /login (remembering where to return) and returns false — the caller
 * should bail out without performing the action.
 */
export function requireSession(navigate: (opts: { to: string; search?: Record<string, unknown> }) => void, redirectTo?: string): boolean {
  if (session) return true;
  if (redirectTo) {
    navigate({ to: "/login", search: { redirect: redirectTo } });
  } else {
    navigate({ to: "/login" });
  }
  return false;
}
