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

type AutopilotOnEmailProps = {
  firstName: string;
  siteName: string;
  campaignName: string;
};

export const AutopilotOnEmail = ({
  firstName = "",
  siteName,
  campaignName,
}: AutopilotOnEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {firstName}, Autopilot is now active on {campaignName} in {siteName}!
    </Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
          <Section className="text-center">
            <Icons.logo className="mx-auto mb-4 size-12 text-blue-600" />
            <Text className="text-2xl font-semibold text-gray-800">
              Autopilot Activated for {campaignName}, {firstName}!
            </Text>
            <Text className="mt-4 text-gray-600">
              We&apos;re excited to let you know that Autopilot is now active on
              your campaign <strong>{campaignName}</strong>. Sit back and relax
              while we automatically fetch, filter, and respond to posts on your
              behalf.
            </Text>
          </Section>

          <Section className="mt-6 text-center">
            <Img
              src="https://via.placeholder.com/600x200"
              alt="Autopilot Activated"
              className="mx-auto rounded-md"
            />
          </Section>

          <Section className="mt-6 text-center">
            <Text className="text-gray-600">
              You&apos;ll receive notifications as Autopilot works its magic,
              ensuring you&apos;re always in the loop.
            </Text>
            <Text className="mt-4 text-gray-600">
              If you have any questions or need assistance, our support team is
              here to help.
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
