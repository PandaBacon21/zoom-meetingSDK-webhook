import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TokenModel {
  constructor(
    id,
    accessToken,
    accessExpires,
    refreshToken,
    refreshExpires,
    userId
  ) {
    this.id = id;
    this.accessToken = accessToken;
    this.accessExpires = accessExpires;
    this.refreshToken = refreshToken;
    this.refreshExpires = refreshExpires;
    this.userId = userId;
  }

  static async addToken(
    userId,
    accessToken,
    accessExpires,
    refreshToken,
    refreshExpires
  ) {
    const token = await prisma.token.create({
      data: {
        accessToken,
        accessExpires,
        refreshToken,
        refreshExpires,
        user: {
          connect: { id: userId },
        },
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { tokenId: token.id, zoomAuth: true },
    });

    return new TokenModel(
      token.id,
      token.accessToken,
      token.accessExpires,
      token.refreshToken,
      token.refreshExpires,
      token.userId
    );
  }
  static async getToken(userId) {
    const token = await prisma.token.findUnique({
      where: { userId },
    });

    if (!token) return null;

    return new TokenModel(
      token.id,
      token.accessToken,
      token.accessExpires,
      token.refreshToken,
      token.refreshExpires,
      token.userId
    );
  }

  static async updateToken(
    userId,
    accessToken,
    accessExpires,
    refreshToken,
    refreshExpires
  ) {
    const token = await prisma.token.update({
      where: { userId },
      data: {
        accessToken,
        accessExpires,
        refreshToken,
        refreshExpires,
      },
    });
    return new TokenModel(
      token.id,
      token.accessToken,
      token.accessExpires,
      token.refreshToken,
      token.refreshExpires,
      token.userId
    );
  }
}

// NEED TO ADD SOMETHING TO CHECK IF REFRESH TOKEN IS ALSO EXPIRED
