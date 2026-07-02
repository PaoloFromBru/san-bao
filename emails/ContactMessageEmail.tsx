import { Html, Head, Body, Container, Heading, Text, Hr } from "@react-email/components";

type Props = {
  name: string;
  email: string;
  message: string;
};

export default function ContactMessageEmail({ name, email, message }: Props) {
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
          <Heading style={{ color: "#0f172a", fontSize: "20px" }}>Nuovo messaggio dal sito</Heading>
          <Text style={{ color: "#334155", fontSize: "15px", margin: "4px 0" }}>{name}</Text>
          <Text style={{ color: "#334155", fontSize: "15px", margin: "4px 0" }}>{email}</Text>
          <Hr style={{ borderColor: "#e2e8f0", margin: "16px 0" }} />
          <Text style={{ color: "#334155", fontSize: "15px", whiteSpace: "pre-wrap" }}>
            {message}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
