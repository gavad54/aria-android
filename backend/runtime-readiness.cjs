"use strict";

async function inspectRuntimeReadiness(options = {}) {
  const databaseRequired = options.databaseRequired !== false;
  const databaseConfigured = options.databaseConfigured === true;
  const database = {
    required: databaseRequired,
    configured: databaseConfigured,
    connected: false,
    errorCode: null
  };

  if (!databaseConfigured) {
    database.errorCode = "DATABASE_URL_MISSING";
  } else if (typeof options.databaseProbe !== "function") {
    database.errorCode = "DATABASE_PROBE_UNAVAILABLE";
  } else {
    try {
      await options.databaseProbe();
      database.connected = true;
    } catch {
      database.errorCode = "DATABASE_UNAVAILABLE";
    }
  }

  const providers = [];
  for (const provider of Array.isArray(options.providers) ? options.providers : []) {
    const required = provider.required === true;
    const configured = provider.configured === true;
    const result = {
      name: String(provider.name || "unknown"),
      required,
      configured,
      connected: false,
      errorCode: null
    };

    if (!configured) {
      result.errorCode = "PROVIDER_CREDENTIALS_MISSING";
    } else if (!required) {
      result.errorCode = "OPTIONAL_PROVIDER_NOT_PROBED";
    } else if (typeof provider.probe !== "function") {
      result.errorCode = "PROVIDER_PROBE_UNAVAILABLE";
    } else {
      try {
        await provider.probe();
        result.connected = true;
      } catch {
        result.errorCode = "PROVIDER_UNAVAILABLE";
      }
    }
    providers.push(result);
  }

  const ready =
    (!databaseRequired || (database.configured && database.connected)) &&
    providers.every(provider => !provider.required || (provider.configured && provider.connected));

  return { ready, database, providers };
}

module.exports = { inspectRuntimeReadiness };
