import {Router} from "express";
import {
  checkUser,
  generateToken,
  getAllUsers,
  onBoardUser,
} from "../controllers/AuthController.js";
const router = Router();

router.post("/check-user", checkUser, (req, res, next) => {});
router.post("/onboard-user", onBoardUser, (req, res, next) => {});
router.get("/get-contacts", getAllUsers, (req, res) => {});
router.get("/generate-token/:userId", generateToken);
export default router;
