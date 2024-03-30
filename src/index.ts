import express from "express";
import cors from "cors";
import { generate } from "./utils";
import simpleGit from "simple-git";

const app = express();
app.use(cors());

app.post("./deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  console.log(repoUrl);
  const id = generate();

  await simpleGit().clone(repoUrl, `output/${id}`);

  res.json({
    id: id,
  });
});

app.listen(3000);
