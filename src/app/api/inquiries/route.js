import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Inquiry from "../../../models/Inquiry";

// Keep these in sync with the form in src/app/components/contact.jsx.
const allowedEventTypes = new Set(["Wedding", "Ceremony", "Nikah", "Mehndi", "Engagement", "Bridal Shower", "Other"]);
const allowedRoles = new Set(["Couple", "Family Member", "Wedding Planner"]);
const allowedBudgets = new Set(["$5,000–$10,000", "$10,000–$20,000", "$20,000+", "Not sure yet, I'd like guidance"]);
const clean = (value, max) => String(value ?? "").trim().slice(0, max);

export async function POST(request) {
  try {
    const body = await request.json();
    const role = clean(body.role, 40);
    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 40);
    const eventType = clean(body.eventType, 80);
    const eventDate = clean(body.eventDate, 10);
    const budget = clean(body.budget, 80);
    const message = clean(body.message, 3000);

    if (!name || !email || !phone || !eventType || !message) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (!allowedEventTypes.has(eventType)) {
      return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
    }
    if (!allowedRoles.has(role)) {
      return NextResponse.json({ error: "Please tell us who you are." }, { status: 400 });
    }
    if (!allowedBudgets.has(budget)) {
      return NextResponse.json({ error: "Please choose an estimated budget." }, { status: 400 });
    }
    if (eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      return NextResponse.json({ error: "Please enter a valid event date." }, { status: 400 });
    }

    await connectDB();
    const inquiry = await Inquiry.create({ role, name, email, phone, eventType, eventDate, budget, message });

    let emailSent = false;
    let emailStatus = "missing_config";
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) console.error("Inquiry saved, but WEB3FORMS_ACCESS_KEY is not configured for this deployment.");

    if (accessKey) {
      emailStatus = "provider_rejected";
      try {
        const notification = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `New Sterling Bloom inquiry — ${eventType}`,
            from_name: "Sterling Bloom Website",
            role, name, email, phone, eventType, eventDate: eventDate || "Not provided",
            budget: budget || "Not provided", message,
            botcheck: "",
          }),
          cache: "no-store",
        });
        const result = await notification.json().catch(() => ({}));
        emailSent = notification.ok && result.success === true;
        if (emailSent) {
          emailStatus = "sent";
        } else {
          emailStatus = "provider_rejected";
          console.error("Inquiry saved, but Web3Forms rejected the notification:", { httpStatus: notification.status, providerMessage: result.message || "No provider message returned" });
        }
      } catch (notificationError) {
        emailStatus = "network_error";
        console.error("Inquiry saved, but notification delivery failed:", notificationError);
      }
    }

    return NextResponse.json({ ok: true, emailSent, emailStatus, id: inquiry._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Inquiry submission failed:", error);
    return NextResponse.json({ error: "We couldn't submit your inquiry right now. Please try again." }, { status: 500 });
  }
}
