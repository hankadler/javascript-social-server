import { fileURLToPath } from "url";
import config from "../../src/config";
import users from "../assets/users";
import User from "../../src/api/v1/models/User";
import { createUser } from "../../src/api/v1/services/userService";
import database from "../../src/db";

const setupDB = async (env, keepAlive = false) => {
  if (env === "prod") {
    console.error("Operation available only in 'dev' or 'test' environment!");
    process.exit(1);
  }

  await database.connect(config.db.uri[env || config.env]);

  await User.deleteMany();

  await Promise.all(users.map(({
    name, email, password, activated, image, about, media, posts
  }) => createUser(
    name, email, password, password, activated, image, about, media, posts
  ).then(() => console.log(`Created '${name}'.`)))
  ).finally(() => {
    if (!keepAlive) database.disconnect(() => console.log("Disconnected from database."));
  });
};

export default setupDB;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  setupDB(process.argv[2]).catch((error) => console.error(error));
}
