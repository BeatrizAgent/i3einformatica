import "server-only";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";

let client: S3Client | undefined;

function getS3Client() {
  if (!client) {
    client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION ?? "eu-west-1",
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials:
        process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            }
          : undefined,
    });
  }
  return client;
}

function getBucket() {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET is required for private uploads");
  return bucket;
}

const isDev = process.env.NODE_ENV !== "production";
const useLocalFallback = isDev && (!process.env.S3_BUCKET || process.env.S3_ENDPOINT?.includes("localhost"));

export async function putPrivateObject(input: {
  key: string;
  body: Uint8Array;
  contentType: string;
  checksumSha256: string;
}) {
  if (useLocalFallback) {
    const localPath = resolve("data/attachments", input.key);
    await mkdir(dirname(localPath), { recursive: true });
    await writeFile(localPath, input.body);
    console.log(`[Storage] Saved attachment to local path: ${localPath}`);
    return;
  }

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      Metadata: { sha256: input.checksumSha256 },
      ServerSideEncryption: "AES256",
    }),
  );
}

export function createPrivateDownloadUrl(key: string, expiresIn = 300) {
  if (useLocalFallback) {
    return `/api/admin/attachments?key=${encodeURIComponent(key)}`;
  }

  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: getBucket(), Key: key }),
    { expiresIn },
  );
}

export async function deletePrivateObject(key: string) {
  if (useLocalFallback) {
    const localPath = resolve("data/attachments", key);
    await unlink(localPath).catch(() => undefined);
    console.log(`[Storage] Deleted local attachment: ${localPath}`);
    return;
  }

  await getS3Client().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }));
}
