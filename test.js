import Rollbar from "rollbar";
import got from "got";

const rollbar = initRollbar();

function initRollbar() {
  const token = process.env.ROLLBAR_ACCESS_TOKEN;
  if (token != null) {
    console.log("Rollbar error logging is enabled");
  } else {
    console.log("Rollbar error logging is disabled");
  }
  return new Rollbar({
    environment: "development",
    codeVersion: process.env.COMMIT_HASH,
    accessToken: token,
    captureUncaught: true,
    captureUnhandledRejections: true,
    verbose: true,
    enabled: true,
    transmit: true,
    autoInstrument: {
      network: true,
      log: true,
    },
  });
}

export function captureException(err, req) {
  if (isApiError(err)) {
    if (err.statusCode < 500) {
      return;
    }
  }
  rollbar.error(err, req);
}

console.log("some logs to rollbar");

got("https://httpbin.org/status/500").catch((err) => {
  console.log("got error", err);
  rollbar.error(err);
});
