import * as jws from "jws"; // https://www.npmjs.com/package/jws
import * as qs from "qs"; // https://www.npmjs.com/package/qs
import * as moment from "moment"; // https://www.npmjs.com/package/moment
import * as fs from "fs"; // https://nodejs.org/api/fs.html
import axios from "axios";
import { constants } from "./constants";
import { AccountInfo, Brands } from "./apiResponses";

export class JwtGetToken {
  scope = constants.scope;
  private jwt: string;
  private accessToken: string;
  private baseUri: string;
  private accountId: string;

  // available scopes: https://developers.docusign.com/platform/auth/reference/scopes/
  step1(): string {
    this.printStep("Step 1. Request application consent");

    const uri =
      "https://account-d.docusign.com/oauth/auth?" +
      qs.stringify({
        response_type: "code",
        /**
         * Note: The state parameter shown in the syntax example is optional.
         * It enables you to enter a string of arbitrary data that
         * will be returned to your redirect URI.
         * You can use state to protect against cross-site request forgery (CSRF)
         * attacks by ensuring that the returned state matches your specified state.
         */
        state: "prevent csrf",
        scope: this.scope,
        client_id: process.env.INTEGRATION_KEY,
        redirect_uri: process.env.REDIRECT_URI,
      });

    return uri;
  }

  step2(): string {
    this.printStep("Step 2. Create a JWT");

    let now = moment();

    this.jwt = jws.sign({
      encoding: undefined,
      header: { alg: "RS256", typ: "JWT" },
      payload: {
        iss: process.env.INTEGRATION_KEY,
        sub: process.env.IMPERSONATED_USER_ID,
        iat: now.unix(),
        exp: now.add(1, "hour").unix(),
        aud: "account-d.docusign.com",
        scope: this.scope,
      },
      privateKey: fs.readFileSync(process.cwd() + "/cert/private.pem"),
    });

    return this.jwt;
  }

  async step3() {
    this.printStep("Step 3. Obtain the access token");

    try {
      const { data } = (await axios({
        method: "post",
        url: "https://account-d.docusign.com/oauth/token",
        data: qs.stringify(
          {
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: this.jwt,
          },
          { encode: false }
        ),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })) as {
        data: {
          access_token: string;
          token_type: string;
          expires_in: number;
        };
      };

      this.accessToken = data.access_token;

      return data;
    } catch (e) {
      console.log(e.response?.data || e);
      throw e;
    }
  }

  async step4() {
    this.printStep("Step 4. Get your user's base URI");

    const { data } = (await axios({
      url: "https://account-d.docusign.com/oauth/userinfo",
      method: "get",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })) as {
      data: AccountInfo;
    };

    const defaultAccount = data.accounts.find(({ is_default }) => is_default);

    this.baseUri = defaultAccount.base_uri;
    this.accountId = defaultAccount.account_id;

    return defaultAccount;
  }

  async step5() {
    this.printStep("Step 5. Use the access token to make an API call");
    const { data } = await axios({
      url: `${this.baseUri}/restapi/v2/accounts/${this.accountId}/brands`,
      method: "get",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return data as Brands;
  }

  private printStep(description: string) {
    console.log(`========== ${description} ==========`);
  }
}
