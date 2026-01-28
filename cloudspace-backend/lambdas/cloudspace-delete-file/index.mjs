import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const db = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async (event) => {
    try {
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub || event.requestContext?.authorizer?.claims?.sub;
        const { fileId } = JSON.parse(event.body);

        await db.send(new UpdateItemCommand({
            TableName: process.env.TABLE_NAME || "CloudSpaceFiles",
            Key: { userId: { S: userId }, fileId: { S: fileId } },
            UpdateExpression: "SET isDeleted = :d",
            ExpressionAttributeValues: { ":d": { BOOL: true } }
        }));

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Deleted" })
        };
    } catch (err) {
        return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: err.message };
    }
};
