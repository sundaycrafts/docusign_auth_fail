import * as fs from "fs";

export async function updateEnv(path: string, [key, value]: [string, string]) {
  let doneRewrite = false

  await fs.promises.writeFile(
    path,
    Buffer.from(await fs.promises.readFile(path))
      .toString()
      .split("\n")
      .map((s) => {
        if (doneRewrite) return s

        const [k] = s.split("=");
        const isTarget = k === key;
        if (isTarget) {
          doneRewrite = true
          return [k, value].join("=");
        }

        return s
      })
      .join("\n")
  );
}