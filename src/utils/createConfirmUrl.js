import { v4 } from "uuid";
import redis from "../database/initRedis.js";
import { NODE_ENV } from "./secrets.js";

/**
 * * creates url that identifies user
 * * appends redis at the url to identify user
 */
export const createConfirmUrl = async (userId) => {
  // set a unique id as key and userId as value
  const domain = "http://localhost:3000"
    // NODE_ENV === "development"
    //   ? "http://localhost:4000"
    //   : "http://travelnepal.com";
  const id = v4();
  await redis.set(id, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `${domain}/api/auth/email/confirm/${id}`;
};

export const createResetUrl = async (userId) => {
  const domain = "http://localhost:3000"
    // NODE_ENV === "development"
    //   ? "http://localhost:4000"
    //   : "http://travelnepal.com";
  // set a unique id as key and userId as value
  const id = v4();
  await redis.set(id, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `${domain}/password/recover/${id}`;
};
