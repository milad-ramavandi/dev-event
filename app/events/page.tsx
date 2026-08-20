import ActionsEvent from "@/components/ActionsEvent";
import HeaderEvents from "@/components/HeaderEvents";
import ImageKit from "@/components/ImageKit";
import { IEvent } from "@/database/event.model";
import { cacheLife, cacheTag } from "next/cache";

const EventsPage = async () => {
  "use cache";
  cacheLife("days");
  cacheTag("events");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/events`);
  const { events } = await res.json();

  return (
    <section className="mt-15">
      <HeaderEvents />
      <div className="overflow-x-scroll">
        <table className="w-full bg-[#0D161A] overflow-hidden rounded-t-[10px]">
          <thead className="text-left">
            <tr>
              <th className="py-3 px-6 text-[14px] text-[#E7F2FF] border border-[#182830] bg-[#182830]">
                Event
              </th>
              <th className="py-3 px-6 text-[14px] text-[#E7F2FF] border border-[#182830] bg-[#182830]">
                Location
              </th>
              <th className="py-3 px-6 text-[14px] text-[#E7F2FF] border border-[#182830] bg-[#182830]">
                Date
              </th>
              <th className="py-3 px-6 text-[14px] text-[#E7F2FF] border border-[#182830] bg-[#182830]">
                Time
              </th>
              <th className="py-3 px-6 text-[14px] text-[#E7F2FF] border border-[#182830] bg-[#182830] text-nowrap">
                Booked Spot
              </th>
              <th className="py-3 px-6 text-[14px] text-[#E7F2FF] border border-[#182830] bg-[#182830]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {events &&
              events.length > 0 &&
              events.map((item: IEvent) => {
                return (
                  <tr
                    key={String(item._id)}
                    className="border border-x-[#182830] border-b-[#182830]"
                  >
                    <td className="py-4 px-6 border border-x-[#182830] border-b-[#182830]">
                      <div className="flex gap-2 items-center">
                        <div className="relative w-10 h-10">
                          <ImageKit
                            src={item.image as string}
                            fill
                            alt={item.title}
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <p className="font-semibold text-lg text-nowrap">
                          {item.title}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-[16px] text-[#E7F2FF] text-nowrap border border-x-[#182830] border-b-[#182830]">
                      {item.location}
                    </td>
                    <td className="py-4 px-6 font-medium text-[16px] text-[#E7F2FF] text-nowrap border border-x-[#182830] border-b-[#182830]">
                      {item.date}
                    </td>
                    <td className="py-4 px-6 font-medium text-[16px] text-[#E7F2FF] text-nowrap border border-x-[#182830] border-b-[#182830]">
                      {item.time}
                    </td>
                    <td className="py-4 px-6 font-medium text-[16px] text-[#E7F2FF] text-nowrap border border-x-[#182830] border-b-[#182830]">
                      {item.bookings}
                    </td>

                    <td className="py-4 px-6 border border-x-[#182830] border-b-[#182830]">
                      <ActionsEvent
                        eventId={String(item._id)}
                        slug={item.slug as string}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-11">
        <button
          type="button"
          className="py-3 px-5 sm:px-7.5 rounded-[6px] bg-[#182830] font-semibold text-lg cursor-pointer"
        >
          Previous
        </button>
        <p className="font-medium text-[16px] text-[#E7F2FF] ">Page 1 of 10</p>
        <button
          type="button"
          className="py-3 px-5 sm:px-7.5 rounded-[6px] bg-[#182830] font-semibold text-lg cursor-pointer"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default EventsPage;
