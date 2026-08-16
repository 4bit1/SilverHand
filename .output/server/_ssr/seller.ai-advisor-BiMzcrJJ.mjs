import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { c as useSession } from "./store-DiiHrnzs.mjs";
import { A as Eye, F as Check, M as Copy, S as MapPin, T as IndianRupee, c as Send, f as RefreshCcw, i as Star, m as PanelLeftClose, o as Sparkles, p as PanelLeft, r as TrendingUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.ai-advisor-BiMzcrJJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUGGESTED_PROMPTS = [
	"How can I increase my profit this month?",
	"Which listing should I promote?",
	"What should I price a new listing at?",
	"What's a good next step for my shop this week?"
];
var CONTEXT_STATS = [
	{
		icon: IndianRupee,
		label: "Total earnings",
		value: "₹1,84,500"
	},
	{
		icon: TrendingUp,
		label: "Orders received",
		value: "126"
	},
	{
		icon: Eye,
		label: "Profile views",
		value: "3,482"
	},
	{
		icon: Star,
		label: "Customer rating",
		value: "4.9 (214 reviews)"
	}
];
function nowLabel() {
	return (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
		hour: "numeric",
		minute: "2-digit"
	});
}
function TypingIndicator() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-1.5 px-4 py-3",
		"aria-label": "Hansa AI is typing",
		role: "status",
		children: [
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "size-1.5 animate-pulse rounded-full bg-muted-foreground",
			style: { animationDelay: `${i * 160}ms` }
		}, i))
	});
}
function MessageBubble({ message, onCopy, copied, onRegenerate, canRegenerate }) {
	if (message.role === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-end",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-[15px] leading-relaxed text-primary-foreground sm:max-w-[65%]",
			children: message.text
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
				size: 15,
				"aria-hidden": true
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-[85%] sm:max-w-[75%]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3.5 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[15px] leading-relaxed whitespace-pre-wrap",
						children: message.text
					}),
					message.insights && message.insights.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: message.insights.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full border border-border bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary",
							children: [
								stat.label,
								": ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: stat.value })
							]
						}, stat.label))
					}),
					message.recommendations && message.recommendations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-2.5",
						children: message.recommendations.map((recommendation, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2.5 text-sm leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" }), recommendation]
						}, i))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 flex items-center gap-1 pl-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-2 text-xs text-muted-foreground",
						children: message.timestamp
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onCopy(message),
						"aria-label": "Copy response",
						className: "rounded-full p-1.5 text-muted-foreground hover:bg-muted",
						children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 13 })
					}),
					canRegenerate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onRegenerate(message),
						"aria-label": "Regenerate response",
						className: "rounded-full p-1.5 text-muted-foreground hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { size: 13 })
					})
				]
			})]
		})]
	});
}
function AIAdvisor() {
	const session = useSession();
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(true);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [thinking, setThinking] = (0, import_react.useState)(false);
	const [openingError, setOpeningError] = (0, import_react.useState)(null);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const scrollRef = (0, import_react.useRef)(null);
	const seller = session?.name ? { name: session.name } : {};
	const stats = {
		revenue: 184500,
		orders: 126,
		views: 3482,
		topCategory: "Handmade Food"
	};
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, thinking]);
	async function callAdvisor(userMessage, history) {
		const res = await fetch("/api/advisor-chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				seller,
				stats,
				message: userMessage,
				history
			})
		});
		if (!res.ok) throw new Error("Advisor request failed");
		const data = await res.json();
		if (typeof data?.text !== "string") throw new Error("Advisor response malformed");
		return data;
	}
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setThinking(true);
		callAdvisor(void 0, []).then((reply) => {
			if (cancelled) return;
			setMessages([{
				id: "m1",
				role: "assistant",
				timestamp: nowLabel(),
				text: reply.text,
				...reply.insights ? { insights: reply.insights } : {},
				...reply.recommendations ? { recommendations: reply.recommendations } : {}
			}]);
		}).catch(() => {
			if (!cancelled) setOpeningError("Advisor is temporarily unavailable.");
		}).finally(() => {
			if (!cancelled) setThinking(false);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const sendMessage = (text) => {
		const trimmed = text.trim();
		if (!trimmed || thinking) return;
		const history = messages.map((m) => ({
			role: m.role,
			text: m.text
		}));
		const userMsg = {
			id: `u${Date.now()}`,
			role: "user",
			text: trimmed,
			timestamp: nowLabel()
		};
		setMessages((previous) => [...previous, userMsg]);
		setInput("");
		setThinking(true);
		callAdvisor(trimmed, history).then((reply) => {
			setMessages((previous) => [...previous, {
				id: `a${Date.now()}`,
				role: "assistant",
				timestamp: nowLabel(),
				text: reply.text,
				...reply.insights ? { insights: reply.insights } : {},
				...reply.recommendations ? { recommendations: reply.recommendations } : {}
			}]);
		}).catch(() => {
			setMessages((previous) => [...previous, {
				id: `a${Date.now()}`,
				role: "assistant",
				timestamp: nowLabel(),
				text: "I couldn't reach the advisor just now — please try that again in a moment."
			}]);
		}).finally(() => setThinking(false));
	};
	const handleCopy = (message) => {
		const plain = [message.text, ...message.recommendations ?? []].join("\n");
		navigator.clipboard?.writeText(plain);
		setCopiedId(message.id);
		window.setTimeout(() => setCopiedId(null), 1500);
	};
	const handleRegenerate = (message) => {
		const idx = messages.findIndex((m) => m.id === message.id);
		const history = messages.slice(0, idx).map((m) => ({
			role: m.role,
			text: m.text
		}));
		const precedingUser = [...messages.slice(0, idx)].reverse().find((m) => m.role === "user");
		setMessages((previous) => previous.filter((item) => item.id !== message.id));
		setThinking(true);
		callAdvisor(precedingUser?.text, history).then((reply) => {
			setMessages((previous) => [...previous, {
				id: `${message.id}-r`,
				role: "assistant",
				timestamp: nowLabel(),
				text: reply.text,
				...reply.insights ? { insights: reply.insights } : {},
				...reply.recommendations ? { recommendations: reply.recommendations } : {}
			}]);
		}).catch(() => {
			setMessages((previous) => [...previous, {
				...message,
				id: `${message.id}-r`,
				timestamp: nowLabel()
			}]);
		}).finally(() => setThinking(false));
	};
	const handleKeyDown = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			sendMessage(input);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "-mx-5 -my-10 flex min-h-[calc(100vh-5rem)] flex-col bg-background lg:-mx-10 lg:-my-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1",
			children: [sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-72 shrink-0 flex-col border-r border-border bg-sidebar md:flex",
				"aria-label": "Advisor context",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto border-t border-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground",
							children: "What Hansa AI is looking at"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [CONTEXT_STATS.map((stat) => {
								const Icon = stat.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											size: 13,
											"aria-hidden": true
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: stat.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold",
											children: stat.value
										})]
									})]
								}, stat.label);
							}), seller.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										size: 13,
										"aria-hidden": true
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: "Seller"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: seller.name
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground",
							children: "Conversations aren't saved between visits in this demo."
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-3 border-b border-border px-6 py-3 md:px-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSidebarOpen((open) => !open),
							"aria-label": sidebarOpen ? "Hide sidebar" : "Show sidebar",
							className: "hidden rounded-full p-2 hover:bg-muted md:inline-flex",
							children: sidebarOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { size: 17 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { size: 17 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-lg font-semibold leading-tight",
							children: "Hansa AI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Advice grounded in your shop's own numbers"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scrollRef,
						className: "min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-10",
						"aria-live": "polite",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto flex max-w-3xl flex-col gap-6",
							children: [
								messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, {
									message,
									onCopy: handleCopy,
									copied: copiedId === message.id,
									onRegenerate: handleRegenerate,
									canRegenerate: message.id !== "m1"
								}, message.id)),
								openingError && messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl bg-secondary px-4 py-3 text-sm",
									role: "alert",
									children: openingError
								}),
								thinking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
											size: 15,
											"aria-hidden": true
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-2xl rounded-tl-sm border border-border bg-card shadow-soft",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypingIndicator, {})
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0 px-6 pb-6 pt-2 md:px-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-3xl",
							children: [
								messages.length <= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 flex flex-wrap gap-2",
									children: SUGGESTED_PROMPTS.map((prompt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => sendMessage(prompt),
										className: "min-h-10 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted",
										children: prompt
									}, prompt))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-end gap-2 rounded-2xl border border-border bg-card p-2 pl-4 shadow-soft",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "advisor-input",
											className: "sr-only",
											children: "Ask Hansa AI about your shop"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											id: "advisor-input",
											value: input,
											onChange: (event) => setInput(event.target.value),
											onKeyDown: handleKeyDown,
											rows: 1,
											placeholder: "Ask about pricing, promotion, or what's working…",
											className: "max-h-32 flex-1 resize-none bg-transparent py-2.5 text-[15px] outline-none placeholder:text-muted-foreground"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => sendMessage(input),
											disabled: !input.trim() || thinking,
											"aria-label": "Send message",
											className: "grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
												size: 16,
												"aria-hidden": true
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-center text-xs text-muted-foreground",
									children: "Hansa AI uses your shop's data to advise — it doesn't post, price, or message buyers without you."
								})
							]
						})
					})
				]
			})]
		})
	});
}
//#endregion
export { AIAdvisor as component };
