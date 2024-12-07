import {
  LinkedInState,
  LinkedInToken,
  LinkedInUser,
  TwitterProfile,
  TwitterToken,
} from "@prisma/client";

import { prisma } from "@/lib/db";

export const getTwitterToken = async (
  userId: string,
): Promise<TwitterToken | null> => {
  const data = await prisma.twitterToken.findFirst({
    where: {
      userId: userId,
    },
  });

  if (data) {
    return {
      ...data,
      id: data.id,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
    };
  }

  return null;
};

export const updateTwitterToken = async (
  userId: string,
  token: TwitterToken,
): Promise<TwitterToken | null> => {
  const data = await prisma.twitterToken.update({
    where: {
      id: token.id,
      userId: userId,
    },
    data: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: token.expiresAt,
      updatedAt: new Date(),
    },
  });

  if (data) {
    return {
      ...data,
      id: data.id,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
    };
  }

  return null;
};

export const deleteTwitterToken = async (
  userId: string,
  tokenId: string,
): Promise<boolean> => {
  const data = await prisma.twitterToken.delete({
    where: {
      userId: userId,
      id: tokenId,
    },
  });

  if (data) {
    return true;
  }

  return false;
};

export async function saveOAuthState(
  userId: string,
  state: string,
  codeVerifier: string,
) {
  try {
    const data = await prisma.oAuthState.create({
      data: {
        userId,
        state,
        codeVerifier,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      },
    });
    console.log("OAuth2 State saved successfully.");
    return data;
  } catch (error) {
    console.error("Failed to save OAuth2 State:", error);
  }
}

export async function saveTwitterProfile(userId: string, profileData: any) {
  const publicMetrics = profileData.public_metrics || {};

  return await prisma.twitterProfile.upsert({
    where: {
      userId_twitterId: {
        userId,
        twitterId: profileData.id,
      },
    },
    update: {
      username: profileData.username,
      name: profileData.name,
      description: profileData.description,
      profileImageUrl: profileData.profile_image_url,
      verified: profileData.verified,
      location: profileData.location,
      followersCount: publicMetrics.followers_count,
      followingCount: publicMetrics.following_count,
      tweetCount: publicMetrics.tweet_count,
      likeCount: publicMetrics.like_count,
      listedCount: publicMetrics.listed_count,
      updatedAt: new Date(),
    },
    create: {
      userId,
      twitterId: profileData.id,
      username: profileData.username,
      name: profileData.name,
      description: profileData.description,
      profileImageUrl: profileData.profile_image_url,
      verified: profileData.verified,
      location: profileData.location,
      followersCount: publicMetrics.followers_count,
      followingCount: publicMetrics.following_count,
      tweetCount: publicMetrics.tweet_count,
      likeCount: publicMetrics.like_count,
      listedCount: publicMetrics.listed_count,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getTwitterProfile(
  userId: string,
): Promise<TwitterProfile | null> {
  return await prisma.twitterProfile.findFirst({
    where: {
      userId,
    },
  });
}

export const saveLinkedInToken = async (
  userId: string,
  token: {
    accessToken: string;
    expiresIn: number;
    scope: string;
    tokenType: string;
    idToken: string;
  },
): Promise<LinkedInToken | null> => {
  try {
    const data = await prisma.linkedInToken.create({
      data: {
        userId,
        accessToken: token.accessToken,
        expiresIn: token.expiresIn,
        scope: token.scope,
        tokenType: token.tokenType,
        idToken: token.idToken,
      },
    });

    return {
      ...data,
      id: data.id,
      accessToken: data.accessToken,
      expiresIn: data.expiresIn,
      scope: data.scope,
      tokenType: data.tokenType,
      idToken: data.idToken,
    };
  } catch (error) {
    console.error("Error saving LinkedIn token:", error);
    return null;
  }
};

export const getLinkedInToken = async (
  userId: string,
): Promise<LinkedInToken | null> => {
  try {
    const data = await prisma.linkedInToken.findFirst({
      where: {
        userId,
      },
    });

    if (data) {
      return {
        ...data,
        id: data.id,
        accessToken: data.accessToken,
        expiresIn: data.expiresIn,
        scope: data.scope,
        tokenType: data.tokenType,
        idToken: data.idToken,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting LinkedIn token:", error);
    return null;
  }
};

export const updateLinkedInToken = async (
  userId: string,
  token: {
    id: string;
    accessToken: string;
    expiresIn: number;
    scope: string;
    tokenType: string;
    idToken: string;
  },
): Promise<LinkedInToken | null> => {
  try {
    const data = await prisma.linkedInToken.update({
      where: {
        id: token.id,
        userId: userId,
      },
      data: {
        accessToken: token.accessToken,
        expiresIn: token.expiresIn,
        scope: token.scope,
        tokenType: token.tokenType,
        idToken: token.idToken,
        updatedAt: new Date(),
      },
    });

    if (data) {
      return {
        ...data,
        id: data.id,
        accessToken: data.accessToken,
        expiresIn: data.expiresIn,
        scope: data.scope,
        tokenType: data.tokenType,
        idToken: data.idToken,
      };
    }

    return null;
  } catch (error) {
    console.error("Error updating LinkedIn token:", error);
    return null;
  }
};

export const deleteLinkedInToken = async (
  userId: string,
  tokenId: string,
): Promise<boolean> => {
  try {
    const data = await prisma.linkedInToken.delete({
      where: {
        userId: userId,
        id: tokenId,
      },
    });

    if (data) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error deleting LinkedIn token:", error);
    return false;
  }
};

export const saveLinkedInState = async (
  userId: string,
  state: string,
): Promise<LinkedInState | null> => {
  try {
    const data = await prisma.linkedInState.create({
      data: {
        userId,
        state,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      },
    });

    return data;
  } catch (error) {
    console.error("Error saving LinkedIn state:", error);
    return null;
  }
};

export const getLinkedInState = async (
  state: string,
): Promise<LinkedInState | null> => {
  try {
    const data = await prisma.linkedInState.findFirst({
      where: {
        state,
      },
    });

    return data;
  } catch (error) {
    console.error("Error getting LinkedIn state:", error);
    return null;
  }
};

export const deleteLinkedInState = async (state: string): Promise<boolean> => {
  try {
    await prisma.linkedInState.delete({
      where: {
        state,
      },
    });

    return true;
  } catch (error) {
    console.error("Error deleting LinkedIn state:", error);
    return false;
  }
};

export const saveLinkedInUser = async (
  userId: string,
  linkedinUser: {
    sub: string;
    email_verified: boolean;
    name: string;
    locale: {
      country: string;
      language: string;
    };
    given_name: string;
    family_name: string;
    email: string;
    picture: string;
  },
): Promise<LinkedInUser | null> => {
  try {
    const data = await prisma.linkedInUser.upsert({
      where: { sub: linkedinUser.sub },
      update: {
        name: linkedinUser.name,
        given_name: linkedinUser.given_name,
        family_name: linkedinUser.family_name,
        email: linkedinUser.email,
        picture: linkedinUser.picture,
        email_verified: linkedinUser.email_verified,
        locale_country: linkedinUser.locale.country,
        locale_language: linkedinUser.locale.language,
        updatedAt: new Date(),
      },
      create: {
        userId,
        sub: linkedinUser.sub,
        name: linkedinUser.name,
        given_name: linkedinUser.given_name,
        family_name: linkedinUser.family_name,
        email: linkedinUser.email,
        picture: linkedinUser.picture,
        email_verified: linkedinUser.email_verified,
        locale_country: linkedinUser.locale.country,
        locale_language: linkedinUser.locale.language,
      },
    });

    return data;
  } catch (error) {
    console.error("Error saving LinkedIn user:", error);
    return null;
  }
};

export const getLinkedInUser = async (
  userId: string,
): Promise<LinkedInUser | null> => {
  try {
    const data = await prisma.linkedInUser.findFirst({
      where: { userId },
    });

    return data;
  } catch (error) {
    console.error("Error getting LinkedIn user:", error);
    return null;
  }
};

export const disconnectLinkedInAccount = async (
  userId: string,
): Promise<boolean> => {
  try {
    await prisma.linkedInToken.deleteMany({
      where: { userId },
    });

    await prisma.linkedInUser.deleteMany({
      where: { userId },
    });

    return true;
  } catch (error) {
    console.error("Error disconnecting LinkedIn account:", error);
    return false;
  }
};
