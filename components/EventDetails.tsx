import { IEvent } from "@/database/event.model";
import ImageKit from "./ImageKit";
import Image from "next/image";
import BookEvent from "./BookEvent";
import EventCard from "./EventCard";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { IEventCardProps } from "@/types";



const getSimilarEvents = async (slug: string) => {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/events?similar_events=${slug}`,
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch similar events: ${res.statusText}`);
    }
    const { similarEvents } = await res.json();
    return similarEvents;
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

const EventDetails = async ({
  params,
  getEvent
}: {
  params: Promise<{ slug: string }>;
  getEvent: (slug:string) => Promise<IEvent>
}) => {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) {
    return notFound();
  }
  const {
    _id,
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

  const similarEvents = await getSimilarEvents(slug);
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        <div className="content">
          <ImageKit
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

            <BookEvent eventId={String(_id)} />
          </section>
        </aside>
      </div>
      <section className="flex flex-col w-full gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents &&
            similarEvents.length > 0 &&
            similarEvents.map((item: IEventCardProps) => (
              <EventCard key={item.title} {...item} />
            ))}
        </div>
      </section>
    </section>
  );
};

export default EventDetails;
