import generatePrismaClient from "../utils/PrismaClient.js";

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
          reciever: {
            connect: {
              id: to,
            },
          },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: {
          sender: true,
          reciever: true,
        },
      });
      return res.status(201).send({message: newMessage});
    }
    return res.status(400).send("From, to and Message required");
  } catch (error) {
    next(error);
  }
};
