import dotenv from "dotenv";
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)),
  },
  host: {
    port: parseInt(required("PORT", 8080)),
  },
  db: {
    host: required("DB_HOST"),
    hostTest: required("DB_HOST_TEST"),
  },
  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN", "*"),
  },
  csrf: {
    plainToken: required("CSRF_SECRET_KEY"),
  },
  rateLimit: {
    windowMs: parseInt(required("RATE_LIMIT_WINDOW", 60000)),
    maxRequest: parseInt(required("RATE_LIMIT_MAX_REQUEST", 10)),
  },
};
