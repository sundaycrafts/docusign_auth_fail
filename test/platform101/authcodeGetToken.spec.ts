import { AuthcodeGetToken } from "./authcodeGetToken";

describe("https://developers.docusign.com/platform/auth/authcode/authcode-get-token/", () => {
  let authcodeGetoToken: AuthcodeGetToken;

  beforeAll(() => {
    authcodeGetoToken = new AuthcodeGetToken();
  });

  test("Step 1. Request the authorization code", async () => {
    const requestUri = await authcodeGetoToken.step1();

    console.log(requestUri);

    expect(typeof requestUri).toBe("string");
  });

  test("Step 2. Obtain the access token", async () => {
    const response = await authcodeGetoToken.step2();

    console.log(response);

    expect(response).toMatchObject({
      access_token: expect.any(String),
      expires_in: expect.any(Number),
      refresh_token: expect.any(String),
      token_type: "Bearer",
    });
  });

  test("Step 3. Get your user's base URI", async () => {
    const defaultAccount = await authcodeGetoToken.step3();

    console.log(defaultAccount);

    expect(defaultAccount).toMatchObject({
      account_id: expect.any(String),
      is_default: true,
      account_name: expect.any(String),
      base_uri: expect.any(String),
    });
  });

  test("Step 4. Use the access token to make an API call", async () => {
    const data = await authcodeGetoToken.step4();

    console.log(data);

    data.users.forEach((u) =>
      expect(u).toMatchObject({
        userName: expect.any(String),
        userId: expect.any(String),
        userType: expect.any(String),
        isAdmin: expect.any(String),
        userStatus: expect.any(String),
        uri: expect.any(String),
        email: expect.any(String),
        createdDateTime: expect.any(String),
        userAddedToAccountDateTime: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        jobTitle: expect.any(String),
        company: expect.any(String),
        permissionProfileId: expect.any(String),
        permissionProfileName: expect.any(String),
      })
    );
  });
});
