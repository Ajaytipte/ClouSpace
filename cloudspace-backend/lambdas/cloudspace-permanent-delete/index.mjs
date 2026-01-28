import {
    DynamoDBClient,
    GetItemCommand,
    DeleteItemCommand
} from "@aws-sdk/client-dynamodb";
import {
    S3Client,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";

const dynamo = new DynamoDBClient({ region: process.env.REGION });
const s3 = new S3Client({ region: process.env.REGION });

export const handler = async (event) => {
    console.log("EVENT:", JSON.stringify(event));

    try {
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
        const body = JSON.parse(event.body || "{}");
        const { fileId } = body;

        if (!userId || !fileId) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Missing fileId" })
            };
        }

        const res = await dynamo.send(
            new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    userId: { S: userId },
                    fileId: { S: fileId }
                }
            })
        );

        if (!res.Item) {
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "File not found" })
            };
        }

        const s3Key = res.Item.s3Key?.S || res.Item.key?.S;

        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: s3Key
            })
        );

        await dynamo.send(
            new DeleteItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    userId: { S: userId },
                    fileId: { S: fileId }
                }
            })
        );

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "File permanently deleted" })
        };

    } catch (err) {
        console.error("DELETE ERROR:", err);

        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: err.message })
        };
    }
};
