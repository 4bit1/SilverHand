import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Check, H as ArrowUpRight, O as Hammer, P as ChefHat, R as Briefcase, U as ArrowRight, V as Baby, _ as Music2, a as Sprout, d as Scissors, h as Palette, i as Star, v as Mic, w as Languages, z as BookOpen } from "../_libs/lucide-react.mjs";
import { s as categoryImages } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CDMSfol-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_default = "/assets/hero-BnJgWzhm.jpg";
function usePrefersReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const handler = (e) => setReduced(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);
	return reduced;
}
function useInView(options = {}) {
	const ref = (0, import_react.useRef)(null);
	const [inView, setInView] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				setInView(true);
				observer.disconnect();
			}
		}, {
			threshold: .2,
			...options
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return [ref, inView];
}
function Reveal({ children, as: Tag = "div", delay = 0, className = "" }) {
	const reduced = usePrefersReducedMotion();
	const [ref, inView] = useInView();
	const style = reduced ? {} : { transitionDelay: `${delay}ms` };
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		style,
		className: `${className} ${reduced ? "" : `transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}`,
		children
	});
}
function useCountUp(target, inView, duration = 1400) {
	const [value, setValue] = (0, import_react.useState)(0);
	const reduced = usePrefersReducedMotion();
	(0, import_react.useEffect)(() => {
		if (!inView) return;
		if (reduced) {
			setValue(target);
			return;
		}
		let start = null;
		let frame;
		const step = (ts) => {
			if (start === null) start = ts;
			const progress = Math.min((ts - start) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setValue(Math.floor(eased * target));
			if (progress < 1) frame = requestAnimationFrame(step);
		};
		frame = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frame);
	}, [
		inView,
		target,
		duration,
		reduced
	]);
	return value;
}
function Photo({ src, caption, aspect = "aspect-[4/5]", className = "" }) {
	if (src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative overflow-hidden ${aspect} ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: caption,
			loading: "lazy",
			className: "h-full w-full object-cover"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative overflow-hidden ${aspect} ${className}`,
		style: { backgroundColor: "#E7E0C9" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 flex items-end p-4",
			style: { background: "linear-gradient(160deg, rgba(107,122,62,0.18), rgba(201,140,58,0.14))" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs uppercase tracking-[0.14em] font-medium",
				style: { color: "#4A4630" },
				children: caption
			})
		})
	});
}
function Landing() {
	const reduced = usePrefersReducedMotion();
	const [role, setRole] = (0, import_react.useState)("buy");
	const [statsRef, statsInView] = useInView({ threshold: .4 });
	const sellers = useCountUp(4200, statsInView);
	const customers = useCountUp(12500, statsInView);
	const orders = useCountUp(25e3, statsInView);
	const cities = useCountUp(38, statsInView);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-h-screen",
		style: {
			backgroundColor: "#FFFDF5",
			color: "#2F312B",
			fontFamily: "var(--font-sans)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
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
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl flex items-center justify-between px-6 md:px-10 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl font-semibold tracking-tight",
						children: "SilverHands"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "sh-focus text-sm font-medium underline decoration-[#C98C3A] decoration-2 underline-offset-4",
						style: { color: "#47531F" },
						children: "Sign in"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative w-full overflow-hidden",
				"aria-label": "Introduction",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-6 md:px-10 pt-6 md:pt-10 pb-16 md:pb-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-12 gap-8 items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-5",
									style: { color: "#C98C3A" },
									children: "A livelihood marketplace, built on skill"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "font-display font-semibold leading-[0.98] text-[13vw] md:text-[5.4vw] lg:text-7xl",
									children: [
										"Turn a lifetime",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"of skill into",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "italic font-medium",
											style: { color: "#6B7A3E" },
											children: "income."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-7 text-lg md:text-xl leading-relaxed max-w-xl",
									style: { color: "#4A4630" },
									children: "Cooking. Tailoring. Tutoring. Craft passed down for generations. SilverHands helps senior citizens and homemakers across India get discovered, trusted, and paid — for what they already know how to do."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-9 flex flex-wrap items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "#entry",
										className: "sh-focus inline-flex items-center gap-2 px-7 py-4 rounded-full text-base font-semibold min-h-[44px]",
										style: {
											backgroundColor: "#47531F",
											color: "#FFFDF5"
										},
										children: ["Start earning", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
											size: 18,
											strokeWidth: 2.2
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#categories",
										className: "sh-focus inline-flex items-center gap-2 px-7 py-4 rounded-full text-base font-semibold min-h-[44px] border-2",
										style: {
											borderColor: "#2F312B",
											color: "#2F312B"
										},
										children: "Explore skills"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
								src: hero_default,
								caption: "An older woman preparing dough beside handmade linen keepsakes on a sunlit table",
								aspect: "aspect-[4/5]",
								className: "rounded-sm"
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				ref: statsRef,
				"aria-label": "Platform scale",
				className: "w-full py-16 md:py-20",
				style: {
					backgroundColor: "#47531F",
					color: "#FFFDF5"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-6 md:px-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6",
						children: [
							{
								value: sellers,
								label: "sellers earning today",
								suffix: "+"
							},
							{
								value: customers,
								label: "customers who've booked",
								suffix: "+"
							},
							{
								value: orders,
								label: "orders completed",
								suffix: "+"
							},
							{
								value: cities,
								label: "cities and counting",
								suffix: ""
							}
						].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 100,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display font-semibold text-4xl md:text-5xl",
								children: [s.value.toLocaleString("en-IN"), s.suffix]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm md:text-base",
								style: { color: "#D9DCC0" },
								children: s.label
							})] })
						}, s.label))
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "categories",
				className: "w-full py-20 md:py-28",
				"aria-label": "What you can find",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 md:px-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display font-semibold text-3xl md:text-5xl max-w-2xl",
							children: "Every skill has a home here."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-lg max-w-xl",
							style: { color: "#4A4630" },
							children: "Ten categories, thousands of quiet experts — found by what they make, not by a resume."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-12 grid md:grid-cols-12 gap-4 md:gap-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								className: "md:col-span-7",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative rounded-sm overflow-hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
										src: categoryImages.food,
										caption: "Homemade snacks and preserves, warm morning light",
										aspect: "aspect-[16/11]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute bottom-5 left-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-2 px-4 py-2 rounded-full font-display italic text-lg",
											style: {
												backgroundColor: "#FFFDF5",
												color: "#2F312B"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { size: 18 }), " Home cooking"]
										})
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-5 grid grid-cols-2 gap-4 md:gap-5",
								children: [
									{
										icon: Scissors,
										label: "Tailoring",
										caption: "Hands guiding fabric under a sewing machine",
										src: categoryImages.tailoring
									},
									{
										icon: BookOpen,
										label: "Tutoring",
										caption: "A tutor and student at a table with an open notebook",
										src: categoryImages.tutoring
									},
									{
										icon: Languages,
										label: "Language",
										caption: "Two people in easy conversation over tea",
										src: void 0
									},
									{
										icon: Sprout,
										label: "Gardening",
										caption: "Soil-covered hands planting a seedling",
										src: categoryImages.garden
									}
								].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
									delay: i * 80,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative rounded-sm overflow-hidden",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
											src: c.src,
											caption: c.caption,
											aspect: "aspect-square"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute bottom-3 left-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
												style: {
													backgroundColor: "#FFFDF5",
													color: "#2F312B"
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { size: 15 }),
													" ",
													c.label
												]
											})
										})]
									})
								}, c.label))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 120,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex flex-wrap gap-3",
								children: [
									{
										icon: Baby,
										label: "Childcare"
									},
									{
										icon: Palette,
										label: "Traditional arts"
									},
									{
										icon: Hammer,
										label: "Handicrafts"
									},
									{
										icon: Music2,
										label: "Music"
									},
									{
										icon: Briefcase,
										label: "Consulting"
									}
								].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border",
									style: {
										borderColor: "#D8CFAE",
										color: "#4A4630"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { size: 15 }),
										" ",
										c.label
									]
								}, c.label))
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "w-full py-20 md:py-28",
				style: { backgroundColor: "#F6EFDD" },
				"aria-label": "A seller's story",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-14 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						className: "md:col-span-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
							src: categoryImages.craft,
							caption: "Handmade snacks packaged for delivery, warm afternoon light",
							aspect: "aspect-[4/5]",
							className: "rounded-sm"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: 100,
						className: "md:col-span-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-5",
								style: { color: "#C98C3A" },
								children: "One seller, one Tuesday morning"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
								className: "font-display italic font-medium text-2xl md:text-4xl leading-tight",
								style: { color: "#2F312B" },
								children: "\"I used to just cook for my family. Now Hyderabad orders my murukku by the box.\""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-6 text-lg leading-relaxed max-w-xl",
								style: { color: "#4A4630" },
								children: [
									"Lakshmi Devi spent forty years cooking for her household. Today she runs a home-snacks business on SilverHands — earning roughly",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										style: { color: "#2F312B" },
										children: "₹15,000 a month"
									}),
									" from recipes she already knew by heart."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-7 flex items-center gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1",
										"aria-label": "4.9 out of 5 stars",
										children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
											size: 18,
											fill: i < 5 ? "#C98C3A" : "none",
											color: "#C98C3A"
										}, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-semibold",
										children: "4.9"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base",
										style: { color: "#4A4630" },
										children: "from 214 reviews"
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "w-full py-20 md:py-28",
				"aria-label": "How it works",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 md:px-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display font-semibold text-3xl md:text-5xl max-w-2xl",
							children: "From skill to customer, in four honest steps."
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-14 grid md:grid-cols-4 gap-8 md:gap-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs uppercase tracking-[0.14em] font-semibold mb-3",
										style: { color: "#C98C3A" },
										children: "Step one"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-xl font-semibold mb-2",
										children: "Speak, don't type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base leading-relaxed",
										style: { color: "#4A4630" },
										children: "Say what you do, out loud, in your own words. No forms."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
									delay: 80,
									className: "md:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs uppercase tracking-[0.14em] font-semibold mb-3",
											style: { color: "#C98C3A" },
											children: "Step two — the SilverHands part"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-xl font-semibold mb-4",
											children: "AI writes your profile for you"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6",
											style: {
												backgroundColor: "#FFFDF5",
												border: "1px solid #E4DCC0"
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-end gap-1 h-14 shrink-0",
													"aria-hidden": "true",
													children: [[
														0,
														1,
														2,
														3,
														4,
														5,
														6
													].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `w-1.5 rounded-full ${reduced ? "" : "sh-bar"}`,
														style: {
															height: `${18 + i % 4 * 9}px`,
															backgroundColor: "#6B7A3E",
															animationDelay: `${i * 90}ms`,
															transformOrigin: "bottom"
														}
													}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {
														size: 20,
														className: "ml-2",
														style: { color: "#47531F" }
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
													size: 20,
													className: "shrink-0 hidden sm:block",
													style: { color: "#C98C3A" }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "w-full rounded-md p-4",
													style: { backgroundColor: "#F6EFDD" },
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-display italic text-base leading-snug",
														style: { color: "#2F312B" },
														children: "\"Home-style Andhra snacks, made fresh to order — 20 years of family recipes.\""
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "mt-2 inline-flex items-center gap-1 text-xs font-semibold",
														style: { color: "#6B7A3E" },
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 }), " Profile drafted"]
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-sm",
											style: { color: "#4A4630" },
											children: "A gentle first draft, ready to review and publish — never published without your okay."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
									delay: 160,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs uppercase tracking-[0.14em] font-semibold mb-3",
											style: { color: "#C98C3A" },
											children: "Step three"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-xl font-semibold mb-2",
											children: "Get discovered"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-base leading-relaxed",
											style: { color: "#4A4630" },
											children: "Nearby customers find you by what you offer."
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 220,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex items-center gap-3 max-w-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-[0.14em] font-semibold",
									style: { color: "#C98C3A" },
									children: "Step four"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-semibold",
									children: "Connect, and get paid."
								})]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "entry",
				className: "w-full py-20 md:py-28",
				style: {
					backgroundColor: "#2F312B",
					color: "#FFFDF5"
				},
				"aria-label": "Get started",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 md:px-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display font-semibold text-3xl md:text-5xl text-center max-w-2xl mx-auto",
							children: "Which brings you here today?"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-12 grid md:grid-cols-2 gap-5 max-w-4xl mx-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRole("buy"),
								"aria-pressed": role === "buy",
								className: "sh-focus w-full text-left rounded-lg p-8 min-h-[44px] transition-transform hover:-translate-y-1",
								style: {
									backgroundColor: role === "buy" ? "#6B7A3E" : "#3B3D34",
									border: role === "buy" ? "2px solid #C98C3A" : "2px solid transparent"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase tracking-[0.16em] font-semibold",
										style: { color: "#E9E4C9" },
										children: "I'm looking for"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-2xl md:text-3xl font-semibold mt-2",
										children: "A trusted local expert"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-base",
										style: { color: "#D9DCC0" },
										children: "Browse cooks, tutors, tailors and craftspeople near you."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-6 inline-flex items-center gap-2 text-sm font-semibold",
										children: ["I want to buy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 16 })]
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: 80,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setRole("sell"),
									"aria-pressed": role === "sell",
									className: "sh-focus w-full text-left rounded-lg p-8 min-h-[44px] transition-transform hover:-translate-y-1",
									style: {
										backgroundColor: role === "sell" ? "#C98C3A" : "#3B3D34",
										border: role === "sell" ? "2px solid #FFFDF5" : "2px solid transparent"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs uppercase tracking-[0.16em] font-semibold",
											style: { color: "#F5E6CE" },
											children: "I have a skill to share"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-2xl md:text-3xl font-semibold mt-2",
											children: "My own customers"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-base",
											style: { color: "#F1E3C9" },
											children: "Build a profile, set your own price, get discovered."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-6 inline-flex items-center gap-2 text-sm font-semibold",
											children: ["I want to sell ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 16 })]
										})
									]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 160,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/login",
									search: { role: role === "buy" ? "buyer" : "seller" },
									className: "sh-focus inline-flex items-center gap-2 px-9 py-4 rounded-full text-base font-semibold min-h-[44px]",
									style: {
										backgroundColor: "#FFFDF5",
										color: "#2F312B"
									},
									children: [
										"Continue as ",
										role === "buy" ? "a buyer" : "a seller",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm",
									style: { color: "#B9B7A8" },
									children: "Just your name to start — no password needed."
								})]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "w-full py-24 md:py-32 text-center",
				"aria-label": "Closing",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-3xl px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display font-semibold text-4xl md:text-6xl leading-tight",
						children: [
							"Your skill has been waiting",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"for its",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "italic",
								style: { color: "#C98C3A" },
								children: "customer."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "#entry",
						className: "sh-focus mt-9 inline-flex items-center gap-2 px-9 py-4 rounded-full text-base font-semibold min-h-[44px]",
						style: {
							backgroundColor: "#47531F",
							color: "#FFFDF5"
						},
						children: ["Get started", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })]
					})] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "w-full py-8 border-t",
				style: { borderColor: "#E4DCC0" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 md:px-10 flex flex-wrap items-center justify-between gap-4 text-sm",
					style: { color: "#7A7663" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 SilverHands" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Made with respect, for every hand that built something." })]
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
