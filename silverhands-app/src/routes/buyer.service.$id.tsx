import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarCheck, Clock, Globe, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button";
import { inr, reviews, services } from "@/lib/data";
import { useFormatPrice } from "@/lib/currency";

export const Route = createFileRoute("/buyer/service/$id")({
  loader: ({ params }) => {
    const service = services.find((s) => s.id === params.id);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service unavailable | SilverHands" }, { name: "robots", content: "noindex" }],
      };
    }
    const { service } = loaderData;
    const description = `${service.title} by ${service.seller} — ${inr(service.price)} ${service.unit} in ${service.location}.`;
    return {
      meta: [
        { title: `${service.title} | SilverHands` },
        { name: "description", content: description },
        { property: "og:title", content: `${service.title} | SilverHands` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const formatPrice = useFormatPrice();

  return (
    <article className="space-y-12">
      <Link to="/buyer/services" className="text-sm font-medium text-primary hover:underline">
        ← Back to services
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <div className="overflow-hidden rounded-3xl shadow-soft">
            <img
              src={service.image}
              alt={service.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {service.category}
            </p>
            <h1 className="mt-3 text-4xl leading-tight lg:text-5xl">{service.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
              <Stars rating={service.rating} reviews={service.reviews} />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden /> {service.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden /> {service.delivery}
              </span>
            </div>
          </header>

          <section className="surface p-8">
            <h2 className="text-2xl">About {service.seller}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{service.about}</p>
            <dl className="mt-6 grid gap-5 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-muted-foreground">Experience</dt>
                <dd className="font-semibold">{service.experience}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Languages</dt>
                <dd className="inline-flex items-center gap-2 font-semibold">
                  <Globe className="size-4 text-primary" aria-hidden />
                  {service.languages.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Availability</dt>
                <dd className="font-semibold">{service.delivery}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="text-2xl">Portfolio</h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <img
                  key={i}
                  src={service.image}
                  alt={`Work sample ${i + 1} by ${service.seller}`}
                  loading="lazy"
                  className="aspect-square rounded-2xl object-cover shadow-soft"
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl">Reviews</h2>
            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="surface p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{r.author}</p>
                    <span className="text-sm text-muted-foreground">{r.date}</span>
                  </div>
                  <Stars rating={r.rating} className="mt-1" />
                  <p className="mt-2 text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="surface space-y-5 p-8">
            <p className="text-3xl font-semibold">
              {formatPrice(service.price)}{" "}
              <span className="text-base font-normal text-muted-foreground">{service.unit}</span>
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Free consultation before booking</li>
              <li>Cancel up to 24 hours in advance</li>
              <li>Payment released after completion</li>
            </ul>
            <Button
              size="xl"
              variant="gold"
              className="w-full"
              onClick={() => toast.success("Booking request sent", { description: service.seller + " will confirm shortly." })}
            >
              <CalendarCheck /> Book this service
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link to="/buyer/messages">Message {service.seller.split(" ")[0]}</Link>
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}
