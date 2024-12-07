import "server-only";

import querystring from "querystring";
import axios, { AxiosInstance } from "axios";

import {
  RedditCommentResult,
  RedditPost,
  RedditSearchResult,
} from "@/types/reddit";

export const redditConfig = {
  clientId: process.env.REDDIT_CLIENT_ID || "",
  clientSecret: process.env.REDDIT_CLIENT_SECRET || "",
  username: process.env.REDDIT_USERNAME || "",
  password: process.env.REDDIT_PASSWORD || "",
  state: process.env.REDDIT_STATE || "",
  redirectUri: process.env.REDDIT_REDIRECT_URI || "",
  authorizationCode: process.env.REDDIT_AUTHORIZATION_CODE || "",
  accessToken: process.env.REDDIT_ACCESS_TOKEN || "",
  refreshToken: process.env.REDDIT_REFRESH_TOKEN || "",
};

export const getRedditAccessToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const auth = Buffer.from(
    `${redditConfig.clientId}:${redditConfig.clientSecret}`,
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: redditConfig.authorizationCode,
        redirect_uri: redditConfig.redirectUri,
      }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
          //   "User-Agent": "YourAppName/0.1 by YourUsername",
        },
      },
    );

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  } catch (error) {
    const errorMessage = error.response
      ? JSON.stringify(error.response.data)
      : error.message;

    console.error("Error details:", {
      url: "https://www.reddit.com/api/v1/access_token",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "YourAppName/0.1 by YourUsername",
      },
      params: {
        grant_type: "authorization_code",
        code: redditConfig.authorizationCode,
        redirect_uri: redditConfig.redirectUri,
      },
      error: errorMessage,
    });

    throw new Error(`Error getting access token: ${errorMessage}`);
  }
};

export class RedditClient {
  private client: AxiosInstance;

  constructor(accessToken: string) {
    this.client = axios.create({
      baseURL: "https://oauth.reddit.com",
      headers: {
        Authorization: `bearer ${accessToken}`,
        "User-Agent": "YourAppName/0.1 by YourUsername",
      },
    });
  }

  async searchPosts(
    keyword: string,
    after: string | null = null,
    limit: number = 25,
  ): Promise<RedditSearchResult> {
    const response = await this.client.get("/search", {
      params: {
        q: keyword,
        sort: "new",
        limit,
        after,
      },
    });

    const posts: RedditPost[] = response.data.data.children.map(
      (child: any) => ({
        id: child.data.id,
        title: child.data.title,
        selftext: child.data.selftext,
        url: child.data.url,
        author: child.data.author,
        subreddit: child.data.subreddit,
        ups: child.data.ups,
        downs: child.data.downs,
        num_comments: child.data.num_comments,
        created_utc: child.data.created_utc,
      }),
    );

    return {
      posts,
      after: response.data.data.after,
    };
  }

  async commentOnPost(
    postId: string,
    commentText: string,
  ): Promise<RedditCommentResult> {
    const response = await this.client.post("/api/comment", {
      api_type: "json",
      text: commentText,
      thing_id: `t3_${postId}`,
    });

    const commentData = response.data.json.data.things[0].data;
    return {
      id: commentData.id,
      body: commentData.body,
    };
  }
}
