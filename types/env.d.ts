declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    AUTH_SECRET: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    GITHUB_OAUTH_TOKEN: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;

    DATABASE_URL: string;
    RESEND_API_KEY: string;

    STRIPE_API_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;

    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: string;
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: string;
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: string;
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: string;

    OPENAI_API_KEY: string;
    SERP_API_KEY: string;

    ENCRYPTION_KEY: string;

    TWITTER_CLIENT_ID: string;
    TWITTER_CLIENT_SECRET: string;
    TWITTER_REDIRECT_URL: string;

    LINKEDIN_CLIENT_ID: string;
    LINKEDIN_CLIENT_SECRET: string;
    LINKEDIN_REDIRECT_URL: string;
  }
}
