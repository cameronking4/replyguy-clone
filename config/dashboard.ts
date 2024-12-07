import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
      disabled: true,
    },
    {
      title: "YouTube",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Campaigns",
      href: "/dashboard",
      icon: "campaign",
    },
    {
      title: "Activity Log",
      href: "/dashboard/activity",
      icon: "notification",
    },
    {
      title: "Integrations",
      href: "/dashboard/integrations",
      icon: "user",
    },
    {
      title: "Settings",
      href: "",
      icon: "settings",
      expanded: true,
      subItems: [
        {
          title: "Profile",
          href: "/dashboard/settings",
          icon: "user"
        },
        {
          title: "Billing",
          href: "/dashboard/billing",
          icon: "billing",
        },
      ]
    },
    {
      title: "Give Feedback",
      href: "/project/messages",
      icon: "user",
    },
  ],
  sidebarUserNav: [
    {
      title: "Back",
      href: "/dashboard",
      icon: "arrowLeft",
    },
    {
      title: "Overview",
      href: "",
      icon: "campaign",
      expanded: true,
      subItems: [
        {
          title: "Manual Reply",
          href: "/project",
          icon: "logo",
        },
        {
          title: "Keywords",
          href: "/project/keywords",
          icon: "keyword",
        },
        {
          title: "Keyword Explorer",
          href: "/project/explorer",
          icon: "search",
        }
      ],
    },
    {
      title: "Autopilot",
      href: "",
      icon: "autopilot",
      expanded: true,
      'subItems': [ 
        {
          title: "Activity Log",
          href: "/project/activity",
          icon: "notification",
        },
        { 
          title: "Preferences",
          href: "/project/preferences",
          icon: "gear",
        },
        {
          title: "Tone & Voice",
          href: "/project/playground",
          icon: "preference",
        },
      ]
    },
    {
      title: "Settings",
      href: "/project/settings",
      icon: "settings",
    },
  ],
};
