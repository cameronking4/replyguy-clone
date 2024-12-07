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

type AutopilotWeeklySummaryEmailProps = {
  firstName: string;
  siteName: string;
  campaignName: string;
  totalReplies: number;
  platformSummaries: {
    xReplies: number;
    redditReplies: number;
    linkedInReplies: number;
  };
};

export const AutopilotWeeklySummaryEmail = ({
  firstName = "",
  siteName,
  campaignName,
  totalReplies,
  platformSummaries: { xReplies, redditReplies, linkedInReplies },
}: AutopilotWeeklySummaryEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Your weekly Autopilot summary for {campaignName} on {siteName}
    </Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
          <Section className="text-center">
            <Icons.logo className="mx-auto mb-4 size-12 text-blue-600" />
            <Text className="text-2xl font-semibold text-gray-800">
              Weekly Autopilot Summary for {campaignName}, {firstName}!
            </Text>
            <Text className="mt-4 text-gray-600">
              Here’s what Autopilot has been up to this week for your campaign{" "}
              <strong>{campaignName}</strong>.
            </Text>
          </Section>

          <Section className="mt-6 text-center">
            <Img
              src="https://via.placeholder.com/600x200"
              alt="Autopilot Summary"
              className="mx-auto rounded-md"
            />
          </Section>

          <Section className="mt-6">
            <Text className="text-center text-xl font-semibold text-gray-800">
              Total Replies Posted: {totalReplies}
            </Text>
            <Hr className="my-4 border-t-2 border-gray-200" />
            <Text className="text-lg font-semibold text-gray-800">
              Platform Breakdown:
            </Text>
            <Text className="mt-2 text-gray-600">
              <strong>X (formerly Twitter):</strong> {xReplies} replies
            </Text>
            <Text className="mt-2 text-gray-600">
              <strong>Reddit:</strong> {redditReplies} replies
            </Text>
            <Text className="mt-2 text-gray-600">
              <strong>LinkedIn:</strong> {linkedInReplies} replies
            </Text>
          </Section>

          <Section className="mt-6 text-center">
            <Text className="text-gray-600">
              Keep up the great work! Autopilot is working hard to engage your
              audience across all platforms.
            </Text>
            <Text className="mt-4 text-gray-600">
              If you have any questions or need further insights, feel free to
              reach out to our support team.
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
