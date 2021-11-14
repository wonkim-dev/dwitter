import app from "./app.js";
import { config } from "./config.js";
import { connectDB } from "./database/database.js";

connectDB()
  .then(() => {
    app.listen(config.host.port, () => {
      console.log("Server is up on port" + config.host.port);
    });
  })
  .catch(console.error);
