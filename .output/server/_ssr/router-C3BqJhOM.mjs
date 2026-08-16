import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { A as redirect, N as notFound, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/data-C6XNXTJr.js
var cat_food_default = "/assets/cat-food-DuaI1O36.jpg";
var cat_craft_default = "/assets/cat-craft-gjxzFmLO.jpg";
var cat_tailoring_default = "/assets/cat-tailoring-Clk9OvhF.jpg";
var cat_tutoring_default = "/assets/cat-tutoring-Dbr_nEAn.jpg";
var cat_garden_default = "/assets/cat-garden-CVkno_9-.jpg";
var cat_music_default = "/assets/cat-music-CDaO13lR.jpg";
var categoryImages = {
	food: cat_food_default,
	craft: cat_craft_default,
	tailoring: cat_tailoring_default,
	tutoring: cat_tutoring_default,
	garden: cat_garden_default,
	music: cat_music_default
};
var pics = [
	cat_food_default,
	cat_craft_default,
	cat_tailoring_default,
	cat_tutoring_default,
	cat_garden_default,
	cat_music_default
];
function seeded(seed) {
	let s = seed;
	return () => {
		s = (s * 1664525 + 1013904223) % 4294967296;
		return s / 4294967296;
	};
}
var rnd = seeded(20240817);
var pick = (arr, i) => arr[i % arr.length];
var categories = [
	{
		name: "Homemade Food",
		image: cat_food_default,
		count: 214
	},
	{
		name: "Tailoring",
		image: cat_tailoring_default,
		count: 138
	},
	{
		name: "Handicrafts",
		image: cat_craft_default,
		count: 302
	},
	{
		name: "Tutoring",
		image: cat_tutoring_default,
		count: 176
	},
	{
		name: "Language Training",
		image: cat_tutoring_default,
		count: 84
	},
	{
		name: "Gardening",
		image: cat_garden_default,
		count: 61
	},
	{
		name: "Childcare",
		image: cat_food_default,
		count: 47
	},
	{
		name: "Traditional Arts",
		image: cat_craft_default,
		count: 119
	},
	{
		name: "Music Lessons",
		image: cat_music_default,
		count: 93
	},
	{
		name: "Consulting",
		image: cat_tutoring_default,
		count: 58
	}
];
var categoryImage = {
	"Homemade Food": cat_food_default,
	Tailoring: cat_tailoring_default,
	Handicrafts: cat_craft_default,
	Tutoring: cat_tutoring_default,
	"Language Training": cat_tutoring_default,
	Gardening: cat_garden_default,
	Childcare: cat_food_default,
	"Traditional Arts": cat_craft_default,
	"Music Lessons": cat_music_default,
	Consulting: cat_tutoring_default
};
var sellers = [
	[
		"Anjali Sen",
		62,
		"Homemaker & Cook",
		"Salt Lake, Kolkata",
		"Homemade Food",
		[
			"Bengali cuisine",
			"Pickling",
			"Tiffin planning"
		],
		[
			"Bengali",
			"Hindi",
			"English"
		]
	],
	[
		"Meera Iyer",
		58,
		"Master Tailor",
		"T. Nagar, Chennai",
		"Tailoring",
		[
			"Blouse stitching",
			"Saree falls",
			"Hand finishing"
		],
		["Tamil", "English"]
	],
	[
		"Dr. R. Krishnan",
		68,
		"Retired Professor",
		"Jayanagar, Bengaluru",
		"Tutoring",
		[
			"Mathematics",
			"Physics",
			"Exam coaching"
		],
		[
			"English",
			"Kannada",
			"Hindi"
		]
	],
	[
		"Vikram Joshi",
		71,
		"Classical Musician",
		"Kothrud, Pune",
		"Music Lessons",
		[
			"Sitar",
			"Raag theory",
			"Taal"
		],
		[
			"Marathi",
			"Hindi",
			"English"
		]
	],
	[
		"Suresh Nair",
		65,
		"Horticulturist",
		"Panampilly Nagar, Kochi",
		"Gardening",
		[
			"Balcony gardens",
			"Composting",
			"Grafting"
		],
		["Malayalam", "English"]
	],
	[
		"Elena Fernandes",
		66,
		"Retired Diplomat",
		"Panjim, Goa",
		"Language Training",
		[
			"Spanish",
			"Portuguese",
			"Public speaking"
		],
		[
			"Spanish",
			"English",
			"Konkani"
		]
	],
	[
		"Kamala Devi",
		69,
		"Traditional Weaver",
		"Bhuj, Gujarat",
		"Handicrafts",
		[
			"Pit-loom weaving",
			"Natural dyes",
			"Kantha"
		],
		["Gujarati", "Hindi"]
	],
	[
		"Lakshmi Devi",
		57,
		"Home Chef",
		"Madhapur, Hyderabad",
		"Homemade Food",
		[
			"Andhra snacks",
			"Podis",
			"Sweets"
		],
		[
			"Telugu",
			"Hindi",
			"English"
		]
	],
	[
		"Raman Sir",
		64,
		"Retired Teacher",
		"Mylapore, Chennai",
		"Tutoring",
		[
			"Mathematics",
			"Board revision",
			"Vedic maths"
		],
		["Tamil", "English"]
	],
	[
		"Sudha Menon",
		60,
		"Embroidery Artisan",
		"Thrissur, Kerala",
		"Traditional Arts",
		[
			"Aari work",
			"Zardozi",
			"Mirror work"
		],
		[
			"Malayalam",
			"Tamil",
			"English"
		]
	],
	[
		"Harbans Kaur",
		67,
		"Home Baker",
		"Model Town, Amritsar",
		"Homemade Food",
		[
			"Punjabi breads",
			"Preserves",
			"Festive boxes"
		],
		["Punjabi", "Hindi"]
	],
	[
		"Prakash Deshmukh",
		70,
		"Retired Accountant",
		"Nagpur",
		"Consulting",
		[
			"Tax filing",
			"Small-business books",
			"GST"
		],
		[
			"Marathi",
			"Hindi",
			"English"
		]
	],
	[
		"Fatima Sheikh",
		55,
		"Childcare Specialist",
		"Bandra, Mumbai",
		"Childcare",
		[
			"Infant care",
			"Storytelling",
			"Montessori play"
		],
		[
			"Urdu",
			"Hindi",
			"English"
		]
	],
	[
		"Gopal Rao",
		72,
		"Potter",
		"Bhimavaram, Andhra Pradesh",
		"Handicrafts",
		[
			"Wheel throwing",
			"Terracotta",
			"Glazing"
		],
		["Telugu", "Hindi"]
	],
	[
		"Nirmala Joshi",
		61,
		"Yoga Teacher",
		"Rishikesh, Uttarakhand",
		"Consulting",
		[
			"Hatha yoga",
			"Pranayama",
			"Senior mobility"
		],
		["Hindi", "English"]
	],
	[
		"Abdul Rahman",
		66,
		"Calligrapher",
		"Charminar, Hyderabad",
		"Traditional Arts",
		[
			"Urdu calligraphy",
			"Framing",
			"Gold leaf"
		],
		[
			"Urdu",
			"Telugu",
			"English"
		]
	],
	[
		"Sarita Pillai",
		59,
		"Language Coach",
		"Vashi, Navi Mumbai",
		"Language Training",
		[
			"Spoken English",
			"Interview prep",
			"Phonetics"
		],
		[
			"Marathi",
			"Hindi",
			"English"
		]
	],
	[
		"Joseph Mathew",
		68,
		"Retired Engineer",
		"Kottayam, Kerala",
		"Tutoring",
		[
			"Physics",
			"Robotics club",
			"Science fairs"
		],
		["Malayalam", "English"]
	],
	[
		"Bhavna Trivedi",
		63,
		"Handloom Designer",
		"Ahmedabad",
		"Handicrafts",
		[
			"Block printing",
			"Bandhani",
			"Stoles"
		],
		[
			"Gujarati",
			"Hindi",
			"English"
		]
	],
	[
		"Mohan Bhatt",
		74,
		"Vocalist",
		"Jaipur",
		"Music Lessons",
		[
			"Hindustani vocal",
			"Bhajan",
			"Harmonium"
		],
		["Hindi", "Rajasthani"]
	]
].map(([name, age, role, location, cat, skills, languages], i) => ({
	id: `u${i + 1}`,
	name,
	age,
	role,
	avatar: categoryImage[cat] ?? pick(pics, i),
	cover: pick(pics, i + 2),
	location,
	about: `${name.split(" ")[0]} has spent a lifetime perfecting ${skills[0]?.toLowerCase()}. Every order is handled personally, with the patience and care that only decades of practice bring.`,
	skills,
	languages,
	experience: `${20 + i % 25} years of practice`,
	rating: Number((4.5 + rnd() * .5).toFixed(1)),
	reviews: 30 + Math.floor(rnd() * 220),
	joined: `Member since 20${14 + i % 10}`,
	responseTime: pick([
		"Usually replies within an hour",
		"Replies same day",
		"Replies within 2 hours"
	], i)
}));
var services = [
	[
		"Home-cooked Bengali thali, delivered daily",
		"Homemade Food",
		180,
		"per meal"
	],
	[
		"Bespoke blouse and saree fall stitching",
		"Tailoring",
		450,
		"per piece"
	],
	[
		"Retired professor: Mathematics tutoring, Class 8–12",
		"Tutoring",
		700,
		"per hour"
	],
	[
		"Classical sitar lessons for beginners",
		"Music Lessons",
		900,
		"per session"
	],
	[
		"Balcony kitchen-garden setup and monthly care",
		"Gardening",
		1200,
		"per visit"
	],
	[
		"Conversational Spanish with a retired diplomat",
		"Language Training",
		850,
		"per hour"
	],
	[
		"Andhra tiffin subscription, breakfast delivered",
		"Homemade Food",
		150,
		"per meal"
	],
	[
		"Festive sweet boxes made to order",
		"Homemade Food",
		950,
		"per box"
	],
	[
		"School uniform alterations and repairs",
		"Tailoring",
		120,
		"per piece"
	],
	[
		"Kurta and salwar tailoring with fitting",
		"Tailoring",
		700,
		"per piece"
	],
	[
		"Physics coaching for Class 11 and 12",
		"Tutoring",
		650,
		"per hour"
	],
	[
		"Vedic maths crash course for young learners",
		"Tutoring",
		500,
		"per hour"
	],
	[
		"Spoken English and interview preparation",
		"Language Training",
		600,
		"per hour"
	],
	[
		"Hindi reading and writing for beginners",
		"Language Training",
		400,
		"per hour"
	],
	[
		"Hindustani vocal training, gurukul style",
		"Music Lessons",
		800,
		"per session"
	],
	[
		"Harmonium basics for absolute beginners",
		"Music Lessons",
		550,
		"per session"
	],
	[
		"Terrace vegetable garden consultation",
		"Gardening",
		900,
		"per visit"
	],
	[
		"Monthly plant care and repotting service",
		"Gardening",
		700,
		"per visit"
	],
	[
		"After-school childcare with homework help",
		"Childcare",
		300,
		"per hour"
	],
	[
		"Infant care support for new parents",
		"Childcare",
		400,
		"per hour"
	],
	[
		"Aari embroidery workshop at your home",
		"Traditional Arts",
		1500,
		"per session"
	],
	[
		"Urdu calligraphy lessons and commissions",
		"Traditional Arts",
		1100,
		"per session"
	],
	[
		"Block printing workshop for small groups",
		"Traditional Arts",
		1300,
		"per session"
	],
	[
		"Income tax filing for salaried individuals",
		"Consulting",
		1500,
		"per filing"
	],
	[
		"Bookkeeping for home businesses",
		"Consulting",
		2500,
		"per month"
	],
	[
		"Gentle yoga for seniors, at home",
		"Consulting",
		600,
		"per session"
	],
	[
		"Pottery wheel introduction class",
		"Handicrafts",
		1200,
		"per session"
	],
	[
		"Custom handloom stole weaving on order",
		"Handicrafts",
		2200,
		"per piece"
	],
	[
		"Pickle and preserve making masterclass",
		"Homemade Food",
		1e3,
		"per session"
	],
	[
		"Storytelling sessions for children",
		"Childcare",
		350,
		"per hour"
	]
].map(([title, category, price, unit], i) => {
	const seller = pick(sellers.filter((s) => s.skills.length > 0), i * 3 + i % 5);
	return {
		id: `s${i + 1}`,
		title,
		sellerId: seller.id,
		seller: seller.name,
		sellerAge: `${seller.age} · ${seller.role}`,
		image: categoryImage[category] ?? pick(pics, i),
		rating: Number((4.4 + rnd() * .6).toFixed(1)),
		reviews: 18 + Math.floor(rnd() * 200),
		price,
		unit,
		location: seller.location,
		category,
		about: `${title} — offered personally by ${seller.name}, drawing on ${seller.experience.toLowerCase()}. Timings are flexible and every booking begins with a short call.`,
		languages: seller.languages,
		experience: seller.experience,
		delivery: pick([
			"Same day, before 1 PM",
			"Within 3 days",
			"Flexible weekday evenings",
			"Twice weekly, 60 minutes",
			"4–6 days"
		], i),
		availability: pick([
			"Mon–Sat, 9am–6pm",
			"Weekday evenings",
			"Weekends only",
			"Mon–Fri, 10am–5pm"
		], i)
	};
});
var products = [
	[
		"Handwoven cotton throw, olive fringe",
		"Handicrafts",
		2400
	],
	[
		"Small-batch mango & jaggery preserve",
		"Homemade Food",
		420
	],
	[
		"Hand-embroidered linen cushion cover",
		"Traditional Arts",
		1150
	],
	[
		"Terracotta herb planter set of three",
		"Gardening",
		980
	],
	[
		"Andhra gunpowder podi, 250g",
		"Homemade Food",
		260
	],
	[
		"Ghee-roasted cashew mysore pak box",
		"Homemade Food",
		640
	],
	[
		"Punjabi mixed vegetable pickle, 500g",
		"Homemade Food",
		380
	],
	[
		"Sun-dried tomato & chilli chutney",
		"Homemade Food",
		310
	],
	[
		"Millet laddoo box, sugar-free",
		"Homemade Food",
		520
	],
	[
		"Bandhani cotton dupatta, indigo",
		"Handicrafts",
		1800
	],
	[
		"Block-printed table runner",
		"Handicrafts",
		1250
	],
	[
		"Hand-thrown stoneware mug, pair",
		"Handicrafts",
		1450
	],
	[
		"Jute and cotton floor mat",
		"Handicrafts",
		2100
	],
	[
		"Kantha stitched quilt, single bed",
		"Handicrafts",
		4600
	],
	[
		"Handloom cotton stole, undyed",
		"Handicrafts",
		1700
	],
	[
		"Aari work potli bag",
		"Traditional Arts",
		1350
	],
	[
		"Zardozi framed wall panel",
		"Traditional Arts",
		5200
	],
	[
		"Urdu calligraphy print, gold leaf",
		"Traditional Arts",
		2900
	],
	[
		"Mirror-work cushion set of two",
		"Traditional Arts",
		2250
	],
	[
		"Warli painting on handmade paper",
		"Traditional Arts",
		1600
	],
	[
		"Cotton kurta, hand-stitched",
		"Tailoring",
		1900
	],
	[
		"Custom saree blouse, ready to wear",
		"Tailoring",
		1100
	],
	[
		"Quilted cotton jacket, reversible",
		"Tailoring",
		2700
	],
	[
		"School uniform repair kit",
		"Tailoring",
		350
	],
	[
		"Tulsi and mint sapling duo",
		"Gardening",
		450
	],
	[
		"Vermicompost pack, 5kg",
		"Gardening",
		390
	],
	[
		"Hanging coir planter, set of four",
		"Gardening",
		860
	],
	[
		"Brass watering can, hand-beaten",
		"Gardening",
		1550
	],
	[
		"Beginner's tabla practice pad",
		"Music Lessons",
		1250
	],
	[
		"Illustrated raag workbook for children",
		"Music Lessons",
		480
	]
].map(([name, category, price], i) => {
	const seller = pick(sellers, i * 7 + 3);
	return {
		id: `p${i + 1}`,
		name,
		sellerId: seller.id,
		seller: seller.name,
		image: categoryImage[category] ?? pick(pics, i),
		rating: Number((4.3 + rnd() * .7).toFixed(1)),
		reviews: 12 + Math.floor(rnd() * 160),
		price,
		category,
		stock: 3 + Math.floor(rnd() * 30),
		description: `${name} — made in small batches by ${seller.name} in ${seller.location}. No shortcuts, no machines where hands will do, and every piece checked before it is packed.`,
		delivery: pick([
			"Ships in 3 days · Free above ₹1,500",
			"Ships in 2 days",
			"Ships in 4 days",
			"Ships in 5 days"
		], i)
	};
});
var reviewAuthors = [
	"Priya M.",
	"Arjun T.",
	"Nisha R.",
	"Kabir S.",
	"Divya N.",
	"Rohit P.",
	"Sneha K.",
	"Imran Q.",
	"Ananya B.",
	"Vivek D.",
	"Meghna A.",
	"Rahul V.",
	"Farah I.",
	"Sanjay G.",
	"Pooja L.",
	"Tarun C.",
	"Ritika J.",
	"Aditya H.",
	"Kavya S.",
	"Manish W."
];
var reviewTexts = [
	"Genuinely the warmest experience I've had on any marketplace. Everything arrived early and beautifully packed.",
	"Communication was clear and patient throughout. I've already booked again for next month.",
	"Lovely craftsmanship and fair pricing. Delivery took a day longer than expected, which was fine.",
	"Exactly as described, and the little handwritten note made my week.",
	"My children look forward to every session now. Highly recommended.",
	"Quality you simply cannot find in a shop. Worth every rupee.",
	"Very accommodating with my requests and timings. Thank you!",
	"Packaging was thoughtful and plastic-free. Will order again.",
	"Great value and genuine care in the work. A few days' wait, but worth it.",
	"Professional, punctual and extremely knowledgeable."
];
var targets = [
	...services.map((s) => s.id),
	...products.map((p) => p.id),
	...sellers.map((s) => s.id)
];
/** Legacy alias kept for existing imports. */
var reviews = Array.from({ length: 100 }, (_, i) => ({
	id: `r${i + 1}`,
	targetId: pick(targets, i * 5 + 1),
	author: pick(reviewAuthors, i * 3),
	rating: 4 + (i % 5 === 0 ? 0 : 1),
	text: pick(reviewTexts, i * 2 + 1),
	date: pick([
		"2 weeks ago",
		"1 month ago",
		"2 months ago",
		"5 days ago",
		"3 weeks ago"
	], i)
})).slice(0, 3);
[
	[
		"Namaste! Do you deliver the thali to Salt Lake sector 5?",
		"Yes, I deliver there every day before 1 PM.",
		"Perfect, please start from Monday."
	],
	[
		"Could you stitch a blouse from my own fabric?",
		"Of course — bring the fabric and I'll take measurements.",
		"Wonderful, I'll come Saturday."
	],
	[
		"Is there a slot free for Class 10 maths on weekends?",
		"Saturday 4 PM is open from next week.",
		"Please book it for my daughter."
	],
	[
		"How long before a beginner can play a simple raag?",
		"About three months with regular practice.",
		"That's encouraging, thank you."
	],
	[
		"My balcony gets only morning sun — will herbs grow?",
		"Yes, mint and curry leaf do very well there.",
		"Let's plan a visit then."
	],
	[
		"Do you teach Spanish to complete beginners?",
		"Absolutely, we start with everyday conversation.",
		"Sign me up for Tuesdays."
	],
	[
		"Can the quilt be made in indigo instead?",
		"Yes, I have indigo yarn dyed last month.",
		"Please go ahead."
	],
	[
		"Is the pickle less spicy version available?",
		"I can prepare a mild batch for you.",
		"Thank you so much!"
	],
	[
		"Do you offer trial classes before booking?",
		"Yes, the first session is free.",
		"Great, this Friday works."
	],
	[
		"Would you take a bulk order of 20 gift boxes?",
		"Yes, with a week's notice.",
		"Placing the order today."
	]
].map(([a, b, c], i) => ({
	id: `c${i + 1}`,
	sellerId: pick(sellers, i).id,
	buyerName: pick([
		"Priya Menon",
		"Arjun Thomas",
		"Nisha Rao",
		"Kabir Shah",
		"Divya Nair"
	], i),
	messages: [
		{
			id: `c${i + 1}m1`,
			from: "buyer",
			text: a,
			time: "10:02"
		},
		{
			id: `c${i + 1}m2`,
			from: "seller",
			text: b,
			time: "10:14"
		},
		{
			id: `c${i + 1}m3`,
			from: "buyer",
			text: c,
			time: "10:20"
		}
	]
}));
services.length + products.length;
var inr = (n) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-C3BqJhOM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-CL2eWznk.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$25 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SilverHands — Turn Skills Into Opportunities" },
			{
				name: "description",
				content: "An AI-powered marketplace connecting senior citizens and homemakers with customers."
			},
			{
				property: "og:title",
				content: "SilverHands — Turn Skills Into Opportunities"
			},
			{
				property: "og:description",
				content: "An AI-powered marketplace connecting senior citizens and homemakers with customers."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Work+Sans:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$25.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-center",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$22 = () => import("./routes-CDMSfol-.mjs");
var Route$24 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "SilverHands — Turn a lifetime of skill into income" },
		{
			name: "description",
			content: "An AI-powered marketplace connecting senior citizens and homemakers with customers seeking trusted local services, handmade products, and mentorship."
		},
		{
			property: "og:title",
			content: "SilverHands — Turn a lifetime of skill into income"
		},
		{
			property: "og:description",
			content: "Discover trusted local services and handmade goods, or offer your own skills on SilverHands."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./buyer-B5Z4m1zS.mjs");
var Route$23 = createFileRoute("/buyer")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./login-D43ElTAI.mjs");
var Route$22 = createFileRoute("/login")({
	validateSearch: (search) => {
		const rawRole = search["role"];
		const role = rawRole === "seller" ? "seller" : rawRole === "buyer" ? "buyer" : void 0;
		const rawRedirect = search["redirect"];
		const redirect = typeof rawRedirect === "string" ? rawRedirect : void 0;
		return {
			...role ? { role } : {},
			...redirect ? { redirect } : {}
		};
	},
	head: () => ({ meta: [{ title: "Sign in | SilverHands" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./seller-C4yf58Tq.mjs");
var Route$21 = createFileRoute("/seller")({
	beforeLoad: ({ location }) => {
		if (typeof window === "undefined") return;
		const raw = window.localStorage.getItem("silverhands.session");
		if (!raw) throw redirect({
			to: "/login",
			search: { role: "seller" }
		});
		let session = null;
		try {
			session = JSON.parse(raw);
		} catch {
			session = null;
		}
		if (!session) throw redirect({
			to: "/login",
			search: { role: "seller" }
		});
		const onOnboardingPage = location.pathname === "/seller/onboarding";
		const onInterviewRedirect = location.pathname === "/seller/interview";
		if (!session.onboarded && !onOnboardingPage && !onInterviewRedirect) throw redirect({ to: "/seller/onboarding" });
	},
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var GeminiConfigError = class extends Error {};
var GeminiRequestError = class extends Error {};
/** Calls Gemini's OpenAI-compatible chat completions endpoint and returns
* the raw text content of the reply. Throws GeminiConfigError if the env
* isn't set up, GeminiRequestError if the call itself fails. Callers catch
* these and turn them into an honest "temporarily unavailable" response —
* never a silent fallback to invented content. */
async function callGemini(messages) {
	const baseUrl = processModule.env["GEMINI_BASE_URL"];
	const model = processModule.env["GEMINI_MODEL"];
	const apiKey = processModule.env["GEMINI_API_KEY"];
	if (!baseUrl || !model || !apiKey) throw new GeminiConfigError("Missing GEMINI_BASE_URL, GEMINI_MODEL, or GEMINI_API_KEY");
	const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			messages,
			temperature: .8,
			response_format: { type: "json_object" }
		})
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		throw new GeminiRequestError(`Gemini request failed: ${res.status} ${errText}`);
	}
	const completion = await res.json();
	const content = completion?.choices?.[0]?.message?.content;
	if (!content) throw new GeminiRequestError(`Gemini response had no content: ${JSON.stringify(completion)}`);
	return content;
}
/** Strips markdown fences a model sometimes wraps JSON in, despite being
* asked not to. Doesn't trust the result — callers should still validate
* shape before using it. */
function stripJsonFences(raw) {
	return raw.replace(/```json|```/g, "").trim();
}
var SYSTEM_PROMPT$1 = `You are the seller-facing "AI Advisor" on SilverHands, a marketplace where senior citizens and homemakers in India sell handmade goods and services. You are looking at ONE seller's own profile and dashboard stats and giving THEM 3-4 short, concrete suggestions to grow their business.

The bar for a good suggestion: it should only make sense for THIS seller — it should draw on their specific craft/skill, their city or region, and the current time of year (season, festivals, school calendar, weather) in India. If a suggestion could be copy-pasted onto a different seller's dashboard unchanged, it has failed.

Good example: a tailor in Chennai, with school reopening season approaching, gets told to offer uniform stitching — not "consider offering discounts" or "raise your prices."

Bad suggestions to avoid: generic marketing advice ("promote on social media", "offer discounts", "improve your photos") unless you tie it to something specific about this seller. Never suggest anything that requires data you don't have (you cannot see order history, competitor prices, or reviews — only what's given to you below).

Some profile fields may be missing or empty because the seller is new. Don't mention that data is missing and don't apologize for it — just lean more heavily on whatever fields ARE present (even just a skill and a city is enough for one good seasonal or local suggestion). If almost nothing is filled in, give general encouragement suited to a new seller in their stated craft, still grounded in location/season where possible, rather than inventing facts about them.

Respond with ONLY a JSON object, no markdown fences, no commentary, in exactly this shape:
{"suggestions": [{"title": "string, under 8 words", "description": "string, 1-2 sentences"}]}

Return 3 to 4 suggestions.`;
function buildUserPrompt(seller, stats) {
	const lines = [
		`Today's date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "long",
			year: "numeric"
		})} (India).`,
		"",
		"Seller profile:"
	];
	lines.push(`- Name: ${seller.name || "(not provided)"}`);
	lines.push(`- Location: ${seller.location || "(not provided)"}`);
	lines.push(`- Skills: ${seller.skills && seller.skills.length > 0 ? seller.skills.join(", ") : "(not provided)"}`);
	lines.push(`- About: ${seller.about || "(not provided)"}`);
	lines.push(`- Experience: ${seller.experience || "(not provided)"}`);
	lines.push("", "Dashboard stats:");
	lines.push(`- Revenue: ${stats.revenue !== void 0 ? stats.revenue : "(not available yet)"}`);
	lines.push(`- Orders: ${stats.orders !== void 0 ? stats.orders : "(not available yet)"}`);
	lines.push(`- Views: ${stats.views !== void 0 ? stats.views : "(not available yet)"}`);
	lines.push(`- Top category: ${stats.topCategory || "(not available yet)"}`);
	return lines.join("\n");
}
/** Very defensive parse — the model is asked for clean JSON, but we don't
* trust that blindly. Strips markdown fences if present, validates shape,
* and drops any item missing a title/description instead of failing the
* whole response. */
function parseSuggestions(raw) {
	const parsed = JSON.parse(stripJsonFences(raw));
	const list = Array.isArray(parsed?.suggestions) ? parsed.suggestions : null;
	if (!list) throw new Error("Response JSON did not contain a suggestions array");
	const suggestions = list.filter((item) => typeof item === "object" && item !== null && typeof item.title === "string" && typeof item.description === "string").slice(0, 4);
	if (suggestions.length === 0) throw new Error("No valid suggestions in response");
	return suggestions;
}
var Route$20 = createFileRoute("/api/advisor")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "Invalid request body." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	const seller = body?.seller ?? {};
	const stats = body?.stats ?? {};
	try {
		const suggestions = parseSuggestions(await callGemini([{
			role: "system",
			content: SYSTEM_PROMPT$1
		}, {
			role: "user",
			content: buildUserPrompt(seller, stats)
		}]));
		return new Response(JSON.stringify({ suggestions }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		const status = err instanceof GeminiConfigError ? 500 : 502;
		console.error("Advisor route error:", err);
		return new Response(JSON.stringify({ error: "Advisor is temporarily unavailable." }), {
			status,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var SYSTEM_PROMPT = `You are "Hansa AI", the seller-facing AI Advisor on SilverHands, a marketplace where senior citizens and homemakers in India sell handmade goods and services. You are in a conversation with ONE seller about their own shop, grounded only in the profile and stats given to you below — you cannot see order history, competitor prices, reviews, or any other seller's data, so never invent or imply access to information you don't have.

Two modes, based on whether the latest user message is present:

1. NO user message (this is the opening turn): write a short, warm opening (1-2 sentences) plus 2-3 grounded insights and 2-3 concrete recommendations — specific to this seller's craft, city, and the current time of year in India (season, festivals, school calendar). A recommendation that could be copy-pasted onto a different seller unchanged has failed. Example of the right specificity: a tailor in Chennai near school-reopening season should hear about uniform-stitching demand, not "consider offering discounts."

2. A user message IS present: answer that specific question directly and conversationally, using the same profile/stats grounding and conversation history. Only include insights/recommendations if they genuinely help answer this question — a simple question can just get a direct, well-reasoned answer with no bullet lists.

Some profile fields may be missing because the seller is new — don't mention that data is missing or apologize for it, just lean on whatever IS present. If almost nothing is filled in, give general encouragement suited to a new seller in their stated craft.

Respond with ONLY a JSON object, no markdown fences, no commentary, in exactly this shape:
{"text": "string", "insights": [{"label": "string", "value": "string"}], "recommendations": ["string"]}

"insights" and "recommendations" are optional — omit them (or use empty arrays) for a simple conversational answer that doesn't need them.`;
function buildContextBlock(seller, stats) {
	const lines = [
		`Today's date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "long",
			year: "numeric"
		})} (India).`,
		"",
		"Seller profile:"
	];
	lines.push(`- Name: ${seller.name || "(not provided)"}`);
	lines.push(`- Location: ${seller.location || "(not provided)"}`);
	lines.push(`- Skills: ${seller.skills && seller.skills.length > 0 ? seller.skills.join(", ") : "(not provided)"}`);
	lines.push(`- About: ${seller.about || "(not provided)"}`);
	lines.push(`- Experience: ${seller.experience || "(not provided)"}`);
	lines.push("", "Dashboard stats:");
	lines.push(`- Revenue: ${stats.revenue !== void 0 ? stats.revenue : "(not available yet)"}`);
	lines.push(`- Orders: ${stats.orders !== void 0 ? stats.orders : "(not available yet)"}`);
	lines.push(`- Views: ${stats.views !== void 0 ? stats.views : "(not available yet)"}`);
	lines.push(`- Top category: ${stats.topCategory || "(not available yet)"}`);
	return lines.join("\n");
}
/** Keep only the last few turns — this is a demo, not a feature that needs
* unbounded context, and it keeps every request small and fast. */
function recentHistory(history, limit = 6) {
	if (!history || history.length === 0) return [];
	return history.slice(-limit);
}
function parseReply(raw) {
	const parsed = JSON.parse(stripJsonFences(raw));
	if (typeof parsed?.text !== "string" || !parsed.text.trim()) throw new Error("Response JSON did not contain non-empty text");
	const insights = Array.isArray(parsed.insights) ? parsed.insights.filter((i) => typeof i === "object" && i !== null && typeof i.label === "string" && typeof i.value === "string") : void 0;
	const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations.filter((r) => typeof r === "string") : void 0;
	return {
		text: parsed.text,
		...insights && insights.length > 0 ? { insights } : {},
		...recommendations && recommendations.length > 0 ? { recommendations } : {}
	};
}
var Route$19 = createFileRoute("/api/advisor-chat")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "Invalid request body." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	const seller = body?.seller ?? {};
	const stats = body?.stats ?? {};
	const message = body?.message?.trim();
	const history = recentHistory(body?.history);
	const messages = [
		{
			role: "system",
			content: SYSTEM_PROMPT
		},
		{
			role: "user",
			content: buildContextBlock(seller, stats)
		},
		...history.map((turn) => ({
			role: turn.role === "user" ? "user" : "assistant",
			content: turn.text
		})),
		{
			role: "user",
			content: message ? `The seller asks: "${message}"` : "No question yet — write the opening message for this session."
		}
	];
	try {
		const reply = parseReply(await callGemini(messages));
		return new Response(JSON.stringify(reply), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		const status = err instanceof GeminiConfigError ? 500 : 502;
		console.error("Advisor chat route error:", err);
		return new Response(JSON.stringify({ error: "Advisor is temporarily unavailable." }), {
			status,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var $$splitComponentImporter$18 = () => import("./buyer.index-DuPewcnh.mjs");
var Route$18 = createFileRoute("/buyer/")({
	head: () => ({ meta: [
		{ title: "Discover local makers & experts | SilverHands" },
		{
			name: "description",
			content: "Search AI-curated services, handmade products and mentors from senior citizens and homemakers near you."
		},
		{
			property: "og:title",
			content: "Discover local makers & experts | SilverHands"
		},
		{
			property: "og:description",
			content: "AI-curated services, handmade products and mentors near you."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./buyer.favorites-02tdb9YS.mjs");
var Route$17 = createFileRoute("/buyer/favorites")({
	head: () => ({ meta: [
		{ title: "Your favorites | SilverHands" },
		{
			name: "description",
			content: "Every seller, service and handmade piece you've saved."
		},
		{
			property: "og:title",
			content: "Your favorites | SilverHands"
		},
		{
			property: "og:description",
			content: "Everything you've saved on SilverHands."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./buyer.messages-CyPaxOuN.mjs");
var Route$16 = createFileRoute("/buyer/messages")({
	head: () => ({ meta: [
		{ title: "Messages | SilverHands" },
		{
			name: "description",
			content: "Chat directly with the sellers you've booked or saved."
		},
		{
			property: "og:title",
			content: "Messages | SilverHands"
		},
		{
			property: "og:description",
			content: "Chat directly with your SilverHands sellers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./buyer.products-BK78JChx.mjs");
var Route$15 = createFileRoute("/buyer/products")({
	validateSearch: (search) => {
		const q = typeof search["q"] === "string" ? search["q"] : void 0;
		const category = typeof search["category"] === "string" ? search["category"] : void 0;
		const sort = typeof search["sort"] === "string" ? search["sort"] : void 0;
		return {
			...q ? { q } : {},
			...category ? { category } : {},
			...sort ? { sort } : {}
		};
	},
	head: () => ({ meta: [
		{ title: "Handmade products | SilverHands" },
		{
			name: "description",
			content: "Shop handwoven textiles, small-batch preserves, embroidery and terracotta made by senior artisans and homemakers."
		},
		{
			property: "og:title",
			content: "Handmade products | SilverHands"
		},
		{
			property: "og:description",
			content: "Shop handmade goods made slowly by senior artisans and homemakers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./buyer.profile-DvOrncEQ.mjs");
var Route$14 = createFileRoute("/buyer/profile")({
	head: () => ({ meta: [
		{ title: "Your profile | SilverHands" },
		{
			name: "description",
			content: "Manage your delivery details, preferences and orders."
		},
		{
			property: "og:title",
			content: "Your profile | SilverHands"
		},
		{
			property: "og:description",
			content: "Manage your SilverHands account details."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./buyer.services-e9Rp1Cwk.mjs");
var Route$13 = createFileRoute("/buyer/services")({
	validateSearch: (search) => {
		const category = typeof search["category"] === "string" ? search["category"] : void 0;
		const q = typeof search["q"] === "string" ? search["q"] : void 0;
		return {
			...category ? { category } : {},
			...q ? { q } : {}
		};
	},
	head: () => ({ meta: [
		{ title: "Explore services | SilverHands" },
		{
			name: "description",
			content: "Book tutoring, tailoring, home-cooked meals, gardening and more from experienced senior and homemaker sellers."
		},
		{
			property: "og:title",
			content: "Explore services | SilverHands"
		},
		{
			property: "og:description",
			content: "Book trusted local services from experienced senior and homemaker sellers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./elder.callback-BIwQDXfG.mjs");
/**
* ElderSkill callback handler.
*
* This route is hit when ElderSkill redirects back to Silver Hands after
* the user completes auth + voice interview. The flow:
*
*   ElderSkill (interview complete)
*     → /elder/callback?elderskill_user_id=<uuid>
*     → fetch profile from ElderSkill API
*     → map to Silver Hands seller profile (localStorage)
*     → signIn + completeOnboarding
*     → redirect to /seller
*/
var Route$12 = createFileRoute("/elder/callback")({
	head: () => ({ meta: [{ title: "Syncing your profile…" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./seller.index-DtGqlw7v.mjs");
var Route$11 = createFileRoute("/seller/")({
	head: () => ({ meta: [
		{ title: "Seller dashboard | SilverHands" },
		{
			name: "description",
			content: "Track earnings, orders, listings and ratings for your SilverHands shop."
		},
		{
			property: "og:title",
			content: "Seller dashboard | SilverHands"
		},
		{
			property: "og:description",
			content: "Track earnings, orders and ratings in one place."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./seller.ai-advisor-BiMzcrJJ.mjs");
var Route$10 = createFileRoute("/seller/ai-advisor")({
	head: () => ({ meta: [
		{ title: "AI Advisor | SilverHands" },
		{
			name: "description",
			content: "Get AI-powered advice grounded in your SilverHands shop data."
		},
		{
			property: "og:title",
			content: "AI Advisor | SilverHands"
		},
		{
			property: "og:description",
			content: "Get AI-powered advice grounded in your SilverHands shop data."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./seller.analytics-Db-LHXlX.mjs");
var Route$9 = createFileRoute("/seller/analytics")({
	head: () => ({ meta: [
		{ title: "Analytics | SilverHands" },
		{
			name: "description",
			content: "See how earnings, views and orders trend month to month."
		},
		{
			property: "og:title",
			content: "Analytics | SilverHands"
		},
		{
			property: "og:description",
			content: "Earnings, views and order trends for your shop."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./seller.interview-FOs2B5bT.mjs");
/**
* Legacy route — the embedded voice interview has been removed.
*
* The voice experience is now entirely owned by ElderSkill (separate app).
* If a user somehow reaches this route, redirect them to ElderSkill's
* auth page so they can go through the real voice application.
*/
var Route$8 = createFileRoute("/seller/interview")({
	head: () => ({ meta: [{ title: "Redirecting to ElderSkill..." }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./seller.messages-2Yo1--rj.mjs");
var Route$7 = createFileRoute("/seller/messages")({
	head: () => ({ meta: [
		{ title: "Seller messages | SilverHands" },
		{
			name: "description",
			content: "Answer buyer questions and confirm bookings."
		},
		{
			property: "og:title",
			content: "Seller messages | SilverHands"
		},
		{
			property: "og:description",
			content: "Answer buyer questions and confirm bookings."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./seller.onboarding-B7cpedUN.mjs");
var Route$6 = createFileRoute("/seller/onboarding")({
	head: () => ({ meta: [{ title: "Create your profile | SilverHands" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./seller.orders-uGCm5vKg.mjs");
var Route$5 = createFileRoute("/seller/orders")({
	head: () => ({ meta: [
		{ title: "Orders | SilverHands" },
		{
			name: "description",
			content: "Track every order, its status and payout at a glance."
		},
		{
			property: "og:title",
			content: "Orders | SilverHands"
		},
		{
			property: "og:description",
			content: "Track every order and payout at a glance."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./seller.products-Bz_u2Gqh.mjs");
var Route$4 = createFileRoute("/seller/products")({
	head: () => ({ meta: [
		{ title: "My products | SilverHands" },
		{
			name: "description",
			content: "List handmade products with AI-written descriptions and suggested pricing."
		},
		{
			property: "og:title",
			content: "My products | SilverHands"
		},
		{
			property: "og:description",
			content: "List handmade products with AI assistance."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./seller.profile-DFQ9b-Qs.mjs");
var Route$3 = createFileRoute("/seller/profile")({
	head: () => ({ meta: [
		{ title: "Seller profile | SilverHands" },
		{
			name: "description",
			content: "Build a profile that shows your experience, languages and craft."
		},
		{
			property: "og:title",
			content: "Seller profile | SilverHands"
		},
		{
			property: "og:description",
			content: "Show buyers your experience, languages and craft."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./seller.services-CdQe7GQW.mjs");
var Route$2 = createFileRoute("/seller/services")({
	head: () => ({ meta: [
		{ title: "My services | SilverHands" },
		{
			name: "description",
			content: "Create and manage the services you offer, with AI pricing suggestions."
		},
		{
			property: "og:title",
			content: "My services | SilverHands"
		},
		{
			property: "og:description",
			content: "Create and manage the services you offer."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./buyer.product._id-BwlHn6gS.mjs");
var Route$1 = createFileRoute("/buyer/product/$id")({
	loader: ({ params }) => {
		const product = products.find((p) => p.id === params.id);
		if (!product) throw notFound();
		return { product };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Product unavailable | SilverHands" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { product } = loaderData;
		const description = `${product.name} by ${product.seller} — ${inr(product.price)}, handmade in small batches.`;
		return { meta: [
			{ title: `${product.name} | SilverHands` },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: `${product.name} | SilverHands`
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./buyer.service._id-B-2NGoXG.mjs");
var Route = createFileRoute("/buyer/service/$id")({
	loader: ({ params }) => {
		const service = services.find((s) => s.id === params.id);
		if (!service) throw notFound();
		return { service };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Service unavailable | SilverHands" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { service } = loaderData;
		const description = `${service.title} by ${service.seller} — ${inr(service.price)} ${service.unit} in ${service.location}.`;
		return { meta: [
			{ title: `${service.title} | SilverHands` },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: `${service.title} | SilverHands`
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var BuyerRoute = Route$23.update({
	id: "/buyer",
	path: "/buyer",
	getParentRoute: () => Route$25
});
var LoginRoute = Route$22.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$25
});
var SellerRoute = Route$21.update({
	id: "/seller",
	path: "/seller",
	getParentRoute: () => Route$25
});
var ApiAdvisorRoute = Route$20.update({
	id: "/api/advisor",
	path: "/api/advisor",
	getParentRoute: () => Route$25
});
var ApiAdvisorChatRoute = Route$19.update({
	id: "/api/advisor-chat",
	path: "/api/advisor-chat",
	getParentRoute: () => Route$25
});
var BuyerIndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => BuyerRoute
});
var BuyerFavoritesRoute = Route$17.update({
	id: "/favorites",
	path: "/favorites",
	getParentRoute: () => BuyerRoute
});
var BuyerMessagesRoute = Route$16.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => BuyerRoute
});
var BuyerProductsRoute = Route$15.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => BuyerRoute
});
var BuyerProfileRoute = Route$14.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => BuyerRoute
});
var BuyerServicesRoute = Route$13.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => BuyerRoute
});
var ElderCallbackRoute = Route$12.update({
	id: "/elder/callback",
	path: "/elder/callback",
	getParentRoute: () => Route$25
});
var SellerIndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => SellerRoute
});
var SellerAiAdvisorRoute = Route$10.update({
	id: "/ai-advisor",
	path: "/ai-advisor",
	getParentRoute: () => SellerRoute
});
var SellerAnalyticsRoute = Route$9.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => SellerRoute
});
var SellerInterviewRoute = Route$8.update({
	id: "/interview",
	path: "/interview",
	getParentRoute: () => SellerRoute
});
var SellerMessagesRoute = Route$7.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => SellerRoute
});
var SellerOnboardingRoute = Route$6.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => SellerRoute
});
var SellerOrdersRoute = Route$5.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => SellerRoute
});
var SellerProductsRoute = Route$4.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => SellerRoute
});
var SellerProfileRoute = Route$3.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => SellerRoute
});
var SellerServicesRoute = Route$2.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => SellerRoute
});
var BuyerRouteChildren = {
	BuyerFavoritesRoute,
	BuyerMessagesRoute,
	BuyerProductsRoute,
	BuyerProfileRoute,
	BuyerServicesRoute,
	BuyerIndexRoute,
	BuyerProductIdRoute: Route$1.update({
		id: "/product/$id",
		path: "/product/$id",
		getParentRoute: () => BuyerRoute
	}),
	BuyerServiceIdRoute: Route.update({
		id: "/service/$id",
		path: "/service/$id",
		getParentRoute: () => BuyerRoute
	})
};
var BuyerRouteWithChildren = BuyerRoute._addFileChildren(BuyerRouteChildren);
var SellerRouteChildren = {
	SellerAiAdvisorRoute,
	SellerAnalyticsRoute,
	SellerInterviewRoute,
	SellerMessagesRoute,
	SellerOnboardingRoute,
	SellerOrdersRoute,
	SellerProductsRoute,
	SellerProfileRoute,
	SellerServicesRoute,
	SellerIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	BuyerRoute: BuyerRouteWithChildren,
	LoginRoute,
	SellerRoute: SellerRoute._addFileChildren(SellerRouteChildren),
	ApiAdvisorRoute,
	ApiAdvisorChatRoute,
	ElderCallbackRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route$15 as a, inr as c, services as d, Route$13 as i, products as l, Route as n, categories as o, Route$1 as r, categoryImages as s, router_exports as t, reviews as u };
