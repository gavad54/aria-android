"use strict";

function databaseSslConfig(env = process.env) {
  if (env.DATABASE_SSL !== "true") return undefined;
  const config = { rejectUnauthorized: true };
  if (typeof env.DATABASE_SSL_CA === "string" && env.DATABASE_SSL_CA.trim()) {
    config.ca = env.DATABASE_SSL_CA
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .trim();
  }
  return config;
}

module.exports = { databaseSslConfig };
