const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");

// Initialise the client.
const client = gocardless(
    process.env.GC_ACCESS_TOKEN,
    constants.Environments.Sandbox,
    { raiseOnIdempotencyConflict: true }
);

export default client;
