import http from "http";
import chalk from "chalk";
import app from "./app.js";
import { PORT } from "./utils/secrets.js";
import "./database/initMongo.js";

const server = http.createServer(app);

server.listen(+PORT, () => {
  console.log(chalk.blue(`server is running on ${+PORT}`));
});
