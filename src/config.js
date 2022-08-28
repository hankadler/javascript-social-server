import { dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

// input
const _app = "social"; // app name
const _env = "dev"; // "dev" or "prod"
const _apiVersion = "1"; // version string, e.g. "1", "1.2"
const _port = "3000"; // dev port
const _jwtExpiresIn = "1h"; // JWT validity duration
const _cookieMaxAge = "3600"; // cookie duration in seconds

// output
const root = dirname(fileURLToPath(import.meta.url));
const app = _app || "app";
const env = _env || "dev";
const api = { version: _apiVersion || "1" };
api.path = `/${app}/api/v${api.version}`;
const port = _port || "3000";
const host = env === "prod" ? process.env.HOST : `http://localhost:${port}`;
const db = {
  name: env === "prod" ? app : `${app}-${env}`,
  uri: {
    dev: `${process.env.MONGO_DB_URI}/${app}-dev?retryWrites=true&w=majority`,
    test: `${process.env.MONGO_DB_URI}/${app}-test?retryWrites=true&w=majority`,
    prod: `${process.env.MONGO_DB_URI}/${app}?retryWrites=true&w=majority`
  }
};
const jwtExpiresIn = _jwtExpiresIn || "1h";
const cookieMaxAge = _cookieMaxAge || "3600";
const {
  JWT_SECRET: jwtSecret,
  EMAIL_USER: emailUser,
  EMAIL_PASS: emailPass,
  EMAIL_HOST: emailHost,
  EMAIL_PORT: emailPort,
} = process.env;
const { FAKE_PASS: fakePass } = process.env;

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
