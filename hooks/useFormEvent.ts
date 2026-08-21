"use client";
import { createEventAction, editEventAction } from "@/actions/event";
import { IFormValues } from "@/types";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  upload,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  ImageKitAbortError,
} from "@imagekit/next";
import { IEvent } from "@/database/event.model";
import { toast } from "react-toastify";

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

const useFormEvent = (
  mode: "create" | "edit",
  slug: string,
  closeModal?: () => void,
) => {
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
  } = useFormik<IFormValues>({
    initialValues: {
      title: "",
      date: "",
      image: null,
      description: "",
      tags: "",
      location: "",
      mode: "",
      time: "",
      slug: "",
      bookings: "",
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
    onSubmit: async (values: IFormValues) => {
      try {
        let imageUrl = values.image as unknown as string;
        if (values.image && typeof values.image !== "string") {
          imageUrl = await uploadImage(values.image as unknown as File);
        }

        const payload = {
          ...values,
          tags: values.tags.split(","),
          image: imageUrl,
          bookings: "0",
          slug: values.title.toLowerCase().replace(" ", "-"),
        };

        if (mode === "edit") {
          await toast.promise(
            editEventAction(event?.slug as string, String(event?._id), payload),
            {
              pending: "Editting Event...",
              success: "Edit Event Successfully",
              error: "Edit Event Failed",
            },
          );
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
      setFieldValue("tags", event.tags.join(","));
      setFieldValue("description", event.description);
    }
  }, [mode, event]);

  return {
    inputDateType,
    setInputDateType,
    inputTimeType,
    setInputTimeType,
    fileRef,
    values,
    getFieldProps,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
    handleImageChange,
    handleOpenFileClick
  }
};

export default useFormEvent;
