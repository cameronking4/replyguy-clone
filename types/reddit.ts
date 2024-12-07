export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  author: string;
  subreddit: string;
  ups: number;
  downs: number;
  num_comments: number;
  created_utc: number;
}

export interface RedditSearchResult {
  posts: RedditPost[];
  after: string | null;
}

export interface RedditCommentResult {
  id: string;
  body: string;
}
