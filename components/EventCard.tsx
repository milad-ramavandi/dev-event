import { IEventCardProps } from "@/types";
import Link from "next/link";
import ImageKit from "./ImageKit";
import Image from "next/image";

const EventCard = ({
  title,
  location,
  slug,
  time,
  image,
  date,
}: IEventCardProps) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <div className="relative w-full h-75 rounded-lg overflow-hidden">
        <ImageKit
          src={image as string}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex gap-2 items-center">
        <Image
          src={"/icons/pin.svg"}
          width={14}
          height={14}
          alt="location"
          className="w-3.5 h-3.5"
        />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>
      <div className="datetime">
        <div className="flex items-center">
          <Image
            src={"/icons/calendar.svg"}
            width={14}
            height={14}
            alt="date"
            className="w-3.5 h-3.5"
          />
          <p>{date}</p>
        </div>
        <div className="flex items-center">
          <Image
            src={"/icons/clock.svg"}
            width={14}
            height={14}
            alt="time"
            className="w-3.5 h-3.5"
          />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
