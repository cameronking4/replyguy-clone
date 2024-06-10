import express, { Request, Response } from "express";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000 || process.env.PORT;

const serpApiKey = process.env.SERP_API_KEY;

interface SerpApiResponse {
  organic_results: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

app.use(express.static("public"));

// Serve the search form
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle search requests
app.get("/search", async (req: Request, res: Response) => {
  const keywords = req.query.keywords as string;
  const platform = req.query.platform as string;
  const numResults = req.query.num ? parseInt(req.query.num as string) : 10;
  const location = req.query.location as string;
  const device = (req.query.device as string) || "desktop";
  const language = (req.query.hl as string) || "en";
  const country = (req.query.gl as string) || "us";
  const safe = (req.query.safe as string) || "off";
  const timeRange = req.query.tbs as string;
  const sort = req.query.sort as string;
  let searchQuery = `${keywords} site:${platform}`;

  try {
    const response = await axios.get<SerpApiResponse>(
      "https://serpapi.com/search",
      {
        params: {
          engine: "google",
          q: searchQuery,
          api_key: serpApiKey,
          num: numResults,
          location: location,
          device: device,
          hl: language,
          gl: country,
          safe: safe,
          tbs: timeRange,
          sort: sort,
        },
      },
    );

    const results = response.data.organic_results;
    console.log(`${platform} Results:`, results);

    // Render results as HTML
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Search Results</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .result { margin-bottom: 20px; }
          .result h3 { margin: 0; }
          .result a { color: blue; text-decoration: none; }
          .form-container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }
          .form-container input, .form-container select { width: 100%; padding: 10px; margin: 5px 0; }
          .form-container button { padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="form-container">
          <h1>Search Results for "${keywords}" on ${platform}</h1>
          ${results
            .map(
              (result) => `
            <div class="result">
              <h3><a href="${result.link}" target="_blank">${result.title}</a></h3>
              <p>${result.snippet}</p>
            </div>
          `,
            )
            .join("")}
          <button onclick="history.back()">Back to Search</button>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(`Error fetching ${platform} data:`, error);
    res.status(500).send(`Error fetching ${platform} data`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
