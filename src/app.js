const fs = require("fs-extra");
const querystring = require("querystring");
const jsforce = require("jsforce");
const axios = require("axios");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const url = require("url");

const env = require("./environment");

// The private key that corresponds to the connected app in which certificate is uploaded.
const privatekey = fs.readFileSync("privatekey.pem");

let jwtparams = {
  aud: env.sfUrl,
  prn: env.username,
  iss: env.clientId,
  exp: parseInt(moment().add(5, "minutes").format("X")),
};

let jwtoken = jwt.sign(jwtparams, privatekey, { algorithm: "RS256" });

let sfParams = {
  grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
  assertion: jwtoken,
};

const sfTokenURL = new url.URL("/services/oauth2/token", env.sfUrl).toString();

const logintoSalesforce = async () => {
  // preparing to connect to salesforce using jwt token
  const auth = await axios.post(sfTokenURL, querystring.stringify(sfParams));
  // success will give access token that can be used in subsequent steps.
  const conn = new jsforce.Connection({
    instanceUrl: auth.data.instance_url,
    accessToken: auth.data.access_token,
  });
  // once connection is established continue further operations.
  const cases = conn.query("SELECT Id, Subject FROM Case LIMIT 2");
  return cases;
};

logintoSalesforce()
  .then((result) => {
    console.log("result", result);
  })
  .catch((e) => {
    console.log("e", e);
  });
