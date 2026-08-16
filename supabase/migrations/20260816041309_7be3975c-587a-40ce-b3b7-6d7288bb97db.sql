CREATE TABLE public.experts (
  id text PRIMARY KEY,
  name text NOT NULL,
  initials text NOT NULL,
  age integer,
  city text NOT NULL,
  primary_skill text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0,
  experience_note text NOT NULL DEFAULT '',
  languages text[] NOT NULL DEFAULT '{}',
  verified boolean NOT NULL DEFAULT false,
  bio text NOT NULL DEFAULT '',
  price_cents integer NOT NULL DEFAULT 0,
  availability_note text NOT NULL DEFAULT '',
  rating numeric(2,1),
  reviews_count integer NOT NULL DEFAULT 0,
  services jsonb NOT NULL DEFAULT '[]'::jsonb,
  tutorials jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.experts TO anon;
GRANT SELECT ON public.experts TO authenticated;
GRANT ALL ON public.experts TO service_role;

ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expert directory is public" ON public.experts FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_experts_updated_at BEFORE UPDATE ON public.experts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.experts (id, name, initials, age, city, primary_skill, skills, experience_years, experience_note, languages, verified, bio, price_cents, availability_note, rating, reviews_count, services, tutorials) VALUES
('margaret-olsen','Margaret Olsen','MO',64,'Portland, Oregon','Traditional Woodworking',ARRAY['Woodworking','Hand tools','Furniture restoration','Joinery','Workshop planning'],38,'38 years as a furniture maker and workshop teacher',ARRAY['English','Norwegian'],true,'I spent most of my life making chairs and tables by hand. These days I enjoy passing the craft on — patiently, and at whatever pace suits you.',4500,'Tuesdays & Fridays',4.9,42,
 '[{"id":"s1","name":"Furniture restoration","description":"Bring an old piece back to life — repairs, refinishing and honest advice on what is worth saving.","skill":"Woodworking","price":"$65 / hour","availability":"Weekday mornings"},{"id":"s2","name":"Workshop setup consulting","description":"Plan a safe, comfortable home workshop with the right tools for the work you actually do.","skill":"Workshop planning","price":"$120 flat","availability":"By arrangement"},{"id":"s3","name":"One-to-one hand-tool coaching","description":"Learn sharpening, joinery and layout at the bench, one step at a time.","skill":"Hand tools","price":"$45 / session","availability":"Tuesdays & Fridays"}]'::jsonb,
 '[{"id":"t1","title":"Sharpening a chisel the old way","description":"A calm, complete walkthrough of putting a working edge on a chisel with simple stones.","learnings":["Reading a bevel","Flattening the back","Honing a lasting edge"],"durationMin":24,"difficulty":"Beginner","priceCents":0,"thumbnailUrl":""},{"id":"t2","title":"Cutting a through dovetail by hand","description":"The joint that makes a drawer last a century, explained without rushing.","learnings":["Marking accurately","Sawing to a line","Paring to fit"],"durationMin":41,"difficulty":"Intermediate","priceCents":1900,"thumbnailUrl":""}]'::jsonb),
('lakshmi-iyer','Lakshmi Iyer','LI',67,'Chennai','Traditional South Indian Cooking',ARRAY['Traditional cooking','South Indian food','Home cooking','Fermentation','Spice blending'],42,'42 years cooking for family, weddings and a small tiffin kitchen',ARRAY['Tamil','English'],true,'I learned to cook at my grandmother''s side and never stopped. I teach the everyday dishes properly — batter, tempering, timing — so they work in your kitchen too.',1200,'Weekday mornings',4.8,63,
 '[{"id":"s1","name":"Everyday tiffin masterclass","description":"Idli, dosa and their batters, from soaking to the final crisp edge.","skill":"South Indian food","price":"₹900 / session","availability":"Weekday mornings"},{"id":"s2","name":"Festival menu planning","description":"Plan and cook a full traditional festival meal without panic.","skill":"Traditional cooking","price":"₹1,500 flat","availability":"By arrangement"}]'::jsonb,
 '[{"id":"t1","title":"A batter that ferments every time","description":"Ratios, water, weather and patience — the whole story.","learnings":["Rice to dal ratio","Reading fermentation","Storing batter"],"durationMin":28,"difficulty":"Beginner","priceCents":0,"thumbnailUrl":""},{"id":"t2","title":"Sambar, the way it is made at home","description":"Not the restaurant version — the one you eat every week.","learnings":["Roasting the powder","Balancing tamarind"],"durationMin":33,"difficulty":"Beginner","priceCents":900,"thumbnailUrl":""}]'::jsonb),
('anand-krishnan','Anand Krishnan','AK',58,'Chennai','Classical & Acoustic Guitar',ARRAY['Guitar','Music theory','Beginner guitar','Songwriting'],30,'30 years teaching guitar to beginners and late starters',ARRAY['Tamil','English','Hindi'],true,'I teach adults who were told they had missed the boat. You have not. We start with three chords and a song you actually like.',800,'Evenings, most days',4.7,88,
 '[{"id":"s1","name":"Absolute beginner guitar","description":"Holding, tuning, first chords and your first full song.","skill":"Beginner guitar","price":"₹600 / session","availability":"Evenings"},{"id":"s2","name":"Play-along coaching","description":"Bring a song, leave able to play it.","skill":"Guitar","price":"₹800 / session","availability":"Weekends"}]'::jsonb,
 '[{"id":"t1","title":"Your first three chords","description":"Slow, clear and repeatable — with fingers that hurt a little less.","learnings":["Clean chord shapes","Changing smoothly"],"durationMin":19,"difficulty":"Beginner","priceCents":0,"thumbnailUrl":""}]'::jsonb),
('rukmini-desai','Rukmini Desai','RD',71,'Pune','Organic Terrace Gardening',ARRAY['Gardening','Organic farming','Terrace gardening','Composting','Plant care'],35,'35 years growing food on a city terrace',ARRAY['Marathi','Hindi','English'],true,'My terrace feeds two households. I will help you start with five pots and keep them alive through the summer.',600,'Weekend mornings',4.9,51,
 '[{"id":"s1","name":"Start your terrace garden","description":"Pots, soil mix, sunlight and the first four crops that rarely fail.","skill":"Terrace gardening","price":"₹500 / session","availability":"Weekend mornings"},{"id":"s2","name":"Home composting setup","description":"A clean, odourless compost system for a flat.","skill":"Composting","price":"₹450 / session","availability":"By arrangement"}]'::jsonb,
 '[{"id":"t1","title":"A soil mix that actually drains","description":"The one thing most terrace gardens get wrong.","learnings":["Mixing your own soil","Choosing pots"],"durationMin":16,"difficulty":"Beginner","priceCents":0,"thumbnailUrl":""}]'::jsonb),
('george-mathew','George Mathew','GM',62,'Kochi','Film & Portrait Photography',ARRAY['Photography','Portrait photography','Film photography','Composition','Darkroom'],37,'37 years as a working portrait and press photographer',ARRAY['Malayalam','English'],true,'I photographed people for newspapers for most of my life. I can teach you to see light before you touch a setting.',1500,'Weekday afternoons',4.6,29,
 '[{"id":"s1","name":"Portrait light coaching","description":"Window light, one reflector, and honest portraits.","skill":"Portrait photography","price":"₹1,200 / session","availability":"Weekday afternoons"}]'::jsonb,
 '[{"id":"t1","title":"Reading light before you shoot","description":"A walk through five ordinary rooms and what each one does to a face.","learnings":["Direction of light","Soft vs hard"],"durationMin":22,"difficulty":"Beginner","priceCents":0,"thumbnailUrl":""}]'::jsonb),
('sunil-varma','Sunil Varma','SV',55,'Bengaluru','Personal Finance & Retirement Planning',ARRAY['Personal finance','Budgeting','Investing basics','Retirement planning','Tax basics'],28,'28 years in banking, now teaching households to plan',ARRAY['Kannada','English','Hindi'],true,'No products, no commissions. Just a clear look at what you earn, what you owe, and what you can safely set aside.',2000,'Weekday evenings',4.8,74,
 '[{"id":"s1","name":"Household budget review","description":"Sit down together and build a budget you will actually keep.","skill":"Budgeting","price":"₹1,500 / session","availability":"Weekday evenings"},{"id":"s2","name":"Retirement plan check","description":"Where you stand and what to change now.","skill":"Retirement planning","price":"₹2,000 / session","availability":"Weekends"}]'::jsonb,
 '[{"id":"t1","title":"Where your money actually goes","description":"A simple tracking method that survives real life.","learnings":["Tracking spend","Setting a floor"],"durationMin":26,"difficulty":"Beginner","priceCents":0,"thumbnailUrl":""}]'::jsonb),
('fatima-sheikh','Fatima Sheikh','FS',69,'Hyderabad','Hand Embroidery & Tailoring',ARRAY['Embroidery','Tailoring','Sewing','Zardozi','Garment repair'],45,'45 years of hand embroidery and bespoke tailoring',ARRAY['Urdu','Hindi','English'],false,'Needle, thread and time. I teach stitches that hold, and repairs that make a garment last another ten years.',700,'Most afternoons',4.7,36,
 '[{"id":"s1","name":"Learn six useful stitches","description":"The stitches that cover almost every repair and finish.","skill":"Sewing","price":"₹500 / session","availability":"Afternoons"}]'::jsonb,
 '[{"id":"t1","title":"Invisible mending","description":"Repair a tear so it disappears into the cloth.","learnings":["Matching thread","Darning neatly"],"durationMin":18,"difficulty":"Beginner","priceCents":0,"thumbnailUrl":""}]'::jsonb),
('harold-price','Harold Price','HP',74,'Bristol','Watch & Clock Repair',ARRAY['Watch repair','Clock repair','Mechanical restoration','Fine tools'],50,'50 years at the bench repairing mechanical movements',ARRAY['English'],true,'Mechanical things can nearly always be saved. I will show you how to open a movement without wrecking it.',5000,'By arrangement',5.0,18,
 '[{"id":"s1","name":"First service of a pocket watch","description":"Open, clean, oil and close a simple movement safely.","skill":"Watch repair","price":"£40 / session","availability":"By arrangement"}]'::jsonb,
 '[{"id":"t1","title":"Opening a case without a scratch","description":"Tools, grip and patience.","learnings":["Choosing a case knife","Handling parts"],"durationMin":14,"difficulty":"Beginner","priceCents":0,"thumbnailUrl":""}]'::jsonb);