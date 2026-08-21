import EventDetails from "@/components/EventDetails";
import Loading from "@/components/Loading";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";

const getEvent = async (slug: string) => {
  "use cache";
  cacheTag(`events/${slug}`)
  cacheLife("hours");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/events/${slug}`,
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch event: ${res.statusText}`);
    }
    const data = await res.json();
    return data.event;
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const event = await getEvent(slug);
  const {
    description,
    image,
    title,
    tags,
  } = event;

  return {
    title: title + " " + "Event Post | Website",
    description:
      description +
      `Read ${title} on the  Website DevEvent. Stay updated with the latest Events.`,
    keywords: tags.join(", "),
    icons: [
      { rel: "icon", url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
      { rel: "shortcut icon", url: "/favicon.ico" },
    ],
    openGraph: {
      title: title,
      description:
        description +
        "Discover detailed events and updates from the  DevEvent team on various topics.",
      url: `https://blogs-dusky-nu.vercel.app/${slug}`,
      siteName: "blogs-dusky-nu.vercel.app",
      images: [
        {
          url:image,
          alt: title + "Event Image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description:
        description +
        "Explore detailed articles and updates from the DevEvent team.",
      images:
        // parsedImages.images.length > 0
        //   ? parsedImages.images[0]

        //   :
        ["https://blogs-dusky-nu.vercel.app/web3-crypto.jpg"],
      site: "@Web3-Cryptosearch",
    },
    alternates: {
      canonical: `https://blogs-dusky-nu.vercel.app/${slug}`,
    },
  };
}

const EventPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense fallback={<Loading/>}>
      <EventDetails params={params} getEvent={getEvent}/>
    </Suspense>
  );
};

export default EventPage;
