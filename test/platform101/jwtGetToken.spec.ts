import { JwtGetToken } from "./jwtGetToken";
import { constants } from "./constants";

describe("https://developers.docusign.com/platform/auth/jwt/jwt-get-token/", () => {
  let jwtGetToken: JwtGetToken;

  beforeAll(() => {
    jwtGetToken = new JwtGetToken();
  });

  test("Step 1. Request application consent", () => {
    const uri = jwtGetToken.step1();

    const { INTEGRATION_KEY, REDIRECT_URI } = process.env;

    console.log(uri);

    expect(uri).toBe(
      "https://account-d.docusign.com/oauth/auth" +
        "?response_type=code" +
        "&state=prevent%20csrf" +
        `&scope=${encodeURIComponent(constants.scope)}` +
        `&client_id=${INTEGRATION_KEY}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    );
  });

  test("Step 2. Create a JWT", () => {
    const jwt = jwtGetToken.step2();

    const [h, b] = jwt.split(".");
    let header = Buffer.from(h, "base64").toString();
    let body = Buffer.from(b, "base64").toString();

    console.log(`header: ${header}\n` + `body: ${body}`);

    expect([JSON.parse(header), JSON.parse(body)]).toMatchObject([
      { alg: "RS256", typ: "JWT" },
      {
        iss: process.env.INTEGRATION_KEY,
        sub: process.env.IMPERSONATED_USER_ID,
        iat: expect.any(Number),
        exp: expect.any(Number),
        aud: "account-d.docusign.com",
        scope: jwtGetToken.scope,
      },
    ]);
  });

  test("Step 3. Obtain the access token", async () => {
    const tokenInfo = await jwtGetToken.step3();

    console.log(tokenInfo);

    expect(tokenInfo.access_token).toBeTruthy();
  });

  test("Step 4. Get your user's base URI", async () => {
    const defaultAccount = await jwtGetToken.step4();

    console.log(`default account "${defaultAccount}"`);

    expect(defaultAccount).toHaveProperty("base_uri");
    expect(defaultAccount).toHaveProperty("account_id");
  });

  test("Step 5. Use the access token to make an API call", async () => {
    const data = await jwtGetToken.step5();

    console.log(data);

    expect(data.senderBrandIdDefault).toEqual(expect.any(String));
    data.brands.forEach((b) =>
      expect(b).toMatchObject({
        brandId: expect.any(String),
        brandName: expect.any(String),
        isOverridingCompanyName: expect.any(String),
        isSendingDefault: expect.any(String),
        isSigningDefault: expect.any(String),
      })
    );
  });
});
