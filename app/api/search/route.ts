import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const serpApiKey = process.env.SERP_API_KEY;

interface SerpApiResponse {
  organic_results: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("keywords") || "";
  const platform = searchParams.get("platform") || "";
  const num = parseInt(searchParams.get("num") || "10");
  const location = searchParams.get("location") || "";
  const device = searchParams.get("device") || "desktop";
  const hl = searchParams.get("language") || "en";
  const gl = searchParams.get("country") || "us";
  const safe = searchParams.get("safe") || "off";
  const tbs =
    searchParams.get("timeRange") !== "all"
      ? searchParams.get("timeRange")
      : "";
  const sort = searchParams.get("sort") || "";

  const params: Record<string, string | number> = {
    engine: "google",
    q: `site:${platform} ${q}`,
    api_key: serpApiKey,
    num: num,
    device: device,
    hl: hl,
    gl: gl,
    safe: safe,
    sort: sort,
  };

  if (location) params.location = location;
  if (tbs) params.tbs = tbs;

  try {
    const response = await axios.get<SerpApiResponse>(
      "https://serpapi.com/search",
      { params },
    );

    const results = response.data.organic_results;
    // const results = response.data.organic_results.map((result) => ({
    //   title: result.title,
    //   link: result.link,
    //   snippet: result.snippet,
    // }));
    console.log(`${platform} Results:`, results);

    return NextResponse.json(results || [], { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Platform scrape error occurred";
    console.error(`Error fetching data from ${platform}:`, message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
