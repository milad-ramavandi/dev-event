import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = (await req.formData()).entries();
    let event;
    try {
      event = Object.fromEntries(formData);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 },
      );
    }
    const createdEvent = Event.create(event);
    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const slug = req.nextUrl.searchParams.get("similar_events");
    if (slug) {
      try {
        const event = await Event.findOne({ slug });
        const similarEvents = await Event.find({
          _id: { $ne: event._id },
          tags: { $in: event.tags },
        });
        return NextResponse.json(
        { message: "similar Events fetched successfully", similarEvents },
        { status: 200 },
      );
      } catch (error) {
        return NextResponse.json(
          {
            messahe: "Events fetching failed",
            error: error instanceof Error ? error.message : "Unknown",
          },
          { status: 500 },
        );
      }
    } else {
      const events = await Event.find().sort({ createdAt: -1 });
      return NextResponse.json(
        { message: "Events fetched successfully", events },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        messahe: "Events fetching failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
