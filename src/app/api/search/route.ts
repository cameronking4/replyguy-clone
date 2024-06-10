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
  const hl = searchParams.get("hl") || "en";
  const gl = searchParams.get("gl") || "us";
  const safe = searchParams.get("safe") || "off";
  const tbs = searchParams.get("tbs") || "";
  const sort = searchParams.get("sort") || "";

  try {
    const response = await axios.get<SerpApiResponse>(
      "https://serpapi.com/search",
      {
        params: {
          engine: "google",
          q: `site:${platform} ${q}`,
          api_key: serpApiKey,
          num: num,
          location: location,
          device: device,
          hl: hl,
          gl: gl,
          safe: safe,
          tbs: tbs,
          sort: sort,
        },
      },
    );

    const results = response.data.organic_results;
    console.log(`${platform} Results:`, results);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error(`Error fetching ${platform} data:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
