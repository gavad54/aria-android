"use strict";

function databaseSslConfig(env = process.env) {
  if (env.DATABASE_SSL !== "true") return undefined;
  const config = { rejectUnauthorized: true };
  if (typeof env.DATABASE_SSL_CA === "string" && env.DATABASE_SSL_CA.trim()) {
    config.ca = env.DATABASE_SSL_CA;
  }
  return config;
}

module.exports = { databaseSslConfig };
