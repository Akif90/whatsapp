import {Router} from "express";
import {checkUser} from "../controllers/AuthController.js";
const router = Router();

router.post("/check-user", checkUser, (req, res, next) => {});

export default router;
