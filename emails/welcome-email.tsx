import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Icons } from "../components/shared/icons";

type WelcomeEmailProps = {
  firstName: string;
  siteName: string;
};

export const WelcomeEmail = ({
  firstName = "",
  siteName,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Welcome to {siteName}! We&apos;re excited to have you on board.
    </Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
          <Section className="text-center">
            <Icons.logo className="mx-auto mb-4 size-12 text-blue-600" />
            <Text className="text-2xl font-semibold text-gray-800">
              Welcome to {siteName}, {firstName}!
            </Text>
            <Text className="mt-4 text-gray-600">
              We are thrilled to have you with us. Get ready to explore the best
              experience you&apos;ve ever had!
            </Text>
          </Section>

          <Section className="mt-6 text-center">
            <Img
              src="https://via.placeholder.com/600x200"
              alt="Welcome Banner"
              className="mx-auto rounded-md"
            />
          </Section>

          <Section className="mt-6 text-center">
            <Text className="text-gray-600">
              We&apos;re here to help you every step of the way. If you have any
              questions, feel free to reach out to our support team.
            </Text>
          </Section>

          <Hr className="my-6 border-t-2 border-gray-200" />

          <Section className="text-center">
            <Text className="text-sm text-gray-500">
              Best Regards,
              <br />
              The {siteName} Team
            </Text>
            <Text className="mt-4 text-xs text-gray-400">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default WelcomeEmail;
