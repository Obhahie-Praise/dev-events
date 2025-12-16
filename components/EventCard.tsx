import { CalendarDays, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />

      <div className="flex items-center flex-row gap-2 ">
        <MapPin width={14} height={14} className="text-neutral-400" />
        <p className="">{location }</p>

        <div className="datetime">
            <CalendarDays width={14} height={14} className="text-neutral-400" />
            <p className="">{date}</p>
        </div>
        <div className="datetime ml-4">
            <Clock width={14} height={14} className="text-neutral-400" />
            <p className="">{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
