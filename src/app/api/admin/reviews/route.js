import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import connectDB from "../../../../lib/mongodb";
import Review from "../../../../models/Review";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Admin reviews fetch failed:", error);
    return NextResponse.json({ error: "Unable to load reviews." }, { status: 500 });
  }
}

const clean = (value, max) => String(value ?? "").trim().slice(0, max);

// Validates name / event / review text sent from the admin form.
function readReviewFields(body) {
  const name = clean(body.name, 120);
  const event = clean(body.event, 100);
  const review = clean(body.review, 1500);
  if (!name || !event || !review) return { error: "Please fill in the name, event type and review." };
  return { fields: { name, event, review } };
}

// Admin adds a review by hand: it is approved straight away.
export async function POST(request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { fields, error } = readReviewFields(await request.json());
    if (error) return NextResponse.json({ error }, { status: 400 });

    await connectDB();
    const review = await Review.create({ ...fields, email: "", source: "admin", status: "approved" });
    return NextResponse.json({ ok: true, review }, { status: 201 });
  } catch (error) {
    console.error("Admin review create failed:", error);
    return NextResponse.json({ error: "Unable to add review." }, { status: 500 });
  }
}

// Change a review's status, or edit its name / event / text.
export async function PATCH(request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Invalid review update." }, { status: 400 });

    let update;
    if (body.status !== undefined) {
      if (!["pending", "approved", "rejected"].includes(body.status)) return NextResponse.json({ error: "Invalid review update." }, { status: 400 });
      update = { status: body.status };
    } else {
      const { fields, error } = readReviewFields(body);
      if (error) return NextResponse.json({ error }, { status: 400 });
      update = fields;
    }

    await connectDB();
    const review = await Review.findByIdAndUpdate(body.id, update, { new: true, runValidators: true }).lean();
    if (!review) return NextResponse.json({ error: "Review not found." }, { status: 404 });

    return NextResponse.json({ ok: true, review });
  } catch (error) {
    console.error("Admin review update failed:", error);
    return NextResponse.json({ error: "Unable to update review." }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Invalid review." }, { status: 400 });

    await connectDB();
    const review = await Review.findByIdAndDelete(body.id).lean();
    if (!review) return NextResponse.json({ error: "Review not found." }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin review delete failed:", error);
    return NextResponse.json({ error: "Unable to delete review." }, { status: 500 });
  }
}
