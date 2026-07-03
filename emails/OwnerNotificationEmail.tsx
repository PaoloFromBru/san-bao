import { Html, Head, Body, Container, Heading, Text, Hr } from "@react-email/components";

type Props = {
  serviceName: string;
  dateLabel: string;
  time: string;
  locationAddress: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  notes?: string | null;
};

export default function OwnerNotificationEmail({
  serviceName,
  dateLabel,
  time,
  locationAddress,
  clientName,
  clientEmail,
  clientPhone,
  notes,
}: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f8fafc", padding: "24px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "480px",
          }}
        >
          <Heading style={{ color: "#0f172a", fontSize: "20px" }}>Nuova prenotazione</Heading>
          <Text style={{ color: "#334155", fontSize: "15px" }}>
            <strong>{serviceName}</strong> — {dateLabel} alle {time}
          </Text>
          <Text style={{ color: "#0f172a", fontSize: "15px", fontWeight: "bold" }}>
            📍 {locationAddress}
          </Text>
          <Hr style={{ borderColor: "#e2e8f0", margin: "16px 0" }} />
          <Text style={{ color: "#334155", fontSize: "15px", margin: "4px 0" }}>
            {clientName}
          </Text>
          <Text style={{ color: "#334155", fontSize: "15px", margin: "4px 0" }}>
            {clientEmail}
          </Text>
          {clientPhone && (
            <Text style={{ color: "#334155", fontSize: "15px", margin: "4px 0" }}>
              {clientPhone}
            </Text>
          )}
          {notes && (
            <Text style={{ color: "#64748b", fontSize: "14px", margin: "12px 0 0" }}>
              Note: {notes}
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  );
}
