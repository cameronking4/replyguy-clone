import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { TWITTER_CALLBACK_URL, twitterClient } from "@/lib/twitter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const state = params.get("state");
    const code = params.get("code");

    console.log("state", state);
    console.log("code", code);

    const oAuthState = await prisma.oAuthState.findUnique({
      where: {
        state: state as string,
      },
    });

    if (!oAuthState || oAuthState.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired OAuth state." },
        { status: 401 },
      );
    }

    if (state !== oAuthState.state) {
      return NextResponse.json({ message: "Invalid state" }, { status: 401 });
    }

    const client = twitterClient();

    console.log("twitter client", client);

    if (client) {
      const {
        client: loggedClient,
        accessToken,
        expiresIn,
        scope,
        refreshToken,
      } = await client.loginWithOAuth2({
        code: code as string,
        codeVerifier: oAuthState.codeVerifier,
        redirectUri: TWITTER_CALLBACK_URL,
      });

      await prisma.twitterToken.create({
        data: {
          userId: oAuthState.userId,
          accessToken: accessToken,
          refreshToken: refreshToken as string,
          expiresAt: new Date(Date.now() + expiresIn * 1000),
          scope: JSON.stringify(scope),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.redirect(
        "http://localhost:3000/dashboard/integrations",
      );
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          "Error twitter callbackurl:" + " - " + JSON.stringify(error),
      },
      { status: 500 },
    );
  }
}
