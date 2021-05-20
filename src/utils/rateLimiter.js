import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 60 * 60, // 1hour
  max: 1000, // limit each IP to 100 requests per windowMs
});

export default limiter;
