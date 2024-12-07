import axios from "axios";

interface LinkedInAuthConfig {
  clientId: string;
  clientSecret: string;
  authorizationURL: string;
  redirectURI: string;
  accessTokenURL: string;
  accessTokenFilePath: string;
}

interface PostContent {
  text: string;
  url: string;
}

interface CommentContent {
  postUrn: string;
  text: string;
}

class LinkedInAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async postArticle(userUrn: string, content: PostContent): Promise<void> {
    const apiUrl = "https://api.linkedin.com/v2/ugcPosts";
    const postContent = {
      author: userUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content.text,
          },
          shareMediaCategory: "ARTICLE",
          media: [
            {
              status: "READY",
              originalUrl: content.url,
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    try {
      const response = await axios.post(apiUrl, postContent, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "LinkedIn-Version": "202408",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });
      console.log("Post successful:", response.data);
    } catch (error) {
      console.error("Error posting article:", error);
    }
  }

  async commentOnPost(userUrn: string, content: CommentContent): Promise<any> {
    const apiUrl = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(content.postUrn)}/comments`;
    const commentContent = {
      actor: userUrn,
      message: {
        text: content.text,
      },
    };

    try {
      const response = await axios.post(apiUrl, commentContent, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "LinkedIn-Version": "202408",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });
      console.log("Comment posted successfully:", response.data);
      return response;
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }
}

export default LinkedInAPI;
