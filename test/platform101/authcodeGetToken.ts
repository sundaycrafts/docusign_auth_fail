import axios from "axios";
import qs = require("qs");
import { UserInfo } from "./userInfo";
import {constants} from "./constants";

export class AuthcodeGetToken {
  private readonly scope = constants.scope;
  private accessToken: string;
  private baseUri: string;
  private accountId: string;
  private refreshToken: string;

  async step1() {
    this.printStep("Step 1. Request the authorization code");

    const { request } = await axios({
      url:
        "https://account-d.docusign.com/oauth/auth?" +
        qs.stringify({
          response_type: "code",
          scope: this.scope,
          /**
           * Note: The state parameter shown in the syntax example is optional.
           * It enables you to enter a string of arbitrary data that
           * will be returned to your redirect URI.
           * You can use state to protect against cross-site request forgery (CSRF)
           * attacks by ensuring that the returned state matches your specified state.
           */
          state: "prevent csrf",
          client_id: process.env.INTEGRATION_KEY,
          redirect_uri: process.env.REDIRECT_URI,
        }),
      method: "get",
    });

    // get redirect url https://github.com/axios/axios/issues/390#issuecomment-511157955
    return request.res.responseUrl;
  }

  async step2() {
    this.printStep("Step 2. Obtain the access token");

    let response: {
      data: {
        access_token: string;
        token_type: "Bearer";
        refresh_token: string;
        expires_in: number;
      };
    }
    try {
      response = (await axios({
        method: "post",
        url:
          "https://account-d.docusign.com/oauth/token?" +
          qs.stringify({
            grant_type: "authorization_code",
            code: process.env.AUTHORIZETAION_CODE,
          }),
        auth: {
          username: process.env.INTEGRATION_KEY,
          password: process.env.SECRET_KEY,
        }
      }));
    } catch (e) {
      console.log(e.response?.data || e)
      throw e
    }

    this.accessToken = response.data.access_token;
    this.refreshToken = response.data.refresh_token;

    return response.data;
  }

  async step3() {
    this.printStep(`Step 3. Get your user's base URI`);

    let response: {
      data: UserInfo
    }
    try {
      response = (await axios({
        method: "get",
        url: "https://account-d.docusign.com/oauth/userinfo",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }));
    } catch (e) {
      console.log(e.response?.data || e)
      throw e
    }

    const defaultAccount = response.data.accounts.find(({ is_default }) => is_default);

    this.baseUri = defaultAccount.base_uri;
    this.accountId = defaultAccount.account_id;

    return defaultAccount;
  }

  async step4() {
    this.printStep("Step 4. Use the access token to make an API call");

    let response: {
      data: unknown
    }
    try {
      response = await axios({
        method: "get",
        url: `${this.baseUri}/restapi/v2/accounts/${this.accountId}/brands`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
    } catch (e) {
      console.log(e.response?.data || e)
      throw e
    }

    return response.data;
  }

  async useRefreshToken() {
    this.printStep("Use refresh tokens");

    let response: {
      data: unknown
    }
    try {
      response = await axios({
        method: "post",
        url: "https://account-d.docusign.com/oauth/token?" + qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
        }),
        auth: {
          username: process.env.INTEGRATION_KEY,
          password: process.env.SECRET_KEY,
        }
      });
    } catch (e) {
      console.log(e.response?.data || e)
      throw e
    }

    return response.data
  }

  private printStep(description: string) {
    console.log(`========== ${description} ==========`);
  }
}
