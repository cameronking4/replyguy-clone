"use server";

import {
  MicroworldsTwitterScraperRequest,
  MicroworldsTwitterScraperRequestSchema,
  TweetScraperRequest,
  TweetScraperRequestSchema,
} from "@/schemas/apify";
import { Result } from "@/types";

export const scrapeMicroworldsTweets = async (
  payload: MicroworldsTwitterScraperRequest,
): Promise<Result<null>> => {
  const validationResult =
    MicroworldsTwitterScraperRequestSchema.safeParse(payload);

  if (!validationResult.success) {
    return {
      type: "error",
      message: validationResult.error.errors
        .map((err) => err.message)
        .join(", "),
      data: null,
    };
  }

  try {
    const response = await fetch(
      "https://api.apify.com/v2/acts/microworlds~twitter-scraper/run-sync-get-dataset-items?clean=true&format=json&fields=url,created_at,full_text,favorite_count,retweet_count",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.APIFY_TOKEN}`,
        },
        body: JSON.stringify(validationResult.data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();

      console.log("Error Data:", errorData); // Log the error data for debugging

      return {
        type: "error",
        message: errorData.message || "An error occurred",
        data: null,
      };
    }

    const responseData = await response.json();
    console.log("Response Data:", responseData); // Log the response data for debugging

    return {
      type: "success",
      message: "Tweets scraped successfully",
      data: responseData,
    };
  } catch (error: any) {
    return {
      type: "error",
      message: error.message,
      data: null,
    };
  }
};

export const scrapeTweetsV2 = async (
  payload: TweetScraperRequest,
): Promise<Result<any>> => {
  // Validate request data
  const validationResult = TweetScraperRequestSchema.safeParse(payload);

  if (!validationResult.success) {
    return {
      type: "error",
      message: validationResult.error.errors
        .map((err) => err.message)
        .join(", "),
      data: null,
    };
  }

  try {
    const response = await fetch(
      "https://api.apify.com/v2/acts/apidojo~tweet-scraper/run-sync-get-dataset-items?clean=true&format=json&fields=url,twitterUrl,id,text,retweetCount,replyCount,likeCount,quoteCount,createdAt,bookmarkCount,isRetweet,isQuote",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.APIFY_TOKEN}`,
        },
        body: JSON.stringify(validationResult.data),
      },
    );

    if (!response.ok) {
      console.log("Response Error:", response, response.statusText);
      const errorData = await response.json();
      console.log("Error Data:", errorData); // Log the error data for debugging

      return {
        type: "error",
        message: errorData.error.message || "An error occurred",
        data: null,
      };
    }

    const responseData = await response.json();
    console.log("Response Data:", responseData); // Log the response data for debugging

    return {
      type: "success",
      message: "Tweets scraped successfully",
      data: responseData,
    };
  } catch (error: any) {
    console.error("Error:", error); // Log the error for debugging
    return {
      type: "error",
      message: error.message,
      data: null,
    };
  }
};
