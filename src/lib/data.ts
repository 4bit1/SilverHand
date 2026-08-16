import food from "@/assets/cat-food.jpg";
import craft from "@/assets/cat-craft.jpg";
import tailoring from "@/assets/cat-tailoring.jpg";
import tutoring from "@/assets/cat-tutoring.jpg";
import garden from "@/assets/cat-garden.jpg";
import music from "@/assets/cat-music.jpg";

export const categoryImages = { food, craft, tailoring, tutoring, garden, music };

const pics = [food, craft, tailoring, tutoring, garden, music];

/* ------------------------------------------------------------------ *
 * Deterministic pseudo-random helper so demo data is stable across
 * server render and client hydration.
 * ------------------------------------------------------------------ */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const rnd = seeded(20240817);
const pick = <T,>(arr: T[], i: number) => arr[i % arr.length] as T;

export type Category = { name: string; image: string; count: number };

export const categories: Category[] = [
  { name: "Homemade Food", image: food, count: 214 },
  { name: "Tailoring", image: tailoring, count: 138 },
  { name: "Handicrafts", image: craft, count: 302 },
  { name: "Tutoring", image: tutoring, count: 176 },
  { name: "Language Training", image: tutoring, count: 84 },
  { name: "Gardening", image: garden, count: 61 },
  { name: "Childcare", image: food, count: 47 },
  { name: "Traditional Arts", image: craft, count: 119 },
  { name: "Music Lessons", image: music, count: 93 },
  { name: "Consulting", image: tutoring, count: 58 },
];

const categoryImage: Record<string, string> = {
  "Homemade Food": food,
  Tailoring: tailoring,
  Handicrafts: craft,
  Tutoring: tutoring,
  "Language Training": tutoring,
  Gardening: garden,
  Childcare: food,
  "Traditional Arts": craft,
  "Music Lessons": music,
  Consulting: tutoring,
};

/* ----------------------------- Sellers ---------------------------- */

export type Seller = {
  id: string;
  name: string;
  age: number;
  role: string;
  avatar: string;
  cover: string;
  location: string;
  about: string;
  skills: string[];
  languages: string[];
  experience: string;
  rating: number;
  reviews: number;
  joined: string;
  responseTime: string;
};

const sellerSeed: Array<[string, number, string, string, string, string[], string[]]> = [
  ["Anjali Sen", 62, "Homemaker & Cook", "Salt Lake, Kolkata", "Homemade Food", ["Bengali cuisine", "Pickling", "Tiffin planning"], ["Bengali", "Hindi", "English"]],
  ["Meera Iyer", 58, "Master Tailor", "T. Nagar, Chennai", "Tailoring", ["Blouse stitching", "Saree falls", "Hand finishing"], ["Tamil", "English"]],
  ["Dr. R. Krishnan", 68, "Retired Professor", "Jayanagar, Bengaluru", "Tutoring", ["Mathematics", "Physics", "Exam coaching"], ["English", "Kannada", "Hindi"]],
  ["Vikram Joshi", 71, "Classical Musician", "Kothrud, Pune", "Music Lessons", ["Sitar", "Raag theory", "Taal"], ["Marathi", "Hindi", "English"]],
  ["Suresh Nair", 65, "Horticulturist", "Panampilly Nagar, Kochi", "Gardening", ["Balcony gardens", "Composting", "Grafting"], ["Malayalam", "English"]],
  ["Elena Fernandes", 66, "Retired Diplomat", "Panjim, Goa", "Language Training", ["Spanish", "Portuguese", "Public speaking"], ["Spanish", "English", "Konkani"]],
  ["Kamala Devi", 69, "Traditional Weaver", "Bhuj, Gujarat", "Handicrafts", ["Pit-loom weaving", "Natural dyes", "Kantha"], ["Gujarati", "Hindi"]],
  ["Lakshmi Devi", 57, "Home Chef", "Madhapur, Hyderabad", "Homemade Food", ["Andhra snacks", "Podis", "Sweets"], ["Telugu", "Hindi", "English"]],
  ["Raman Sir", 64, "Retired Teacher", "Mylapore, Chennai", "Tutoring", ["Mathematics", "Board revision", "Vedic maths"], ["Tamil", "English"]],
  ["Sudha Menon", 60, "Embroidery Artisan", "Thrissur, Kerala", "Traditional Arts", ["Aari work", "Zardozi", "Mirror work"], ["Malayalam", "Tamil", "English"]],
  ["Harbans Kaur", 67, "Home Baker", "Model Town, Amritsar", "Homemade Food", ["Punjabi breads", "Preserves", "Festive boxes"], ["Punjabi", "Hindi"]],
  ["Prakash Deshmukh", 70, "Retired Accountant", "Nagpur", "Consulting", ["Tax filing", "Small-business books", "GST"], ["Marathi", "Hindi", "English"]],
  ["Fatima Sheikh", 55, "Childcare Specialist", "Bandra, Mumbai", "Childcare", ["Infant care", "Storytelling", "Montessori play"], ["Urdu", "Hindi", "English"]],
  ["Gopal Rao", 72, "Potter", "Bhimavaram, Andhra Pradesh", "Handicrafts", ["Wheel throwing", "Terracotta", "Glazing"], ["Telugu", "Hindi"]],
  ["Nirmala Joshi", 61, "Yoga Teacher", "Rishikesh, Uttarakhand", "Consulting", ["Hatha yoga", "Pranayama", "Senior mobility"], ["Hindi", "English"]],
  ["Abdul Rahman", 66, "Calligrapher", "Charminar, Hyderabad", "Traditional Arts", ["Urdu calligraphy", "Framing", "Gold leaf"], ["Urdu", "Telugu", "English"]],
  ["Sarita Pillai", 59, "Language Coach", "Vashi, Navi Mumbai", "Language Training", ["Spoken English", "Interview prep", "Phonetics"], ["Marathi", "Hindi", "English"]],
  ["Joseph Mathew", 68, "Retired Engineer", "Kottayam, Kerala", "Tutoring", ["Physics", "Robotics club", "Science fairs"], ["Malayalam", "English"]],
  ["Bhavna Trivedi", 63, "Handloom Designer", "Ahmedabad", "Handicrafts", ["Block printing", "Bandhani", "Stoles"], ["Gujarati", "Hindi", "English"]],
  ["Mohan Bhatt", 74, "Vocalist", "Jaipur", "Music Lessons", ["Hindustani vocal", "Bhajan", "Harmonium"], ["Hindi", "Rajasthani"]],
];

export const sellers: Seller[] = sellerSeed.map(([name, age, role, location, cat, skills, languages], i) => ({
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
  experience: `${20 + (i % 25)} years of practice`,
  rating: Number((4.5 + rnd() * 0.5).toFixed(1)),
  reviews: 30 + Math.floor(rnd() * 220),
  joined: `Member since 20${14 + (i % 10)}`,
  responseTime: pick(["Usually replies within an hour", "Replies same day", "Replies within 2 hours"], i),
}));

export const sellerById = (id: string) => sellers.find((s) => s.id === id);

/* ----------------------------- Services --------------------------- */

export type Service = {
  id: string;
  title: string;
  sellerId: string;
  seller: string;
  sellerAge: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  unit: string;
  location: string;
  category: string;
  about: string;
  languages: string[];
  experience: string;
  delivery: string;
  availability: string;
};

const serviceSeed: Array<[string, string, number, string]> = [
  ["Home-cooked Bengali thali, delivered daily", "Homemade Food", 180, "per meal"],
  ["Bespoke blouse and saree fall stitching", "Tailoring", 450, "per piece"],
  ["Retired professor: Mathematics tutoring, Class 8–12", "Tutoring", 700, "per hour"],
  ["Classical sitar lessons for beginners", "Music Lessons", 900, "per session"],
  ["Balcony kitchen-garden setup and monthly care", "Gardening", 1200, "per visit"],
  ["Conversational Spanish with a retired diplomat", "Language Training", 850, "per hour"],
  ["Andhra tiffin subscription, breakfast delivered", "Homemade Food", 150, "per meal"],
  ["Festive sweet boxes made to order", "Homemade Food", 950, "per box"],
  ["School uniform alterations and repairs", "Tailoring", 120, "per piece"],
  ["Kurta and salwar tailoring with fitting", "Tailoring", 700, "per piece"],
  ["Physics coaching for Class 11 and 12", "Tutoring", 650, "per hour"],
  ["Vedic maths crash course for young learners", "Tutoring", 500, "per hour"],
  ["Spoken English and interview preparation", "Language Training", 600, "per hour"],
  ["Hindi reading and writing for beginners", "Language Training", 400, "per hour"],
  ["Hindustani vocal training, gurukul style", "Music Lessons", 800, "per session"],
  ["Harmonium basics for absolute beginners", "Music Lessons", 550, "per session"],
  ["Terrace vegetable garden consultation", "Gardening", 900, "per visit"],
  ["Monthly plant care and repotting service", "Gardening", 700, "per visit"],
  ["After-school childcare with homework help", "Childcare", 300, "per hour"],
  ["Infant care support for new parents", "Childcare", 400, "per hour"],
  ["Aari embroidery workshop at your home", "Traditional Arts", 1500, "per session"],
  ["Urdu calligraphy lessons and commissions", "Traditional Arts", 1100, "per session"],
  ["Block printing workshop for small groups", "Traditional Arts", 1300, "per session"],
  ["Income tax filing for salaried individuals", "Consulting", 1500, "per filing"],
  ["Bookkeeping for home businesses", "Consulting", 2500, "per month"],
  ["Gentle yoga for seniors, at home", "Consulting", 600, "per session"],
  ["Pottery wheel introduction class", "Handicrafts", 1200, "per session"],
  ["Custom handloom stole weaving on order", "Handicrafts", 2200, "per piece"],
  ["Pickle and preserve making masterclass", "Homemade Food", 1000, "per session"],
  ["Storytelling sessions for children", "Childcare", 350, "per hour"],
];

export const services: Service[] = serviceSeed.map(([title, category, price, unit], i) => {
  const seller = pick(
    sellers.filter((s) => s.skills.length > 0),
    i * 3 + (i % 5),
  );
  return {
    id: `s${i + 1}`,
    title,
    sellerId: seller.id,
    seller: seller.name,
    sellerAge: `${seller.age} · ${seller.role}`,
    image: categoryImage[category] ?? pick(pics, i),
    rating: Number((4.4 + rnd() * 0.6).toFixed(1)),
    reviews: 18 + Math.floor(rnd() * 200),
    price,
    unit,
    location: seller.location,
    category,
    about: `${title} — offered personally by ${seller.name}, drawing on ${seller.experience.toLowerCase()}. Timings are flexible and every booking begins with a short call.`,
    languages: seller.languages,
    experience: seller.experience,
    delivery: pick(["Same day, before 1 PM", "Within 3 days", "Flexible weekday evenings", "Twice weekly, 60 minutes", "4–6 days"], i),
    availability: pick(["Mon–Sat, 9am–6pm", "Weekday evenings", "Weekends only", "Mon–Fri, 10am–5pm"], i),
  };
});

/* ----------------------------- Products --------------------------- */

export type Product = {
  id: string;
  name: string;
  sellerId: string;
  seller: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  category: string;
  stock: number;
  description: string;
  delivery: string;
};

const productSeed: Array<[string, string, number]> = [
  ["Handwoven cotton throw, olive fringe", "Handicrafts", 2400],
  ["Small-batch mango & jaggery preserve", "Homemade Food", 420],
  ["Hand-embroidered linen cushion cover", "Traditional Arts", 1150],
  ["Terracotta herb planter set of three", "Gardening", 980],
  ["Andhra gunpowder podi, 250g", "Homemade Food", 260],
  ["Ghee-roasted cashew mysore pak box", "Homemade Food", 640],
  ["Punjabi mixed vegetable pickle, 500g", "Homemade Food", 380],
  ["Sun-dried tomato & chilli chutney", "Homemade Food", 310],
  ["Millet laddoo box, sugar-free", "Homemade Food", 520],
  ["Bandhani cotton dupatta, indigo", "Handicrafts", 1800],
  ["Block-printed table runner", "Handicrafts", 1250],
  ["Hand-thrown stoneware mug, pair", "Handicrafts", 1450],
  ["Jute and cotton floor mat", "Handicrafts", 2100],
  ["Kantha stitched quilt, single bed", "Handicrafts", 4600],
  ["Handloom cotton stole, undyed", "Handicrafts", 1700],
  ["Aari work potli bag", "Traditional Arts", 1350],
  ["Zardozi framed wall panel", "Traditional Arts", 5200],
  ["Urdu calligraphy print, gold leaf", "Traditional Arts", 2900],
  ["Mirror-work cushion set of two", "Traditional Arts", 2250],
  ["Warli painting on handmade paper", "Traditional Arts", 1600],
  ["Cotton kurta, hand-stitched", "Tailoring", 1900],
  ["Custom saree blouse, ready to wear", "Tailoring", 1100],
  ["Quilted cotton jacket, reversible", "Tailoring", 2700],
  ["School uniform repair kit", "Tailoring", 350],
  ["Tulsi and mint sapling duo", "Gardening", 450],
  ["Vermicompost pack, 5kg", "Gardening", 390],
  ["Hanging coir planter, set of four", "Gardening", 860],
  ["Brass watering can, hand-beaten", "Gardening", 1550],
  ["Beginner's tabla practice pad", "Music Lessons", 1250],
  ["Illustrated raag workbook for children", "Music Lessons", 480],
];

export const products: Product[] = productSeed.map(([name, category, price], i) => {
  const seller = pick(sellers, i * 7 + 3);
  return {
    id: `p${i + 1}`,
    name,
    sellerId: seller.id,
    seller: seller.name,
    image: categoryImage[category] ?? pick(pics, i),
    rating: Number((4.3 + rnd() * 0.7).toFixed(1)),
    reviews: 12 + Math.floor(rnd() * 160),
    price,
    category,
    stock: 3 + Math.floor(rnd() * 30),
    description: `${name} — made in small batches by ${seller.name} in ${seller.location}. No shortcuts, no machines where hands will do, and every piece checked before it is packed.`,
    delivery: pick(["Ships in 3 days · Free above ₹1,500", "Ships in 2 days", "Ships in 4 days", "Ships in 5 days"], i),
  };
});

/* ----------------------------- Reviews ---------------------------- */

export type Review = {
  id: string;
  targetId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

const reviewAuthors = [
  "Priya M.", "Arjun T.", "Nisha R.", "Kabir S.", "Divya N.", "Rohit P.", "Sneha K.",
  "Imran Q.", "Ananya B.", "Vivek D.", "Meghna A.", "Rahul V.", "Farah I.", "Sanjay G.",
  "Pooja L.", "Tarun C.", "Ritika J.", "Aditya H.", "Kavya S.", "Manish W.",
];

const reviewTexts = [
  "Genuinely the warmest experience I've had on any marketplace. Everything arrived early and beautifully packed.",
  "Communication was clear and patient throughout. I've already booked again for next month.",
  "Lovely craftsmanship and fair pricing. Delivery took a day longer than expected, which was fine.",
  "Exactly as described, and the little handwritten note made my week.",
  "My children look forward to every session now. Highly recommended.",
  "Quality you simply cannot find in a shop. Worth every rupee.",
  "Very accommodating with my requests and timings. Thank you!",
  "Packaging was thoughtful and plastic-free. Will order again.",
  "Great value and genuine care in the work. A few days' wait, but worth it.",
  "Professional, punctual and extremely knowledgeable.",
];

const targets = [...services.map((s) => s.id), ...products.map((p) => p.id), ...sellers.map((s) => s.id)];

export const seedReviews: Review[] = Array.from({ length: 100 }, (_, i) => ({
  id: `r${i + 1}`,
  targetId: pick(targets, i * 5 + 1),
  author: pick(reviewAuthors, i * 3),
  rating: 4 + (i % 5 === 0 ? 0 : 1),
  text: pick(reviewTexts, i * 2 + 1),
  date: pick(["2 weeks ago", "1 month ago", "2 months ago", "5 days ago", "3 weeks ago"], i),
}));

/** Legacy alias kept for existing imports. */
export const reviews = seedReviews.slice(0, 3);

/* --------------------------- Conversations ------------------------ */

export type Message = { id: string; from: "buyer" | "seller"; text: string; time: string };
export type Conversation = {
  id: string;
  sellerId: string;
  buyerName: string;
  messages: Message[];
};

const convoStarters: Array<[string, string, string]> = [
  ["Namaste! Do you deliver the thali to Salt Lake sector 5?", "Yes, I deliver there every day before 1 PM.", "Perfect, please start from Monday."],
  ["Could you stitch a blouse from my own fabric?", "Of course — bring the fabric and I'll take measurements.", "Wonderful, I'll come Saturday."],
  ["Is there a slot free for Class 10 maths on weekends?", "Saturday 4 PM is open from next week.", "Please book it for my daughter."],
  ["How long before a beginner can play a simple raag?", "About three months with regular practice.", "That's encouraging, thank you."],
  ["My balcony gets only morning sun — will herbs grow?", "Yes, mint and curry leaf do very well there.", "Let's plan a visit then."],
  ["Do you teach Spanish to complete beginners?", "Absolutely, we start with everyday conversation.", "Sign me up for Tuesdays."],
  ["Can the quilt be made in indigo instead?", "Yes, I have indigo yarn dyed last month.", "Please go ahead."],
  ["Is the pickle less spicy version available?", "I can prepare a mild batch for you.", "Thank you so much!"],
  ["Do you offer trial classes before booking?", "Yes, the first session is free.", "Great, this Friday works."],
  ["Would you take a bulk order of 20 gift boxes?", "Yes, with a week's notice.", "Placing the order today."],
];

export const seedConversations: Conversation[] = convoStarters.map(([a, b, c], i) => ({
  id: `c${i + 1}`,
  sellerId: pick(sellers, i).id,
  buyerName: pick(["Priya Menon", "Arjun Thomas", "Nisha Rao", "Kabir Shah", "Divya Nair"], i),
  messages: [
    { id: `c${i + 1}m1`, from: "buyer", text: a, time: "10:02" },
    { id: `c${i + 1}m2`, from: "seller", text: b, time: "10:14" },
    { id: `c${i + 1}m3`, from: "buyer", text: c, time: "10:20" },
  ],
}));

/* ------------------------------ Orders ---------------------------- */

export type Order = {
  id: string;
  buyer: string;
  item: string;
  amount: number;
  status: "To dispatch" | "Shipped" | "Completed" | "Placed";
  date: string;
};

export const seedOrders: Order[] = [
  { id: "SH-1042", buyer: "Priya Menon", item: "Handwoven cotton throw", amount: 2400, status: "To dispatch", date: "12 Aug 2026" },
  { id: "SH-1041", buyer: "Arjun Thomas", item: "Mango & jaggery preserve × 2", amount: 840, status: "Shipped", date: "10 Aug 2026" },
  { id: "SH-1039", buyer: "Nisha Rao", item: "Bengali thali, weekly plan", amount: 1260, status: "Completed", date: "6 Aug 2026" },
  { id: "SH-1036", buyer: "Kabir Shah", item: "Kantha cushion cover", amount: 1150, status: "Completed", date: "2 Aug 2026" },
  { id: "SH-1031", buyer: "Divya Nair", item: "Terracotta herb planter set", amount: 980, status: "Completed", date: "28 Jul 2026" },
  { id: "SH-1027", buyer: "Rohit Pillai", item: "Bandhani cotton dupatta", amount: 1800, status: "Completed", date: "21 Jul 2026" },
];

/* --------------------------- Seller stats ------------------------- */

export const sellerStats = {
  revenue: 184500,
  orders: 126,
  views: 3482,
  messages: 48,
  rating: 4.9,
  listings: services.length + products.length,
};

export const monthlyEarnings = [
  { month: "Mar", earnings: 18400, views: 1820 },
  { month: "Apr", earnings: 22100, views: 2140 },
  { month: "May", earnings: 26800, views: 2460 },
  { month: "Jun", earnings: 31200, views: 2880 },
  { month: "Jul", earnings: 38400, views: 3120 },
  { month: "Aug", earnings: 47600, views: 3482 },
];

/* ------------------------- Starter demo state --------------------- */

export const seedCart = [
  { id: "p2", qty: 2 },
  { id: "p10", qty: 1 },
];

export const seedFavorites = ["s1", "s4", "p1", "p14"];

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
