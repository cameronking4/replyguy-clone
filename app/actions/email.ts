"use server";

import { AutopilotOnEmail } from "@/emails/autopilot-on";
import { AutopilotWeeklySummaryEmail } from "@/emails/weekly-summary";
import WelcomeEmail from "@/emails/welcome-email";

import { siteConfig } from "@/config/site";
import { resend } from "@/lib/email";

import { getCampaignWeeklySummary } from "./campaign";

export async function sendAutopilotActivationEmail(
  userEmail: string,
  firstName: string,
  siteName: string,
  campaignName: string,
) {
  await resend.emails.send({
    from: "BuzzBot <onboarding@resend.dev>",
    to: userEmail,
    // to: "mahmadshoukat7@gmail.com",
    subject: "Autopilot Activated!",
    react: AutopilotOnEmail({ firstName, siteName, campaignName }),
  });
}

export async function sendUserWelcomeEmail({
  siteName,
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string;
  siteName: string;
}): Promise<any> {
  return await resend.emails.send({
    from: "BuzzBot <onboarding@resend.dev>",
    to: userEmail,
    subject: `Welcome to ${siteName}`,
    react: WelcomeEmail({
      firstName: userName || "User",
      siteName: siteName,
    }),
    headers: {
      "X-Entity-Ref-ID": new Date().getTime() + "",
    },
  });
}

export async function sendWeeklyCampaignSummaryEmail({
  campaignId,
}: {
  campaignId: string;
}) {
  try {
    const summaryData = await getCampaignWeeklySummary(campaignId);

    if (summaryData.type === "error" || !summaryData.data) {
      throw new Error(summaryData.message);
    }

    const summary = summaryData.data;

    await resend.emails.send({
      from: "YourApp <no-reply@yourapp.com>",
      to: summary.userEmail,
      subject: `Your Weekly Autopilot Summary for ${summary.campaignName}`,
      react: AutopilotWeeklySummaryEmail({
        firstName: summary.firstName,
        siteName: siteConfig.name,
        campaignName: summary.campaignName,
        totalReplies: summary.totalReplies,
        platformSummaries: summary.platformSummaries,
      }),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to send weekly summary email.");
    }
  }
}
