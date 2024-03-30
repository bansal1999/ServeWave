import { S3 } from "aws-sdk";
import fs from "fs";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, ENDPOINT } from "./secrets";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  endpoint: ENDPOINT,
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
  console.log("called");
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "servewave",
      Key: fileName,
    })
    .promise();

  console.log(response);
};
