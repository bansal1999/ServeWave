"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadS3Folder = void 0;
const aws_sdk_1 = require("aws-sdk");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const secrets_1 = require("./secrets");
const s3 = new aws_sdk_1.S3({
    accessKeyId: secrets_1.ACCESS_KEY_ID,
    secretAccessKey: secrets_1.SECRET_ACCESS_KEY,
    endpoint: secrets_1.ENDPOINT,
});
//Function to download from S3 bucket to nodejs server  
function downloadS3Folder(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log(prefix);
        const allFiles = yield s3
            .listObjectsV2({
            Bucket: "servewave",
            Prefix: prefix,
        })
            .promise();
        const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map((_b) => __awaiter(this, [_b], void 0, function* ({ Key }) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path_1.default.join(__dirname, Key);
                const outputFile = fs_1.default.createWriteStream(finalOutputPath);
                const direName = path_1.default.dirname(finalOutputPath);
                if (!fs_1.default.existsSync(direName)) {
                    fs_1.default.mkdirSync(direName, { recursive: true });
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
            }));
        }))) || [];
        console.log("Awaiting");
        yield Promise.all(allPromises === null || allPromises === void 0 ? void 0 : allPromises.filter((x) => x !== undefined));
    });
}
exports.downloadS3Folder = downloadS3Folder;
