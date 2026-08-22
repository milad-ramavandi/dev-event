import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
import { cacheLife, cacheTag } from "next/cache";

const HomePage = async () => {
  "use cache";
  cacheLife("days");
  cacheTag("events");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/events`);
  const { events } = await res.json();
  return (
    <section>
      <h1 className="text-center text-4xl sm:text-5xl md:text-6xl">
        The Hub for Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferneces, All in One Place
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7" id="events">
        <h3>Featured Events</h3>
        <div className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => <EventCard key={String(event._id)} {...event} />)}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
