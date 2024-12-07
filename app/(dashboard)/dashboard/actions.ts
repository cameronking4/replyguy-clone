"use server";

import { LinkedInUser } from "@/types";
import { TwitterProfile, TwitterToken } from "@prisma/client";
import { TwitterApiRateLimitPlugin } from "@twitter-api-v2/plugin-rate-limit";

import { linkedinAuthClient, linkedinClient } from "@/lib/linkedin";
import {
  deleteTwitterToken,
  disconnectLinkedInAccount,
  getLinkedInUser,
  getTwitterProfile,
  getTwitterToken,
  saveLinkedInState,
  saveLinkedInUser,
  saveOAuthState,
  saveTwitterProfile,
  updateTwitterToken,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import {
  TWITTER_CALLBACK_URL,
  twitterAuthClient,
  twitterClient,
} from "@/lib/twitter";
import { nanoid } from "@/lib/utils";

interface Result<T> {
  type: "success" | "error";
  message: string;
  data: T | null;
}

export async function connectTwitterAccount(): Promise<Result<string>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        type: "error",
        message: "Unauthorized. Please log in to connect X account.",
        data: null,
      };
    }

    const url = await generateAndSaveTwitterOAuthLink(
      user.id,
      TWITTER_CALLBACK_URL,
    );

    if (!url) {
      return {
        type: "error",
        message: "Failed to connect X account.",
        data: null,
      };
    }

    return {
      type: "success",
      message: "Redirecting to X authentication page.",
      data: url,
    };
  } catch (error: any) {
    console.error("Error saving X account:", error.message);
    return {
      type: "error",
      message: "Failed to connect X account.",
      data: null,
    };
  }
}

export async function connectLinkedInAccount(): Promise<Result<string>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        type: "error",
        message:
          "Unauthorized. Please log in to connect your LinkedIn account.",
        data: null,
      };
    }

    const authClient = linkedinAuthClient();
    const STATE = nanoid();

    const state = await saveLinkedInState(user.id, STATE);
    // console.log("STATE", state);
    const url = authClient.generateMemberAuthorizationUrl(
      ["openid", "profile", "email"],
      STATE,
    );

    // console.log("URL", url);

    if (!url) {
      return {
        type: "error",
        message: "Failed generate LinkedIn authorization URL.",
        data: null,
      };
    }

    return {
      type: "success",
      message: "Redirecting to LinkedIn authorization page.",
      data: url,
    };
  } catch (error: any) {
    console.error("Error saving X account:", error.message);
    return {
      type: "error",
      message: "Failed to connect X account.",
      data: null,
    };
  }
}

export async function fetchTwitterProfile(
  userId: string,
  accessToken: string,
  forceUpdate: boolean = false,
  retries: number = 5,
): Promise<Result<TwitterProfile>> {
  try {
    // Step 1: Fetch the cached user's Twitter profile data from the database
    let profile = await getTwitterProfile(userId);

    if (profile && !forceUpdate) {
      console.log("Using cached Twitter profile data");
      return {
        type: "success",
        message: "Twitter profile data fetched successfully.",
        data: profile,
      };
    }

    // Step 2: Fetch the user's Twitter profile data from the Twitter API
    console.log("Fetching new Twitter profile data");
    const rateLimitPlugin = new TwitterApiRateLimitPlugin();
    const authClient = twitterAuthClient(accessToken, rateLimitPlugin);

    const currentRateLimitForMe =
      await rateLimitPlugin.v2.getRateLimit("users/me");
    // console.log(currentRateLimitForMe);

    const { data, errors } = await authClient.v2.me({
      "user.fields":
        "created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld",
    });

    if (!data) {
      console.log("Failed to fetch Twitter profile data:", errors);
      // console.error("Failed to fetch Twitter profile data");
      return {
        type: "error",
        message: "Failed to fetch Twitter profile data.",
        data: null,
      };
    }

    // Step 3: Save the fetched Twitter profile data to the database
    const savedData = await saveTwitterProfile(userId, data);

    return {
      type: "success",
      message: "Twitter profile data fetched successfully.",
      data: savedData,
    };
  } catch (error) {
    if (error.code === 429 && error.rateLimit && retries > 0) {
      const retryAfter = error.rateLimit.reset - Math.floor(Date.now() / 1000);
      console.warn(`Rate limit hit. Retrying after ${retryAfter} seconds...`);
      // await new Promise((resolve) =>
      //   setTimeout(resolve, (retryAfter + 1) * 1000),
      // );
      // return fetchTwitterProfile(userId, accessToken, forceUpdate, retries - 1);
      return {
        type: "error",
        message: `Rate limit hit. Retrying after ${retryAfter} seconds...`,
        data: null,
      };
    }
    console.log("\n\nError fetching Twitter profile data:", error);
    return {
      type: "error",
      message: "Failed to fetch Twitter profile data.",
      data: null,
    };
  }
}

interface ReauthorizeData {
  reauthorizeUrl: string;
}

type TwitterTokenData = TwitterToken | ReauthorizeData;

export async function fetchTwitterToken(
  userId: string,
): Promise<TwitterTokenData | null> {
  try {
    const token = await getTwitterToken(userId);

    if (!token?.accessToken && !token?.refreshToken) {
      console.log("No Twitter Token in db");

      const url = await generateAndSaveTwitterOAuthLink(
        userId,
        TWITTER_CALLBACK_URL,
      );

      if (!url) {
        return null;
      }

      return {
        reauthorizeUrl: url,
      };
    }

    console.log("Twitter token in db: ", token);

    const expiryDate = new Date(token.expiresAt);
    const currentDate = new Date();

    const isExpired = expiryDate < currentDate;

    if (isExpired) {
      console.log("Token Expired");

      const client = twitterClient();

      if (client) {
        console.log("Refreshing Token");

        try {
          const { accessToken, expiresIn, refreshToken } =
            await client.refreshOAuth2Token(token.refreshToken);

          console.log("Token Refreshed");

          const newExpiresAt = new Date(Date.now() + expiresIn * 1000);

          await updateTwitterToken(userId, {
            ...token,
            accessToken,
            expiresAt: newExpiresAt,
            refreshToken: refreshToken as string,
          });

          console.log("Token Refreshed");

          return {
            ...token,
            accessToken,
            expiresAt: newExpiresAt,
            refreshToken: refreshToken as string,
          };
        } catch (error) {
          console.error("Error refreshing Twitter token:", error);
          if (error.response?.status === 400) {
            console.log(
              "Refresh token expired or invalid. Re-authentication required.",
            );
            // Handle the case where the refresh token is invalid/expired
            // You might want to delete the token from the database and prompt the user to re-authenticate

            const res = await deleteTwitterToken(userId, token.id);
            console.log("Token Deleted", res);
            return null;
          } else {
            throw error;
          }
        }
      }
    }

    return token;
  } catch (error) {
    console.error("Error fetching Twitter token:", error);
    return null;
  }
}

async function generateAndSaveTwitterOAuthLink(
  userId: string,
  TWITTER_CALLBACK_URL: string,
): Promise<string | null> {
  const client = twitterClient();

  if (!client) {
    console.error("Failed to connect to Twitter API");
    return null;
  }

  try {
    const { url, state, codeVerifier } = client.generateOAuth2AuthLink(
      TWITTER_CALLBACK_URL,
      {
        scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
      },
    );
    await saveOAuthState(userId, state, codeVerifier);
    return url;
  } catch (error) {
    console.error("Failed to generate and save Twitter OAuth link:", error);
    return null;
  }
}

export const fetchOrCacheLinkedInProfile = async (
  userId: string,
  accessToken: string,
) => {
  const cachedUser = await getLinkedInUser(userId);

  if (cachedUser) {
    console.log("CACHED USER DATA:", cachedUser.email_verified);
    return cachedUser;
  }

  const client = linkedinClient();
  client.setDebugParams({ enabled: true });

  try {
    const response = await client.get({
      resourcePath: "/userinfo",
      accessToken: accessToken,
    });

    const data = response.data;

    // console.log("LinkedIn User Data:", data);

    const user = data as LinkedInUser;

    const linkedinUser = {
      sub: user.sub,
      email_verified: user.email_verified,
      name: user.name,
      given_name: user.given_name,
      family_name: user.family_name,
      email: user.email,
      picture: user.picture,
      locale: {
        country: user.locale.country,
        language: user.locale.language,
      },
    };

    const savedUser = await saveLinkedInUser(userId, linkedinUser);

    return savedUser;
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error);
    return null;
  }
};

export const deleteLinkedin = async (userId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    return {
      type: "error",
      message: "Unauthorized.",
    };
  }

  const success = await disconnectLinkedInAccount(user.id);

  if (success) {
    return {
      status: "success",
      message: "LinkedIn account disconnected successfully.",
      data: true,
    };
  } else {
    return {
      status: "error",
      message: "Failed to disconnect LinkedIn account.",
      data: false,
    };
  }
};
