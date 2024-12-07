import { TwitterApiRateLimitPlugin } from "@twitter-api-v2/plugin-rate-limit";
import { TwitterApi } from "twitter-api-v2";

import { getEnvVar } from "@/lib/utils";

export const TWITTER_CALLBACK_URL = getEnvVar("TWITTER_REDIRECT_URL");

export const twitterClient = (): TwitterApi | null => {
  return new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: "GdzvuTKI1v0B_-DyE-p3-d6RqvQUGZNcnLFS7CstQRuy-tP8KY",
  });
};

export const twitterAuthClient = (
  accessToken: string,
  rateLimitPlugin?: TwitterApiRateLimitPlugin,
): TwitterApi => {
  let client: TwitterApi;

  rateLimitPlugin
    ? (client = new TwitterApi(accessToken, {
        plugins: [rateLimitPlugin],
      }))
    : (client = new TwitterApi(accessToken));

  return client;
};

export const client = () => {
  const tC = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY || "",
    appSecret: process.env.TWITTER_APP_SECRET || "",
    accessToken: process.env.TWITTER_ACCESS_TOKEN || "",
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
  });
  return tC;
};
