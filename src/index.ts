import express from "express";
import cors from "cors";
import { generate } from "./utils";
import simpleGit from "simple-git";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { getAllFiles } from "./file";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  console.log(repoUrl);
  const id = generate();

  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  const outputDir = path.join(__dirname, `output/${id}`);
  if (fs.existsSync(outputDir)) {
    const files = getAllFiles(outputDir);
    //console.log(files);
  } else {
    console.error("Directory does not exist:", outputDir);
  }
  
  // put this into S3
  res.json({
    id: id,
  });
});

app.listen(3000);
