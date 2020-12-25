import * as moment from "moment";
import * as jws from "jws";
import * as fs from "fs";
import { constants } from "../platform101/constants";
import * as qs from "qs";
import axios from "axios";

export class ApplicationAuth {
  private jwt: string;
  scope = constants.admin_scope;
  private accessToken: string;

  step1() {
    this.printStep("Step 2. Create a JWT");

    let now = moment();

    this.jwt = jws.sign({
      header: { alg: "RS256", typ: "JWT" },
      payload: {
        iss: process.env.INTEGRATION_KEY,
        /*
         * Note: Unlike the JWT Grant, no user ID (sub claim) is set in the JWT Body.
         */
        iat: now.unix(),
        sub: process.env.IMPERSONATED_USER_ID,
        exp: now.add(1, "hour").unix(),
        aud: "account-d.docusign.com",
        scope: this.scope,
      },
      privateKey: fs.readFileSync(process.cwd() + "/cert/private.pem"),
    });

    return this.jwt;
  }

  async step2() {
    this.printStep("Step 2: Obtain the access token");

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

  async step3_1() {
    this.printStep("Step 3: Call the DocuSign Admin API");

    let response: {
      data: unknown;
      request?: any;
    };
    try {
      response = await axios({
        method: "get",
        url: "https://api-d.docusign.net/management/v2/organizations",
        headers: {
          Authorization: `bearer ${this.accessToken}`,
        },
      });
    } catch (e) {
      console.log(e.response?.data || e);
      throw e;
    }

    return response.data;
  }

  private printStep(description: string) {
    console.log(`========== ${description} ==========`);
  }
}
