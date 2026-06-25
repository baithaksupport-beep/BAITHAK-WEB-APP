import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 Credentials validation
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "baithak-media";
const r2PublicUrl = process.env.VITE_R2_PUBLIC_URL || `https://pub-${accountId}.r2.dev`;

let s3Client = null;

if (accountId && accessKeyId && secretAccessKey) {
  try {
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  } catch (err) {
    console.error("Failed to initialize Cloudflare R2 client:", err);
  }
} else {
  console.warn("Cloudflare R2 storage credentials are missing in server environment.");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const contentType = searchParams.get("content_type");

  if (!s3Client) {
    return Response.json(
      { error: "Cloudflare R2 storage credentials are not configured on the server." },
      { status: 500 }
    );
  }

  if (!filename || !contentType) {
    return Response.json(
      { error: "Missing required query parameters: filename or content_type" },
      { status: 400 }
    );
  }

  try {
    // Generate pre-signed PUT URL
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      ContentType: contentType,
    });

    // Signed URL expires in 1 hour (3600 seconds)
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `${r2PublicUrl.replace(/\/$/, "")}/${filename.replace(/^\//, "")}`;

    return Response.json({
      presigned_url: presignedUrl,
      public_url: publicUrl,
      filename: filename,
    });
  } catch (error) {
    console.error("Error generating Cloudflare R2 presigned URL:", error);
    return Response.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
