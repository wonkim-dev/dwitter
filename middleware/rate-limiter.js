import rateLimit from "express-rate-limit";
import { config } from "../config.js";

export default rateLimit({
  windowMs: config.rateLimit.windowMs, // time frame in ms for which requests are checked
  max: config.rateLimit.maxRequest, // max number of connections during windowMs
  keyGenerator: (req, res) => "dwitter",
});
