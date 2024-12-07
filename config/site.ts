import { env } from "@/env.mjs";
import { SiteConfig } from "types"

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "BuzzDaddy",
  description:
    "Harness the power of Next.js 14, Prisma, Planetscale, Auth.js, Resend, React Email, Shadcn/ui and Stripe to build your next big thing.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  links: {
    twitter: "https://twitter.com/cameronyking4",
    github: "https://github.com/cameronking4/saas-starter",
  },
  mailSupport: "support@saas-starter.com"
}
