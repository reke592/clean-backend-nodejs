const { logger } = require("../../helpers/logging");
const { LOG_REQUESTS } = require("../../startup/environment");

module.exports = LOG_REQUESTS
  ? (req, res, next) => {
      const start = Date.now();
      const { method, url, body: reqBody, ip, headers, query } = req;
      const origWrite = res.write;
      const origEnd = res.end;
      const chunks = [];

      res.write = (...args) => {
        chunks.push(Buffer.from(args[0]));
        origWrite.apply(res, args);
      };

      res.end = (...args) => {
        if (args[0]) {
          chunks.push(Buffer.from(args[0]));
        }
        origEnd.apply(res, args);
      };

      res.on("finish", () => {
        const resBody = Buffer.concat(chunks).toString("utf-8");
        logger.info(
          JSON.stringify(
            {
              request: {
                method,
                url,
                headers,
                body: reqBody,
                query,
                ip,
              },
              response: {
                duration: Date.now() - start,
                status: res.statusCode,
                headers: res.getHeaders(),
                body: resBody,
              },
            },
            null,
            2
          )
        );
      });
      next();
    }
  : (req, res, next) => next();
