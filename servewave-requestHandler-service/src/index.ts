import express from "express";
import { ACCESS_KEY_ID, ENDPOINT, SECRET_ACCESS_KEY } from "./secrets";
import { S3 } from "aws-sdk";

const app = express();

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  endpoint: ENDPOINT,
});

app.get("/*", async (req, res) => {
  const host = req.hostname;
  console.log(host);
  const id = host.split(".")[0];
  console.log(id);
  const filePath = req.path;
  console.log(filePath);

  const contents = await s3
    .getObject({
      Bucket: "servewave",
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);

  res.send(contents.Body);
});

app.listen(3001);
