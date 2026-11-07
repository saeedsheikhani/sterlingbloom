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

export async function PATCH(request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const status = ["pending", "approved", "rejected"].includes(body.status) ? body.status : null;
    if (!status || !body.id) return NextResponse.json({ error: "Invalid review update." }, { status: 400 });

    await connectDB();
    const review = await Review.findByIdAndUpdate(body.id, { status }, { new: true }).lean();
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
