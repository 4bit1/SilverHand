import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn, t as Button } from "./button-CBm9KU00.mjs";
import { a as signOut, c as useSession, s as useMarketState } from "./store-DiiHrnzs.mjs";
import { d as Outlet, g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Bell, C as LogOut, D as Heart, b as MessageCircle, l as SendHorizontal, o as Sparkles, t as X, u as Search, x as Menu } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-D-gs9b2s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var suggestions = [
	"Write a product description",
	"Suggest a fair price",
	"Improve my profile bio",
	"What's trending this week?"
];
var canned = {
	"Write a product description": "Here's a draft: “Woven slowly on a pit loom, this cotton throw carries the small irregularities that only hands can leave. Undyed, breathable, and softer with every wash.” Want a shorter version for listings?",
	"Suggest a fair price": "Similar handwoven throws in your city list between ₹2,100 and ₹2,900. Given your 4.9 rating and nine-day weave time, I'd anchor at ₹2,400 with a festive bundle at ₹4,300.",
	"Improve my profile bio": "Try leading with your years of craft: “Thirty-eight years of cooking for family — now for my neighbourhood.” Specific numbers build trust faster than adjectives.",
	"What's trending this week?": "Homemade Food and Traditional Arts are up 18% in your area. Tutoring peaks in the next two weeks — a good moment to publish a short evening batch."
};
function AIAssistant() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([{
		from: "ai",
		text: "Hello, I'm Hansa — your SilverHands assistant. I can write descriptions, suggest pricing, or polish your profile. What shall we work on?"
	}]);
	function send(text) {
		if (!text.trim()) return;
		const reply = canned[text] ?? "Good question. Here's my suggestion: keep the listing title under nine words, lead with the material or method, and mention delivery time — listings that do this get about 30% more enquiries.";
		setMessages((m) => [
			...m,
			{
				from: "me",
				text
			},
			{
				from: "ai",
				text: reply
			}
		]);
		setInput("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "gold",
		size: "lg",
		onClick: () => setOpen((o) => !o),
		"aria-expanded": open,
		"aria-label": "Open the SilverHands AI assistant",
		className: "fixed bottom-6 right-5 z-50 shadow-lift md:bottom-8 md:right-8",
		children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: open ? "Close" : "Ask Hansa AI"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("surface fixed bottom-24 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden transition-all duration-300 md:right-8", open ? "pointer-events-auto opacity-100" : "pointer-events-none translate-y-3 opacity-0"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 border-b border-border bg-primary-soft px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 place-items-center rounded-full bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "size-5",
						"aria-hidden": true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Hansa AI"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Your listing & pricing companion"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex max-h-[45vh] flex-col gap-3 overflow-y-auto px-5 py-4",
				children: messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed", m.from === "ai" ? "bg-muted text-foreground" : "self-end bg-primary text-primary-foreground"),
					children: m.text
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 px-5 pb-3",
				children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => send(s),
					className: "rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent",
					children: s
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					send(input);
				},
				className: "flex items-center gap-2 border-t border-border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "hansa-input",
						className: "sr-only",
						children: "Message Hansa AI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "hansa-input",
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "Ask anything…",
						className: "h-11 flex-1 rounded-full bg-muted px-4 text-sm outline-none placeholder:text-muted-foreground"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						"aria-label": "Send message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendHorizontal, {})
					})
				]
			})
		]
	})] });
}
function AppShell({ nav, mode }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const session = useSession();
	const navigate = useNavigate();
	const { favorites } = useMarketState();
	function submitSearch(e) {
		e.preventDefault();
		navigate({
			to: "/buyer/services",
			search: query.trim() ? { q: query.trim() } : {}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-20 max-w-7xl items-center gap-6 px-5 lg:px-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex shrink-0 items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl font-semibold tracking-tight",
								children: "SilverHands"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden rounded-full bg-accent-soft px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-accent sm:inline",
								children: mode
							})]
						}),
						mode === "Buyer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submitSearch,
							className: "relative hidden flex-1 max-w-xs md:block",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "shell-search",
									className: "sr-only",
									children: "Search services and products"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									className: "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "shell-search",
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Search SilverHands",
									className: "h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							"aria-label": "Primary",
							className: "ml-auto hidden items-center gap-0.5 lg:flex",
							children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								activeOptions: { exact: item.to.split("/").length <= 2 },
								activeProps: { className: "bg-primary-soft text-primary" },
								className: "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
								children: item.label
							}, item.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1.5 lg:ml-0",
							children: [
								session && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									mode === "Buyer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "ghost",
										size: "icon",
										"aria-label": `Favorites${favorites.length ? ` (${favorites.length})` : ""}`,
										className: "relative hidden sm:inline-flex",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/buyer/favorites",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {}), favorites.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": true,
												className: "absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-accent text-[0.6rem] font-bold text-accent-foreground",
												children: favorites.length > 9 ? "9+" : favorites.length
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Notifications",
										className: "hidden sm:inline-flex",
										onClick: () => toast("You're all caught up — no new notifications."),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "ghost",
										size: "icon",
										"aria-label": "Messages",
										className: "hidden sm:inline-flex",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: mode === "Buyer" ? "/buyer/messages" : "/seller/messages",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {})
										})
									})
								] }),
								session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "ml-1 hidden sm:inline-flex",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: mode === "Buyer" ? "/seller" : "/buyer",
											children: ["Switch to ", mode === "Buyer" ? "selling" : "buying"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: mode === "Buyer" ? "/buyer/profile" : "/seller/profile",
										"aria-label": "Your profile",
										title: session.name,
										className: "ml-1 hidden size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground sm:inline-flex",
										children: session.name.trim().charAt(0).toUpperCase() || "?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Sign out",
										className: "hidden sm:inline-flex",
										onClick: () => {
											signOut();
											navigate({ to: "/" });
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {})
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									className: "hidden sm:inline-flex",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										search: { role: mode === "Buyer" ? "buyer" : "seller" },
										children: "Sign in"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "lg:hidden",
									"aria-label": "Toggle navigation",
									"aria-expanded": open,
									onClick: () => setOpen((o) => !o),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Mobile",
					className: cn("overflow-hidden border-t border-border transition-all duration-300 lg:hidden", open ? "max-h-[32rem]" : "max-h-0"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-7xl flex-col gap-1 px-5 py-3",
						children: [
							mode === "Buyer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: submitSearch,
								className: "relative mb-2 md:hidden",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "shell-search-mobile",
										className: "sr-only",
										children: "Search services and products"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										className: "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
										"aria-hidden": true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "shell-search-mobile",
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: "Search SilverHands",
										className: "h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground"
									})
								]
							}),
							nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								onClick: () => setOpen(false),
								activeOptions: { exact: item.to.split("/").length <= 2 },
								activeProps: { className: "bg-primary-soft text-primary" },
								className: "rounded-xl px-4 py-3.5 font-medium",
								children: item.label
							}, item.to)),
							!session && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { role: mode === "Buyer" ? "buyer" : "seller" },
								onClick: () => setOpen(false),
								className: "rounded-xl px-4 py-3.5 font-semibold text-primary",
								children: "Sign in"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				className: "mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border py-10 text-center text-sm text-muted-foreground",
				children: "SilverHands — turning a lifetime of skill into livelihood."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIAssistant, {})
		]
	});
}
//#endregion
export { AppShell as t };
