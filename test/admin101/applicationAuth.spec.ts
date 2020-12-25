import { ApplicationAuth } from "./applicationAuth";

describe("https://developers.docusign.com/docs/admin-api/admin101/application-auth", () => {
  let applicationAuth: ApplicationAuth;

  beforeAll(() => {
    applicationAuth = new ApplicationAuth();
  });
  test("Step 1: Create JWT Token", () => {
    const jwt = applicationAuth.step1();

    const [h, b] = jwt.split(".");
    let header = Buffer.from(h, "base64").toString();
    let body = Buffer.from(b, "base64").toString();

    console.log(`header: ${header}\n` + `body: ${body}`);

    expect([JSON.parse(header), JSON.parse(body)]).toMatchObject([
      { alg: "RS256", typ: "JWT" },
      {
        iss: process.env.INTEGRATION_KEY,
        iat: expect.any(Number),
        exp: expect.any(Number),
        aud: "account-d.docusign.com",
        scope: applicationAuth.scope,
      },
    ]);
  });

  test("Step 2: Obtain the access token", async () => {
    const tokenInfo = await applicationAuth.step2();

    console.log(tokenInfo)

    expect(tokenInfo).toMatchObject({
      access_token: expect.any(String),
      expires_in: expect.any(Number),
      token_type: "Bearer"
    });
  });

  test("Step 3: Call the DocuSign Admin API", async () => {
    const defaultAccount = await applicationAuth.step3();

    console.log(defaultAccount);

    expect(defaultAccount).toBeTruthy();
  });
});