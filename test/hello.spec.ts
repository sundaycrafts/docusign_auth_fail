import * as dotenv from "dotenv";

dotenv.config();
import { hello } from "./hello";
import axios from "axios";

describe("test of test", () => {
  it("should import .env file and function", () => {
    expect(hello(process.env.NAME)).toBe("hello user");
  });

  it("should make actual http request (e2e)", async () => {
    /* use github api for test:
    https://docs.github.com/en/free-pro-team@latest/rest/guides/getting-started-with-the-rest-api */
    let { data } = await axios.get("https://api.github.com/users/octocat");

    expect(data).toMatchObject({
      name: "The Octocat",
      company: "@github",
      html_url: "https://github.com/octocat",
      url: "https://api.github.com/users/octocat",
    });
  });
});
