import express from "express";
import { getUser} from "../controller/user.js";
import { denyGuest } from "../utils/authorization.js";

const router = express.Router();

router.route("/").get(denyGuest, getUser);

export default router;
