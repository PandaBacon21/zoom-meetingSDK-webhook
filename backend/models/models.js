import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export class UserModel {
  constructor(id, email, password, zoomAuth, tokenId) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.zoomAuth = zoomAuth;
    this.tokenId = tokenId;
  }

  static async setPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  static async checkPassword(storedHash, password) {
    return await bcrypt.compare(password, storedHash);
  }

  static async createUser(email, password) {
    const hashedPassword = await UserModel.setPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        zoomAuth: false,
      },
    });
    return new UserModel(
      user.id,
      user.email,
      user.password,
      user.zoomAuth,
      user.tokenId
    );
  }

  static async getUser(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new UserModel(
      user.id,
      user.email,
      user.password,
      user.zoomAuth,
      user.tokenId
    );
  }

  static async authenticate(email, password) {
    const user = await UserModel.getUser(email);

    if (!user) return null;

    const isAuth = await UserModel.checkPassword(user.password, password);
    return isAuth ? user : null;
  }
}
