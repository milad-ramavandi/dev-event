import getSimilarEventsBySlug from "@/actions/event";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import Image from "next/image";
import { notFound } from "next/navigation";

export const instant = false;

const EventPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  let event;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/events/${slug}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) {
      if (res.status === 404) {
        return notFound();
      }
      throw new Error(`Failed to fetch event: ${res.statusText}`);
    }

    const data = await res.json();
    event = data.event;

    if (!event) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    return notFound();
  }
  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
    bookings,
  } = event;
  const simillarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        <div className="content">
          <img
            src={image}
            width={800}
            height={800}
            className="banner"
            alt="Event Banner"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <div className="flex-row-gap-2 items-center">
              <Image
                src={"/icons/calendar.svg"}
                alt="calendar"
                width={17}
                height={17}
              />
              <p>{date}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image
                src={"/icons/clock.svg"}
                alt="time"
                width={17}
                height={17}
              />
              <p>{time}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image
                src={"/icons/pin.svg"}
                alt="location"
                width={17}
                height={17}
              />
              <p>{location}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image
                src={"/icons/mode.svg"}
                alt="mode"
                width={17}
                height={17}
              />
              <p>{mode}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image
                src={"/icons/audience.svg"}
                alt="audience"
                width={17}
                height={17}
              />
              <p>{audience}</p>
            </div>
          </section>
          <section>
            <div className="agenda">
              <h2>Agenda</h2>
              <ul>
                {agenda.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
          <section className="flex-col-gap-2">
            <h2>About to Organizer</h2>
            <p>{organizer}</p>
          </section>
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((item: string) => (
              <div className="pill" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <aside className="booking">
          <section className="signup-card">
            <h2>Book Your Spot</h2>
            {Number(bookings) > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            <BookEvent eventId={event._id} />
          </section>
        </aside>
      </div>
      <section className="flex flex-col w-full gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {simillarEvents &&
            simillarEvents.length > 0 &&
            simillarEvents.map((item) => (
              <EventCard key={item.title} {...item} />
            ))}
        </div>
      </section>
    </section>
  );
};

export default EventPage;
