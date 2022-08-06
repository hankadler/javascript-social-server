import config from "./config";
import db from "./db";
import app from "./app";

let server;

db.connect(config.db.uri[config.env])
  .then(() => {
    server = app.listen(config.port, () => console.log(`\nServer on port: ${config.port}\n`));
  })
  .catch((err) => {
    console.log(err.message);
    process.kill(process.pid, "SIGTERM");
  });

process.on("SIGTERM", () => {
  db.disconnect(() => console.log("Disconnected from db"));
  server.close(() => console.log("Server closed"));
});
