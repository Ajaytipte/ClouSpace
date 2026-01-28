import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const db = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async (event) => {
    try {
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub ||
            event.requestContext?.authorizer?.claims?.sub;

        if (!userId) return { statusCode: 401, body: "Unauthorized" };

        const body = JSON.parse(event.body || "{}");
        const { fileId } = body;

        if (!fileId) throw new Error("Missing fileId");

        await db.send(new UpdateItemCommand({
            TableName: process.env.TABLE_NAME || "CloudSpaceFiles",
            Key: {
                userId: { S: userId },
                fileId: { S: fileId }
            },
            // Flip isDeleted back to false
            UpdateExpression: "SET isDeleted = :d",
            ExpressionAttributeValues: {
                ":d": { BOOL: false }
            }
        }));

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "File restored successfully" })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message })
        };
    }
};
