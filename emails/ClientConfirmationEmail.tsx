import { Html, Head, Body, Container, Heading, Text, Hr } from "@react-email/components";

type Props = {
  heading: string;
  greeting: string;
  body: string;
  footer: string;
};

export default function ClientConfirmationEmail({ heading, greeting, body, footer }: Props) {
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
          <Heading style={{ color: "#0f172a", fontSize: "20px" }}>{heading}</Heading>
          <Text style={{ color: "#334155", fontSize: "15px" }}>{greeting}</Text>
          <Text style={{ color: "#334155", fontSize: "15px" }}>{body}</Text>
          <Text style={{ color: "#334155", fontSize: "15px" }}>{footer}</Text>
          <Hr style={{ borderColor: "#e2e8f0", margin: "24px 0" }} />
          <Text style={{ color: "#94a3b8", fontSize: "13px" }}>
            San Bao — Shiatsu &amp; Naturopatia
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
