"use client";

import createBooking from "@/actions/booking";
import { IBookEventProps } from "@/types";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

const BookEvent = ({ eventId }: IBookEventProps) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { getFieldProps, errors, touched, isSubmitting, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: Yup.object().shape({
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is required"),
      }),
      onSubmit: async (values) => {
        const { email } = values;
        const { success } = await createBooking({ eventId, email });
        if (success) {
          setSubmitted(true);
        }
      },
    });

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
              {...getFieldProps("email")}
              id="email"
              placeholder="Enter your email address"
              autoComplete="off"
            />
          </div>
          {touched.email && errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}

          <button type="submit" className="button-submit">
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
