import express from "express";
import cors from "cors";
import { generate } from "./utils";
import simpleGit from "simple-git";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const getAllFiles = (folderPath: string): string[] => {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
};

app.post("/deploy", async (req, res) => {
  const repoUrl: string = req.body.repoUrl;
  console.log(repoUrl);
  const id: string = generate();

  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  const outputDir: string = path.join(__dirname, `output/${id}`);
  console.log(outputDir);
  const files: string[] = getAllFiles(outputDir);

  for (const file of files) {
    await uploadFile(file.slice(__dirname.length + 1), file);
  }

  // pushing the id into redis-queue
  publisher.lPush("build-queue", id);
  // seting the status to uploaded in redis-queue
  publisher.hSet("status", id, "uploaded");
  const value = await publisher.hGet("status", id);

  // put this into S3
  res.json({
    id: id,
  });
});

app.listen(3000);
