import { dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const root = dirname(fileURLToPath(import.meta.url));
const app = process.env.APP || "app";
const env = process.env.ENV || "dev";
const api = { version: process.env.VERSION || "1" };
api.path = `/${app}/api/v${api.version}`;
const port = process.env.PORT || "3000";
const host = env === "prod" ? process.env.HOST : `http://localhost:${port}`;
const db = {
  name: env === "prod" ? app : `${app}-${env}`,
  uri: {
    dev: `${process.env.MONGO_DB_URI}/${app}-dev?retryWrites=true&w=majority`,
    test: `${process.env.MONGO_DB_URI}/${app}-test?retryWrites=true&w=majority`,
    prod: `${process.env.MONGO_DB_URI}/${app}?retryWrites=true&w=majority`
  }
};
const {
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: jwtExpiresIn,
  COOKIE_MAX_AGE: cookieMaxAge,
  EMAIL_USER: emailUser,
  EMAIL_PASS: emailPass,
  EMAIL_HOST: emailHost,
  EMAIL_PORT: emailPort,
  FAKE_PASS: fakePass
} = process.env;

export default {
  root,
  env,
  api,
  port,
  host,
  db,
  jwtExpiresIn,
  cookieMaxAge,
  jwtSecret,
  emailUser,
  emailPass,
  emailHost,
  emailPort,
  fakePass
};
