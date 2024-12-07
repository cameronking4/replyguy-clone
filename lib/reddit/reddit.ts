export async function getRedditAccessToken() {
    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "password",
        username: process.env.REDDIT_USERNAME!,
        password: process.env.REDDIT_PASSWORD!,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(`Failed to obtain Reddit access token: ${data.error}`);
    }
  
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  }


export class RedditClient {
    private accessToken: string;
  
    constructor(accessToken: string) {
      this.accessToken = accessToken;
    }
  
    async searchPosts(query: string, after: string | null = null) {
      const searchParams = new URLSearchParams({
        q: query,
        sort: "relevance",
        limit: "10",
      });
      if (after) {
        searchParams.append("after", after);
      }
  
      const response = await fetch(`https://oauth.reddit.com/search?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "User-Agent": "your-app-name",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch posts for query: ${query}`);
      }
  
      return response.json();
    }
  }
  
  