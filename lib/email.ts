import { Resend } from "resend";
import ClientConfirmationEmail from "@/emails/ClientConfirmationEmail";
import OwnerNotificationEmail from "@/emails/OwnerNotificationEmail";
import ContactMessageEmail from "@/emails/ContactMessageEmail";
import { format } from "@/lib/format";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS = "San Bao <prenotazioni@mycellarapp.com>";

type BookingEmailStrings = {
  emailSubject: string;
  emailHeading: string;
  emailGreeting: string;
  emailBody: string;
  emailFooter: string;
};

type BookingEmailInput = {
  // Owner notification is always in Italian (matches the admin CMS language).
  ownerServiceName: string;
  // Client confirmation is sent in the client's own locale.
  clientServiceName: string;
  dateLabel: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  notes?: string | null;
  clientStrings: BookingEmailStrings;
};

// Sends both notification emails and never throws — a flaky email provider
// should never fail a booking that's already been written to the DB.
export async function sendBookingEmails(input: BookingEmailInput) {
  const vars = {
    name: input.clientName,
    service: input.clientServiceName,
    date: input.dateLabel,
    time: input.time,
  };

  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: input.clientEmail,
      subject: format(input.clientStrings.emailSubject, vars),
      react: ClientConfirmationEmail({
        heading: input.clientStrings.emailHeading,
        greeting: format(input.clientStrings.emailGreeting, vars),
        body: format(input.clientStrings.emailBody, vars),
        footer: input.clientStrings.emailFooter,
      }),
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: process.env.OWNER_EMAIL!,
      replyTo: input.clientEmail,
      subject: `Nuova prenotazione — ${input.ownerServiceName} (${input.dateLabel})`,
      react: OwnerNotificationEmail({ ...input, serviceName: input.ownerServiceName }),
    }),
  ]);

  for (const r of results) {
    if (r.status === "rejected") {
      console.error("Booking email failed to send:", r.reason);
    }
  }
}

type ContactMessageInput = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactMessage(input: ContactMessageInput) {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: process.env.OWNER_EMAIL!,
    replyTo: input.email,
    subject: `Nuovo messaggio dal sito — ${input.name}`,
    react: ContactMessageEmail(input),
  });
  if (error) {
    console.error("Contact message failed to send:", error);
    throw new Error("send failed");
  }
}
