import generatePrismaClient from "../utils/PrismaClient.js";
import {generateToken04} from "../utils/TokenGenerator.js";

export const checkUser = async (req, res, next) => {
  try {
    const {email} = req.body;
    if (!email) return res.json({msg: "Email Required", status: false});
    const prismaClient = generatePrismaClient();
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return res.json({msg: "User not found", status: false});
    return res.json({msh: "User found", status: true, data: user});
  } catch (error) {
    next(error);
  }
};

export const onBoardUser = async (req, res, next) => {
  try {
    const {name, email, about, image: profilePicture} = req.body;
    if (!email || !name || !profilePicture)
      return res.send("Email, Name and Image are required");

    const prisma = generatePrismaClient();
    const user = await prisma.user.create({
      data: {
        email,
        name,
        about,
        profilePicture,
      },
    });

    return res.json({msg: "Success", status: true, user});
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = generatePrismaClient();
    const users = await prisma.user.findMany({
      orderBy: {name: "asc"},
      select: {
        id: true,
        email: true,
        name: true,
        about: true,
        profilePicture: true,
      },
    });
    const usersGroupedByInititalLetter = {};
    users.forEach((user) => {
      const initalLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupedByInititalLetter[initalLetter]) {
        usersGroupedByInititalLetter[initalLetter] = [];
      }
      usersGroupedByInititalLetter[initalLetter].push(user);
    });
    return res.status(200).send({users: usersGroupedByInititalLetter});
  } catch (error) {
    next(error);
  }
};

export const generateToken = async (req, res, next) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverId = process.env.ZEGO_SERVER_ID;
    const userId = req.params.userId;
    const effectiveTime = 3600;
    const payload = "";
    if (appId && serverId && userId) {
      const token = generateToken04(
        appId,
        userId,
        serverId,
        effectiveTime,
        payload
      );
      return res.status(200).json({token});
    }
    return res.status(400).send("App Id, UserId and ServerId are required");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
