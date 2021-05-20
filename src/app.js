import express from "express";
import redis from "./database/initRedis.js";
import session from "express-session";
import connectRedis from "connect-redis";
import passport from "passport";
import "express-async-errors";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import PrettyError from "pretty-error";
import limiter from "./utils/rateLimiter.js";

// routes
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import placeRoute from "./routes/placeRoute.js";
import guideRoute from "./routes/guideRoute.js";
import bucketListRoute from "./routes/bucketListRoute.js";
import adminRoute from "./routes/adminRoute.js";

// utils
import { NODE_ENV, SESSION_SECRET } from "./utils/secrets.js";
import { serializeUser, deserializeUser } from "./utils/passportConfig.js";
import errorHandler from "./utils/errorHandler.js";
import unknownEndPointHandler from "./utils/unknownEndPoint.js";

const app = express();
// console.log(process.env.GOOGLE_OAUTH_CLIENT_ID);

// required on prod
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());

// logger
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  // preetify the errors
  const pe = new PrettyError();
  pe.start();
}

// session
// express session takes cares of parsing cookies
const RedisStore = connectRedis(session);

app.use(
  session({
    store: new RedisStore({ client: redis }),
    name: "qid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: NODE_ENV === "production",
    cookie: {
      sameSite: "lax",
      httpOnly: true,
      maxAge: 86400000,
      secure: NODE_ENV === "production",
      domain: NODE_ENV === "production" ? "TRAVELNEPAL.COM" : "localhost",
    },
  })
);

// init passport
app.use(passport.initialize());

// ! should be after express-session
// passport use session
app.use(passport.session());

// serialize user with passport
serializeUser();

// deserialize user with passport
deserializeUser();

// sanitize nosql queries
app.use(mongoSanitize());

// compress all responses
app.use(compression());

// security headers
app.use(helmet());

// limit requests from client side
app.use(limiter);

// services
import "./services/oAuthGoogle.js";
import "./services/localAuth.js";

// api routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/places", placeRoute);
app.use("/api/guide", guideRoute);
app.use("/api/buckets", bucketListRoute);
app.use("/api/admin", adminRoute);

// handle unknown routes
app.use(unknownEndPointHandler);

// custom error handler
app.use(errorHandler);

export default app;
