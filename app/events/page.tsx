import ImageKit from "@/components/ImageKit";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";

const EventsPage = async () => {
  "use cache";
  cacheLife("days");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/events`);
  const { events } = await res.json();
  return (
    <section className="mt-15">
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-0 items-center justify-between mb-18">
        <h1 className="text-[40px] sm:text-5xl text-nowrap text-left w-full sm:w-auto">
          Event Management
        </h1>
        <button
          type="button"
          className="w-full sm:w-auto px-4.5 py-2.5 bg-[#59DECA] rounded-xl text-black text-lg cursor-pointer"
        >
          Add New Event
        </button>
      </div>
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
                      <div className="flex gap-2">
                        <ImageKit
                          src={item.image}
                          width={40}
                          height={40}
                          alt={item.title}
                          className="rounded-lg"
                        />
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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="font-semibold text-[16px] text-[#59DECA] cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="font-semibold text-[16px] text-[#E7F2FF] cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
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
