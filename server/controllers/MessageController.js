import generatePrismaClient from "../utils/PrismaClient.js";
import {renameSync} from "fs";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = generatePrismaClient();
    const {message, from, to} = req.body;
    const getUser = onlineUsers.get(to);
    if (message && from && to) {
      const newMessage = await prisma.message.create({
        data: {
          message,
          sender: {
            connect: {
              id: from,
            },
          },
          receiver: {
            connect: {
              id: to,
            },
          },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
      return res.status(201).send({message: newMessage});
    }
    return res.status(400).send("From, to and Message required");
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const prisma = generatePrismaClient();
    const {from, to} = req.params;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: from,
            receiverId: to,
          },
          {
            senderId: to,
            receiverId: from,
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });

    const unreadMessages = [];
    messages.forEach((message, ind) => {
      if (message.messageStatus !== "read" && message.senderId === to) {
        messages[ind].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });
    await prisma.message.updateMany({
      where: {
        id: {
          in: unreadMessages,
        },
      },
      data: {
        messageStatus: "read",
      },
    });
    res.status(200).json({messages});
  } catch (error) {
    next(error);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/images/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = generatePrismaClient();
      const {from, to} = req.query;
      if (from && to) {
        const message = await prisma.message.create({
          data: {
            message: fileName,
            type: "image",
            sender: {connect: {id: from}},
            receiver: {connect: {id: to}},
          },
        });
        return res.status(201).json({message});
      }
      return res.status(400).send("From, to are required");
    }
    return res.status(400).send("Missing Files");
  } catch (error) {
    next(error);
  }
};
export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/recordings/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = generatePrismaClient();
      const {from, to} = req.query;
      if (from && to) {
        const message = await prisma.message.create({
          data: {
            message: fileName,
            type: "audio",
            sender: {connect: {id: from}},
            receiver: {connect: {id: to}},
          },
        });
        return res.status(201).json({message});
      }
      return res.status(400).send("From, to are required");
    }
    return res.status(400).send("Missing Files");
  } catch (error) {
    next(error);
  }
};
