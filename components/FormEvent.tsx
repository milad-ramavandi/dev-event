"use client";
import Image from "next/image";
import { SubmitEvent, useRef, useState } from "react";
import Cloud from "./Cloud";
import Xmark from "./Xmark";
import { useFormik } from "formik";
import * as Yup from "yup"

const FormEvent = () => {
  const [inputDateType, setInputDateType] = useState<string>("text");
  const [inputTimeType, setInputTimeType] = useState<string>("text");
  const [banner, setBanner] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const {values, getFieldProps, handleSubmit} = useFormik({
    initialValues: {
      title:"",
      date:"",
      banner:"",
      description:"",
      tags:"",
      location:"",
      type:"",
      time:""
    }, 
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      date: Yup.string().required("Title is required"),
      banner: Yup.string().required("Title is required"),
      description: Yup.string().required("Title is required"),
      tags: Yup.string().required("Title is required"),
      location: Yup.string().required("Title is required"),
      type: Yup.string().required("Title is required"),
      time: Yup.string().required("Title is required"),
    }),
    onSubmit: (values) => {
      console.log(values)
    }
  })

  const handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files?.[0]);
    }
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      setBanner(readerEvent.target?.result as string);
    };
  };
  const handleOpenFileClick: () => void = () => fileRef.current?.click();

  const submitFormHandler = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const event = {
    //   title,
    //   description,
    //   banner,
    //   time,
    //   date,
    //   tags: tags.split(","),
    //   location,
    //   type,
    // };
  };
  return (
    <form
      onSubmit={submitFormHandler}
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
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="type" className="text-[16px] text-[#E7F2FF]">
          Event Type
        </label>
        <select
          className="rounded-xl border border-[#243B47] py-3 px-4.5 text-[#E7F2FF]"
          id="type"
          {...getFieldProps("type")}
        >
          <option value="" disabled>
            Select event type
          </option>
          {["Online", "Offline", "Hybrid"].map((item, idx) => (
            <option key={idx} value={item}>
              {item}
            </option>
          ))}
        </select>
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
          name="file"
          className="hidden"
          ref={fileRef}
          onChange={handleImageChange}
        />
        {banner && (
          <div className="relative w-full h-50">
            <Xmark onClick={() => setBanner("")} className="absolute top-1 left-1 z-50 animate-bounce"/>
            <Image src={banner} fill alt="banner" className="object-cover rounded-lg"/>
          </div>
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
      </div>
      <button
        type="submit"
        className="w-full px-4.5 py-2.5 bg-[#59DECA] rounded-xl text-black text-lg cursor-pointer"
      >
        Add New Event
      </button>
    </form>
  );
};

export default FormEvent;
