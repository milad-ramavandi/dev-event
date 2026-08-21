"use server";
import { IEventCardProps, IFormValues } from "@/types";
import { updateTag } from "next/cache";

export const deleteEventAction = async (eventId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/events/${eventId}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) {
      throw new Error(`Failed to Delete Event ${res.statusText}`);
    }
    updateTag("events");
  } catch (error) {
    console.error(error);
  }
};

export const editEventAction = async (
  slug:string,
  eventId: string,
  event: IEventCardProps,
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/events/${eventId}`,
      {
        method: "PUT",
        body: JSON.stringify({ ...event }),
        headers: {
          "content-type": "application/json",
        },
      },
    );

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(
        `Failed to Edit Event: ${errBody?.error ?? errBody?.message ?? res.statusText}`,
      );
    }

    updateTag("events");
    updateTag(`events/${slug}`);
  } catch (error) {
    console.error(error);
    throw error
  }
};


export const createEventAction = async (
  event: IEventCardProps,
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/events`,
      {
        method: "POST",
        body: JSON.stringify({ ...event }),
        headers: {
          "content-type": "application/json",
        },
      },
    );

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(
        `Failed to Create Event: ${errBody?.error ?? errBody?.message ?? res.statusText}`,
      );
    }

    updateTag("events");
  } catch (error) {
    console.error(error);
    throw error
  }
};
