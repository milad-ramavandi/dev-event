"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Cloud from "./Cloud";
import Xmark from "./Xmark";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IEvent } from "@/database/event.model";
import ImageKit from "./ImageKit";
import { toast } from "react-toastify";
import { createEventAction, editEventAction } from "@/actions/event";
import {
  upload,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  ImageKitAbortError,
} from "@imagekit/next";

const uploadImage = async (file: File): Promise<string> => {
  const authRes = await fetch("/api/upload-auth");
  if (!authRes.ok) {
    throw new Error("Failed to get upload authentication");
  }
  const { token, expire, signature, publicKey } = await authRes.json();

  const uploadResponse = await upload({
    file,
    fileName: file.name,
    token,
    expire,
    signature,
    publicKey,
  });

  return uploadResponse.url as string;
};

const FormEvent = ({
  mode,
  slug,
  closeModal
}: {
  mode: "create" | "edit";
  slug?: string;
  closeModal?: () => void
}) => {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [inputDateType, setInputDateType] = useState<string>("text");
  const [inputTimeType, setInputTimeType] = useState<string>("text");
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    values,
    getFieldProps,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
  } = useFormik({
    initialValues: {
      title: "",
      date: "",
      image: null,
      description: "",
      tags: "",
      location: "",
      mode: "",
      time: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      date: Yup.string().required("Date is required"),
      image: Yup.mixed()
        .nullable()
        .test("validate size", "Size Must Be Max 1MB.", (value) => {
          if (!value || typeof value === "string") return true;
          return (value as File).size <= 1 * 1024 * 1024;
        })
        .test(
          "validate type",
          "Format Must Be PNG,JPEG,JPG and WEBP",
          (value) => {
            if (!value || typeof value === "string") return true;
            return [
              "image/png",
              "image/jpeg",
              "image/jpg",
              "image/webp",
            ].includes((value as File).type);
          },
        )
        .required("Banner is required"),
      description: Yup.string().required("Description is required"),
      tags: Yup.string().required("Tags is required"),
      location: Yup.string().required("Location is required"),
      mode: Yup.string().required("Type is required"),
      time: Yup.string().required("Time is required"),
    }),
    onSubmit: async (values) => {
      try {
        let imageUrl = values.image as unknown as string;
        if (values.image && typeof values.image !== "string") {
          imageUrl = await uploadImage(values.image as unknown as File);
        }

        const payload = { ...values, image: imageUrl };

        if (mode === "edit") {
          await toast.promise(editEventAction(String(event?._id), payload), {
            pending: "Editting Event...",
            success: "Edit Event Successfully",
            error: "Edit Event Failed",
          });
        } else {
          await toast.promise(createEventAction(payload), {
            pending: "Creating Event...",
            success: "Create Event Successfully",
            error: "Create Event Failed",
          });
        }
        closeModal?.();
      } catch (error) {
        if (error instanceof ImageKitInvalidRequestError) {
          toast.error(`Invalid image: ${error.message}`);
        } else if (error instanceof ImageKitUploadNetworkError) {
          toast.error("Network error while uploading image");
        } else if (error instanceof ImageKitServerError) {
          toast.error("ImageKit server error");
        } else if (error instanceof ImageKitAbortError) {
          toast.error("Image upload was cancelled");
        } else {
          toast.error("Something went wrong");
          console.error(error);
        }
      }
    },
  });

  const handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("image", file);
    }
    e.target.value = "";
  };
  const handleOpenFileClick: () => void = () => fileRef.current?.click();

  useEffect(() => {
    if (slug) {
      (async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/events/${slug}`,
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch event: ${res.statusText}`);
        }
        const { event } = await res.json();
        setEvent(event);
      })();
    }
  }, [slug]);

  useEffect(() => {
    if (mode === "edit" && event) {
      setFieldValue("title", event.title);
      setFieldValue("date", event.date);
      setFieldValue("time", event.time);
      setFieldValue("location", event.location);
      setFieldValue("mode", event.mode);
      setFieldValue("image", event.image);
      setFieldValue("tags", typeof event.tags === "string" ? event.tags : event.tags.join(", "));
      setFieldValue("description", event.description);
    }
  }, [mode, event]);
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-6 md:w-175 rounded-[10px] p-7.5 border border-[#182830] bg-[#0D161A]"
    >
      <div className="flex flex-col gap-3">
        <label htmlFor="title" className="text-[16px] text-[#E7F2FF]">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          {...getFieldProps("title")}
          placeholder="Enter event title"
          className="rounded-xl border border-[#243B47] py-3 px-4.5 text-[#E7F2FF] placeholder:text-white outline-0"
          autoComplete="off"
        />
        {touched.title && errors.title && (
          <p className="text-red-500 text-xs">{errors.title}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="date" className="text-[16px] text-[#E7F2FF]">
          Event Date
        </label>
        <div
          className={`flex gap-2 rounded-xl border border-[#243B47] ${inputDateType === "text" && "pl-4.5"}`}
        >
          {inputDateType === "text" && (
            <Image
              src={"/icons/calendar.svg"}
              width={24}
              height={24}
              alt="calendar"
            />
          )}
          <input
            type={inputDateType}
            id="date"
            {...getFieldProps("date")}
            placeholder="Select event date"
            onFocus={() => setInputDateType("date")}
            onBlur={(e) => {
              if (!e.target.value) {
                setInputDateType("text");
              }
            }}
            className={`placeholder:text-white w-full h-full outline-0 py-3 ${inputDateType === "date" && "px-4.5"}`}
          />
        </div>
        {touched.date && errors.date && (
          <p className="text-red-500 text-xs">{errors.date}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="time" className="text-[16px] text-[#E7F2FF]">
          Event Time
        </label>
        <div
          className={`flex gap-2 rounded-xl border border-[#243B47] ${inputTimeType === "text" && "pl-4.5"}`}
        >
          {inputTimeType === "text" && (
            <Image
              src={"/icons/calendar.svg"}
              width={24}
              height={24}
              alt="calendar"
            />
          )}
          <input
            type={inputTimeType}
            id="time"
            {...getFieldProps("time")}
            placeholder="Select event time"
            onFocus={() => setInputTimeType("time")}
            onBlur={(e) => {
              if (!e.target.value) {
                setInputTimeType("text");
              }
            }}
            className={`placeholder:text-white w-full h-full outline-0 py-3 ${inputTimeType === "time" && "px-4.5"}`}
          />
        </div>
        {touched.time && errors.time && (
          <p className="text-red-500 text-xs">{errors.time}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="location" className="text-[16px] text-[#E7F2FF]">
          Event Location
        </label>
        <input
          type="text"
          id="location"
          {...getFieldProps("location")}
          placeholder="Enter event location"
          className="rounded-xl border border-[#243B47] py-3 px-4.5 text-[#E7F2FF] placeholder:text-white outline-0"
          autoComplete="off"
        />
        {touched.location && errors.location && (
          <p className="text-red-500 text-xs">{errors.location}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="type" className="text-[16px] text-[#E7F2FF]">
          Event Type
        </label>
        <select
          className="rounded-xl border border-[#243B47] py-3 px-4.5 text-[#E7F2FF]"
          id="mode"
          {...getFieldProps("mode")}
        >
          <option value="" disabled>
            Select event type
          </option>
          {["online", "offline", "hybrid"].map((item, idx) => (
            <option key={idx} value={item}>
              {item[0].toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
        {touched.mode && errors.mode && (
          <p className="text-red-500 text-xs">{errors.mode}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="file" className="text-[16px] text-[#E7F2FF]">
          Event Image / Banner
        </label>
        <div
          className="flex items-center justify-center gap-1 rounded-xl border border-[#243B47] py-3 px-4.5 text-[#E7F2FF] cursor-pointer"
          onClick={handleOpenFileClick}
        >
          <Cloud />
          <p className="text-sm md:text-[16px]">Upload event image or banner</p>
        </div>
        <input
          type="file"
          className="hidden"
          ref={fileRef}
          onChange={handleImageChange}
        />
        {values.image && (
          <div className="flex flex-col gap-3">
            <Xmark
              onClick={() => {
                setFieldValue("image", null);
              }}
            />
            <div className="relative w-full h-50">
              {typeof values.image === "string" ? (
                // Show Remote Image
                <ImageKit
                  src={values.image}
                  fill
                  alt="banner"
                  className="absolute object-cover rounded-lg"
                />
              ) : (
                // Show Local Image
                <Image
                  src={URL.createObjectURL(values.image)}
                  fill
                  alt="banner"
                  className="absolute object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        )}
        {touched.image && errors.image && (
          <p className="text-red-500 text-xs">{errors.image}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="tags" className="text-[16px] text-[#E7F2FF]">
          Event Tags
        </label>
        <input
          type="text"
          id="tags"
          {...getFieldProps("tags")}
          placeholder="Add tags such as react, next, js"
          className="rounded-xl border border-[#243B47] py-3 px-4.5 text-[#E7F2FF] placeholder:text-white outline-0"
          autoComplete="off"
        />
        {touched.tags && errors.tags && (
          <p className="text-red-500 text-xs">{errors.tags}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="description" className="text-[16px] text-[#E7F2FF]">
          Event Description
        </label>
        <textarea
          id="description"
          {...getFieldProps("description")}
          placeholder="Briefly describe the event"
          className="rounded-xl border border-[#243B47] py-3 px-4.5 text-[#E7F2FF] placeholder:text-white outline-0"
        />
        {touched.description && errors.description && (
          <p className="text-red-500 text-xs">{errors.description}</p>
        )}
      </div>
      <button
        type="submit"
        className={`w-full px-4.5 py-2.5 bg-[#59DECA] rounded-xl text-black text-lg cursor-pointer ${isSubmitting && "disabled:opacity-50 pointer-events-none"}`}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Loading..."
          : mode === "create"
            ? "Add New Event"
            : "Edit Event"}
      </button>
    </form>
  );
};

export default FormEvent;
