import mongoose from "mongoose";
import chalk from "chalk";
import { MONGO_URI } from "../utils/secrets.js";

// init mongodb
mongoose
  .connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((c) => {
    console.log(chalk.cyan(`connected to database`));
  })
  .catch((e) => {
    console.log(chalk.bgRed(`something went wrong: ${e.message}`));
  });
