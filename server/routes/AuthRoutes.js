import {Router} from "express";
import {checkUser, onBoardUser} from "../controllers/AuthController.js";
const router = Router();

router.post("/check-user", checkUser, (req, res, next) => {});
router.post("/onboard-user", onBoardUser, (req, res, next) => {});
export default router;
