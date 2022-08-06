import request from "supertest";
import config from "../../../src/config";
import setupDB from "../../utils/setupDB";
import db from "../../../src/db";
import app from "../../../src/app";
import User from "../../../src/api/v1/models/User";

let pass;
let response;
let tokenCookie;

beforeAll(() => setupDB("test", true));

afterAll(() => db.drop().then(() => db.disconnect()));

beforeEach(() => {
  pass = 0;
  response = undefined;
});

afterEach(() => {
  if (!pass) console.debug(response.body);
});

describe("POST auth/sign-up-now", () => {
  test("throws 'AuthError' when account already exists", async () => {
    response = await request(app)
      .post(`${config.api.path}/auth/sign-up-now`)
      .send({
        name: "Pepe",
        email: "pepe@email.com",
        password: "1234",
        passwordAgain: "1234",
      })
      .set("Accept", "*/*");

    expect(response.body.error.name).toBe("AuthError");

    pass = 1;
  });

  test("creates new user with activated account", async () => {
    response = await request(app)
      .post(`${config.api.path}/auth/sign-up-now`)
      .send({
        name: "Hank Adler",
        email: "hankadler@email.com",
        password: "1234",
        passwordAgain: "1234",
      })
      .set("Accept", "*/*");

    const { userId } = response.body;
    const { activated } = await User.findById(userId);

    expect(userId && activated).toBeTruthy();

    pass = 1;
  });
});

describe("POST auth/sign-up", () => {
  test("sends activation email", async () => {
    response = await request(app)
      .post(`${config.api.path}/auth/sign-up`)
      .send({
        name: "Henry Aguila",
        email: "henry.aguila@outlook.com",
        password: "1234",
        passwordAgain: "1234",
      })
      .set("Accept", "*/*");

    const { accepted } = response.body.info;

    expect(accepted).toBeTruthy();

    console.warn("Manually check email inbox and verify activation works!");

    pass = 1;
  });
});

describe("POST auth/sign-in", () => {
  test("responds with 401 on bad credentials", async () => {
    response = await request(app)
      .post(`${config.api.path}/auth/sign-in`)
      .send({
        email: "nonsense",
        password: "nonsense"
      })
      .set("Accept", "*/*");

    expect(response.statusCode).toBe(401);

    pass = 1;
  });

  test("responds with 200 on good credentials", async () => {
    response = await request(app)
      .post(`${config.api.path}/auth/sign-in`)
      .send({
        email: "pepe@email.com",
        password: "1234"
      })
      .set("Accept", "*/*");

    expect(response.statusCode).toBe(200);

    pass = 1;
  });

  test("sets cookie", async () => {
    response = await request(app)
      .post(`${config.api.path}/auth/sign-in`)
      .send({
        email: "pepe@email.com",
        password: "1234"
      })
      .set("Accept", "*/*");

    const cookies = response.headers["set-cookie"];
    [tokenCookie] = cookies.filter((cookie) => cookie.startsWith("token="));
    const token = tokenCookie.replace("token=", "");

    expect(token).not.toBe("");

    pass = 1;
  });

  test("unlocks restricted routes", async () => {
    response = await request(app)
      .get(`${config.api.path}/users`)
      .set("Cookie", tokenCookie);

    expect(response.statusCode).toBe(200);

    pass = 1;
  });
});

describe("DELETE auth/sign-out", () => {
  test("deletes cookie", async () => {
    response = await request(app).delete(`${config.api.path}/auth/sign-out`);

    const cookies = response.headers["set-cookie"];
    [tokenCookie] = cookies.filter((cookie) => cookie.startsWith("token="));
    const token = tokenCookie.replace("token=", "");

    expect(token).toEqual("");

    pass = 1;
  });
});
