"use server";

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";
import { ICreateBookingProps } from "@/types";

const createBooking = async ({ eventId, email }: ICreateBookingProps) => {
  try {
    await connectDB();
    await Booking.create({ eventId, email })
    return { success: true };
  } catch (error) {
    console.error("create booking failed", error);
    return { success: false };
  }
};

export default createBooking;
