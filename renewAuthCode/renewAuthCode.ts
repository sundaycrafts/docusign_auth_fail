import { config } from "dotenv";
config();
import * as ora from "ora";
import * as url from "url";
import { Request, Response } from "express";
import { AuthcodeGetToken } from "../test/platform101/authcodeGetToken";
import { CallbackServer } from "./callbackServer";
import { updateEnv } from "./updateEnv";

async function renewAuthCode() {
  const authcodeGetoToken = new AuthcodeGetToken();
  const authUrl = await authcodeGetoToken.step1();

  const server = new CallbackServer();

  console.log(`access the url to authorize\n${authUrl}`);
  const spinner = ora().start();

  server.express.get(
    url.parse(process.env.REDIRECT_URI).path,
    async (req: Request, res: Response) => {
      res.sendStatus(200);

      await updateEnv(process.cwd() + "/.env", [
        "AUTHORIZETAION_CODE",
        req.query.code as string,
      ]);

      spinner.stop();
      console.log(".env file has been updated");
      server.stop();
    }
  );

  await server.listen(3000);
}

renewAuthCode();
