import { IEvent } from "@/database/event.model";
import { IEventCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

const EventCard = ({
  title,
  location,
  slug,
  time,
  image,
  date,
  organizer,
  overview,
  // overwrite,
  mode,
  audience,
  agenda,
  tags,
  createdAt,
  updatedAt,
  venue,

}: IEventCardProps) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <div className="flex gap-2">
        <Image src={"/icons/pin.svg"} width={14} height={14} alt="location" />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>
      <div className="datetime">
        <div>
          <Image
            src={"/icons/calendar.svg"}
            width={14}
            height={14}
            alt="date"
          />
          <p>{date}</p>
        </div>
        <div>
          <Image src={"/icons/clock.svg"} width={14} height={14} alt="time" />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
