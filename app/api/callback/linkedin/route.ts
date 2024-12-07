import { NextRequest, NextResponse } from "next/server";

import { linkedinAuthClient } from "@/lib/linkedin";
import {
  deleteLinkedInState,
  getLinkedInState,
  saveLinkedInToken,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const code = params.get("code");
    const state = params.get("state");
    console.log("\n params", params);

    if (!code || !state) {
      console.error("Authorization code or state missing");
      return NextResponse.json(
        { message: "Authorization code or state missing" },
        { status: 400 },
      );
    }

    const storedState = await getLinkedInState(state);
    if (!storedState) {
      console.error("Invalid state", storedState);
      return NextResponse.json({ message: "Invalid state" }, { status: 400 });
    }

    if (state !== storedState.state) {
      console.error("Invalid state", storedState);
      return NextResponse.json({ message: "Invalid state" }, { status: 400 });
    }

    const authClient = linkedinAuthClient();
    const token = await authClient.exchangeAuthCodeForAccessToken(code);

    if (!token) {
      console.error(
        "Failed to exchange authorization code for access token",
        token,
      );
      return NextResponse.json(
        { message: "Failed to exchange authorization code for access token" },
        { status: 500 },
      );
    }

    console.log("token", token);
    await saveLinkedInToken(storedState.userId, {
      accessToken: token.access_token,
      expiresIn: token.expires_in,
      scope: token.scope,
      tokenType: "Bearer",
      // @ts-ignore
      idToken: token.id_token,
    });
    await deleteLinkedInState(state);

    return NextResponse.redirect(
      "http://localhost:3000/dashboard/integrations",
    );
  } catch (error: any) {
    console.error("Error saving LinkedIn token:", error);
    return NextResponse.json(
      { message: "Error saving LinkedIn token" },
      { status: 500 },
    );
  }
}
