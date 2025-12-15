export type Event = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string; // ISO or human-readable date
  time: string; // human-readable time
  description?: string;
  url?: string;
};

export const events: Event[] = [
  {
    title: "React Summit",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, NL",
    date: "2026-03-11",
    time: "09:00 - 18:00",
    description: "A premier React conference with workshops and talks from core team members.",
    url: "https://reactsummit.com/"
  },
  {
    title: "Next.js Conf",
    image: "/images/event-full.png",
    slug: "nextjs-conf-2026",
    location: "Online",
    date: "2026-04-22",
    time: "10:00 - 17:00 (UTC)",
    description: "Official Next.js conference: announcements, case studies, and deep dives.",
    url: "https://nextjs.org/conf"
  },
  {
    title: "GraphQL Summit",
    image: "/images/event2.png",
    slug: "graphql-summit-2026",
    location: "San Francisco, CA",
    date: "2026-05-06",
    time: "09:30 - 17:30",
    description: "A gathering for the GraphQL community covering federation, tooling, and scale.",
    url: "https://summit.graphql.org/"
  },
  {
    title: "JSConf EU",
    image: "/images/event3.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, DE",
    date: "2026-06-14",
    time: "09:00 - 18:00",
    description: "Independent JavaScript conference with a broad community-driven program.",
    url: "https://jsconf.eu/"
  },
  {
    title: "Open Source Hackathon",
    image: "/images/event4.png",
    slug: "open-source-hack-2026",
    location: "Remote",
    date: "2026-02-28",
    time: "00:00 - 23:59 (UTC)",
    description: "48-hour community hackathon focused on improving open-source projects.",
    url: "https://example.org/oss-hackathon"
  },
  {
    title: "PyData Conference",
    image: "/images/event5.png",
    slug: "pydata-2026",
    location: "New York, NY",
    date: "2026-09-09",
    time: "09:00 - 17:00",
    description: "Talks and tutorials on data science, machine learning, and Python tooling.",
    url: "https://pydata.org/"
  },
  {
    title: "Dev Meetup: Cloud Native",
    image: "/images/event6.png",
    slug: "cloud-native-meetup-2026",
    location: "Austin, TX",
    date: "2026-01-25",
    time: "18:30 - 21:00",
    description: "Local meetup covering cloud-native tools, Kubernetes, and service mesh.",
    url: "https://meetup.com/cloud-native"
  }
];

export default events;
