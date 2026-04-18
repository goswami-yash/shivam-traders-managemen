import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from 'config';

// Load config based on provider
const isAws = config.get("App.config.imageUploadPath_type") === "aws";
const cloude = isAws
  ? config.get("App.cloude_aws")
  : config.get("App.cloude_r2");

const provider = cloude.PROVIDER || (isAws ? "aws" : "r2");

// ✅ Dynamic endpoint
const endpoint =
  provider === "r2"
    ? `https://${cloude.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : `https://${BUCKET}.s3.${region}.amazonaws.com`;

// ✅ Correct region handling
const region = provider === "r2" ? "auto" : cloude.AWS_REGION;
console.log(`region: ${region} `);

// ✅ Credentials
const credentials = {
  accessKeyId:
    provider === "aws"
      ? cloude.AWS_ACCESS_KEY
      : cloude.R2_ACCESS_KEY,

  secretAccessKey:
    provider === "aws"
      ? cloude.AWS_SECRET_KEY
      : cloude.R2_SECRET_KEY,
};

console.log('cri',credentials.accessKeyId)
// ✅ Bucket (fix naming)
const BUCKET =
  provider === "aws"
    ? cloude.AWS_BUCKET
    : cloude.R2_BUCKET;


// Initialize R2 Client or aws S3 Client
const storageClient = new S3Client({
  region: region, // ✅ use dynamic region
  ...(endpoint && { endpoint }),
  credentials,
});

console.log(`Initialized ${provider.toUpperCase()} Client with endpoint: ${endpoint}`);
console.log(`Using bucket: ${BUCKET}`);
console.log(`Credentials loaded: ${credentials.accessKeyId ? "Yes" : "No"}`);
// ================= DELETE SINGLE IMAGE =================
async function deleteR2Object(objectKey) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: objectKey
    });
    await storageClient.send(command);
    return { success: true, message: "File deleted from R2" };
  } catch (error) {
    console.error("R2 Delete Error:", error);
    return { success: false, message: "Failed to delete file" };
  }
}


// ================= DELETE BY PREFIX (ALL FILES) =================
async function deleteAllByPrefix(prefix) {
  try {
    let isTruncated = true;
    let continuationToken = undefined;
    let totalDeleted = 0;

    while (isTruncated) {
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken
      });

      const listResult = await storageClient.send(listCommand);

      if (!listResult.Contents || listResult.Contents.length === 0) {
        return { success: true, message: "No files to delete" };
      }

      const deleteParams = {
        Bucket: BUCKET,
        Delete: { Objects: listResult.Contents.map(obj => ({ Key: obj.Key })) }
      };

      await storageClient.send(new DeleteObjectsCommand(deleteParams));

      totalDeleted += deleteParams.Delete.Objects.length;

      isTruncated = listResult.IsTruncated;
      continuationToken = listResult.NextContinuationToken;
    }

    return { success: true, deleted: totalDeleted };
  } catch (error) {
    console.error("Batch Delete Error:", error);
    return { success: false, message: "Failed to delete files" };
  }
}

export { storageClient, PutObjectCommand, getSignedUrl, deleteR2Object, deleteAllByPrefix };
