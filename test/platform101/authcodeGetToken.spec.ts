import { AuthcodeGetToken } from "./authcodeGetToken";

describe("https://developers.docusign.com/platform/auth/authcode/authcode-get-token/", () => {
  let authcodeGetoToken: AuthcodeGetToken;

  beforeAll(() => {
    authcodeGetoToken = new AuthcodeGetToken();
  });

  test(
    "Step 1. Request the authorization code" +
      "(access printed url, " +
      'obtain "AUTHORIZETAION_CODE" from redirected url param,' +
      " write it to .env manually to go to next steps)",
    async () => {
      if (process.env.AUTHORIZETAION_CODE) {
        console.log('SKIPPED')
        return
      }

      const requestUri = await authcodeGetoToken.step1();

      console.log(requestUri);

      expect(typeof requestUri).toBe("string");
    }
  );

  test("Step 2. Obtain the access token", async () => {
    const response = await authcodeGetoToken.step2();

    console.log(response)

    expect(response).toMatchObject({
      access_token: expect.any(String),
      expires_in: expect.any(Number),
      refresh_token: expect.any(String),
      token_type: "Bearer",
    });
  });

  test("Step 3. Get your user's base URI", async () => {
    const defaultAccount = await authcodeGetoToken.step3();

    console.log(defaultAccount)
  })

  test("Step 4. Use the access token to make an API call", async () => {
    const data = await authcodeGetoToken.step4();

    console.log(data)
  })
});
