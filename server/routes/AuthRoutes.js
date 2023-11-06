import {Router} from "express";
import {
  checkUser,
  getAllUsers,
  onBoardUser,
} from "../controllers/AuthController.js";
const router = Router();

router.post("/check-user", checkUser, (req, res, next) => {});
router.post("/onboard-user", onBoardUser, (req, res, next) => {});
router.get("/get-contacts", getAllUsers, (req, res) => {});
export default router;
