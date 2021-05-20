import Redis from "ioredis";
import chalk from "chalk";

const client = new Redis();

// init redis database

client.on("connect", () => {
  console.log(chalk.bgWhiteBright("connected to redis"));
});

client.on("error", (err) => {
  console.log(
    chalk.bgYellowBright(`connection to redis faialer ${err.message}`)
  );
});

export default client;
