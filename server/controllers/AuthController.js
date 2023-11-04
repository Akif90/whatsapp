import generatePrismaClient from "../utils/PrismaClient.js";

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
    await prisma.user.create({
      data: {
        email,
        name,
        about,
        profilePicture,
      },
    });

    return res.json({msg: "Success", status: true});
  } catch (error) {
    next(error);
  }
};
