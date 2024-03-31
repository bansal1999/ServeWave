import { S3 } from "aws-sdk";
import path, { dirname } from "path";
import fs from "fs";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, ENDPOINT } from "./secrets";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  endpoint: ENDPOINT,
}); 

//Function to download from S3 bucket to nodejs server  
export async function downloadS3Folder(prefix: string) {
  console.log(prefix);

  const allFiles = await s3
    .listObjectsV2({
      Bucket: "servewave",
      Prefix: prefix,
    })
    .promise();

  const allPromises =
    allFiles.Contents?.map(async ({ Key }) => {
      return new Promise(async (resolve) => {
        if (!Key) {
          resolve("");
          return;
        }

        const finalOutputPath = path.join(__dirname, Key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const direName = path.dirname(finalOutputPath);

        if (!fs.existsSync(direName)) {
          fs.mkdirSync(direName, { recursive: true });
        }
        s3.getObject({
          Bucket: "servewave",
          Key,
        })
          .createReadStream()
          .pipe(outputFile)
          .on("finish", () => {
            resolve("");
          });
      });
    }) || [];
  console.log("Awaiting");

  await Promise.all(allPromises?.filter((x) => x !== undefined));
}
