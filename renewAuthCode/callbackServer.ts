import * as express from "express";
import { Express } from "express";

export class CallbackServer {
  readonly express: Express;

  constructor() {
    this.express = express();
  }

  listen(port: number): Promise<void> {
    return new Promise((resolve, reject) =>
      this.express
        .listen(port)
        .on("listening", resolve)
        .on("error", (e) => reject(e))
    );
  }

  stop() {
    process.exit(0);
  }
}
