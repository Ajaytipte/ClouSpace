import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import crypto from "crypto";

const s3 = new S3Client({ region: "ap-south-1" });
const db = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async (event) => {
    try {
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub ||
            event.requestContext?.authorizer?.claims?.sub;
        if (!userId) return { statusCode: 401, body: "Unauthorized" };

        const body = JSON.parse(event.body || "{}");
        const { fileName, fileSize, fileType } = body;

        if (!fileName) throw new Error("Missing fileName");

        const fileId = crypto.randomBytes(16).toString("hex");
        const key = `${userId}/${fileId}-${fileName}`;
        const bucket = process.env.VITE_AWS_S3_BUCKET || "cloudspace-files";

        const uploadURL = await getSignedUrl(s3, new PutObjectCommand({
            Bucket: bucket, Key: key, ContentType: fileType || "application/octet-stream"
        }), { expiresIn: 3600 });

        await db.send(new PutItemCommand({
            TableName: process.env.TABLE_NAME || "CloudSpaceFiles",
            Item: {
                userId: { S: userId },
                fileId: { S: fileId },
                fileName: { S: fileName },
                fileSize: { N: String(fileSize || 0) },
                fileType: { S: fileType || "application/octet-stream" },
                url: { S: `https://${bucket}.s3.ap-south-1.amazonaws.com/${key}` },
                isDeleted: { BOOL: false },
                createdAt: { S: new Date().toISOString() }
            }
        }));

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" },
            body: JSON.stringify({ uploadURL, fileId })
        };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: err.message };
    }
};
