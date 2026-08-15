"use client";

import createBooking from "@/actions/booking";
import { IBookEventProps } from "@/types";
import { SubmitEvent, useState } from "react";

const BookEvent = ({ eventId }: IBookEventProps) => {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email) {
      const { success } = await createBooking({ eventId, email });

      if (success) {
        setSubmitted(true);
      } else {
        console.error("Booking creation failed");
      }
    } else {
        alert("Please enter your email")
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
            />
          </div>

          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
