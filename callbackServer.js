const http = require("http");
const url = require("url");
const qs = require("qs");

http
  .createServer((req, res) => {
    const queries = qs.parse(url.parse(req.url).query);

    res.setHeader("Content-Type", "text/html");

    res.write(
      [
        "<ul>",
        ...Object.entries(queries).map(([k, v]) => `<li>${k}: ${v}</li>`),
        "</ul>",
      ].join("")
    );
    res.end();
  })
  .listen(3000);
