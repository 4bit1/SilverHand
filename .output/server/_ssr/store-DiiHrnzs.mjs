import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DiiHrnzs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var STORAGE_KEY = "silverhands.market";
function loadState() {
	if (typeof window === "undefined") return {
		favorites: [],
		cart: []
	};
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return {
			favorites: [],
			cart: []
		};
		const parsed = JSON.parse(raw);
		return {
			favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
			cart: Array.isArray(parsed.cart) ? parsed.cart : []
		};
	} catch {
		return {
			favorites: [],
			cart: []
		};
	}
}
var state = loadState();
var listeners = /* @__PURE__ */ new Set();
function emit() {
	state = { ...state };
	if (typeof window !== "undefined") try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {}
	listeners.forEach((l) => l());
}
function subscribe(l) {
	listeners.add(l);
	return () => listeners.delete(l);
}
function toggleFavorite(id) {
	state.favorites = state.favorites.includes(id) ? state.favorites.filter((f) => f !== id) : [...state.favorites, id];
	emit();
}
function addToCart(id) {
	state.cart = [...state.cart, id];
	emit();
}
function useMarketState() {
	return (0, import_react.useSyncExternalStore)(subscribe, () => state, () => ({
		favorites: [],
		cart: []
	}));
}
var SESSION_KEY = "silverhands.session";
function loadSession() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(SESSION_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
var session = loadSession();
var sessionListeners = /* @__PURE__ */ new Set();
function emitSession() {
	if (typeof window !== "undefined") try {
		if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		else window.localStorage.removeItem(SESSION_KEY);
	} catch {}
	sessionListeners.forEach((l) => l());
}
function signIn(name, role) {
	session = {
		name: name.trim() || "Guest",
		role,
		onboarded: role === "buyer"
	};
	emitSession();
}
function completeOnboarding() {
	if (!session) return;
	session = {
		...session,
		onboarded: true
	};
	emitSession();
}
function signOut() {
	session = null;
	emitSession();
}
function useSession() {
	return (0, import_react.useSyncExternalStore)((l) => {
		sessionListeners.add(l);
		return () => sessionListeners.delete(l);
	}, () => session, () => null);
}
/**
* Call before an action that needs an identity (favoriting, adding to cart,
* booking, messaging). Returns true if signed in. If not, redirects to
* /login (remembering where to return) and returns false — the caller
* should bail out without performing the action.
*/
function requireSession(navigate, redirectTo) {
	if (session) return true;
	if (redirectTo) navigate({
		to: "/login",
		search: { redirect: redirectTo }
	});
	else navigate({ to: "/login" });
	return false;
}
//#endregion
export { signOut as a, useSession as c, signIn as i, completeOnboarding as n, toggleFavorite as o, requireSession as r, useMarketState as s, addToCart as t };
