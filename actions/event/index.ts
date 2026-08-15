"use server";

import { updateTag } from "next/cache";

export const deleteEventAction = async (eventId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/events/${eventId}`, {
        method:"DELETE"
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to Delete Event ${res.statusText}`);
    }
    updateTag("events");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
