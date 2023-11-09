import {Router} from "express";
import {
  addImageMessage,
  addMessage,
  getMessages,
} from "../controllers/MessageController.js";
import multer from "multer";

const uploadImage = multer({dest: "uploads/images"});
const router = Router();
router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to", getMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);

export default router;
