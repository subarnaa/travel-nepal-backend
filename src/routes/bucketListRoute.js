import express from "express";
import {
  addToBucketlist,
  removeFromBucketlist,
  getAllBucketList,
  updateBucketListItem,
} from "../controller/bucketlist.js";
import { denyGuest } from "../utils/authorization.js";

const router = express.Router();

router.route("/").get(denyGuest, getAllBucketList);

router
  .route("/:id")
  .post(denyGuest, addToBucketlist)
  .delete(denyGuest, removeFromBucketlist)
  .put(denyGuest, updateBucketListItem);

export default router;
