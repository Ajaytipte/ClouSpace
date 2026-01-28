import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.REGION });
const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const dynamo = DynamoDBDocumentClient.from(ddbClient);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
};

export const handler = async (event) => {
    try {
        const fileId = event.queryStringParameters?.fileId;

        if (!fileId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: "fileId is required" }),
            };
        }

        const result = await dynamo.send(
            new GetCommand({
                TableName: process.env.FILES_TABLE,
                Key: { fileId },
            })
        );

        if (!result.Item || !result.Item.s3Key) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ error: "File not found" }),
            };
        }

        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: result.Item.s3Key,
        });

        const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 60,
        });

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ downloadUrl: signedUrl }),
        };

    } catch (err) {
        console.error("DOWNLOAD ERROR:", err);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
