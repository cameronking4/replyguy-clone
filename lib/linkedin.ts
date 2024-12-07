import axios from "axios";
import { AuthClient, RestliClient } from "linkedin-api-client";

import { getEnvVar } from "@/lib/utils";

export const linkedinAuthClient = (): AuthClient => {
  return new AuthClient({
    clientId: getEnvVar("LINKEDIN_CLIENT_ID"),
    clientSecret: getEnvVar("LINKEDIN_CLIENT_SECRET"),
    redirectUrl: getEnvVar("LINKEDIN_REDIRECT_URL"),
  });
};

export const linkedinClient = (): RestliClient => {
  const restliClient = new RestliClient();
  return restliClient;
};

export const getLinkedInAuthUrl = () => {
  const clientId = getEnvVar("LINKEDIN_CLIENT_ID");
  const redirectUri = getEnvVar("LINKEDIN_REDIRECT_URL");
  const state = "random_state_string"; // Use a secure random string
  const scope = "r_liteprofile r_emailaddress";

  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
};

export const exchangeAuthorizationCodeForToken = async (code: string) => {
  const clientId = getEnvVar("LINKEDIN_CLIENT_ID");
  const clientSecret = getEnvVar("LINKEDIN_CLIENT_SECRET");
  const redirectUri = getEnvVar("LINKEDIN_REDIRECT_URL");

  const response = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    null,
    {
      params: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data.access_token;
};
