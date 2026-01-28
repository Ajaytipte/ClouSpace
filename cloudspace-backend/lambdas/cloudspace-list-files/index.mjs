import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
const db = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async (event) => {
    try {
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub ||
            event.requestContext?.authorizer?.claims?.sub;

        if (!userId) {
            console.log("No User ID found in event");
            return { statusCode: 401, body: "Unauthorized" };
        }

        const result = await db.send(new QueryCommand({
            TableName: process.env.TABLE_NAME || "CloudSpaceFiles",
            KeyConditionExpression: "userId = :u",
            ExpressionAttributeValues: { ":u": { S: userId } }
        }));

        const isTrashReq = event.queryStringParameters?.trash === 'true';

        // ULTRA-SAFE MAPPING: Handles items that might be missing certain fields
        const files = (result.Items || []).map(i => {
            try {
                return {
                    fileId: i.fileId?.S || "unknown",
                    fileName: i.fileName?.S || "Untitled",
                    fileSize: i.fileSize?.N ? parseInt(i.fileSize.N) : 0,
                    url: i.url?.S || "#",
                    createdAt: i.createdAt?.S || new Date().toISOString(),
                    isDeleted: i.isDeleted ? i.isDeleted.BOOL : false
                };
            } catch (e) {
                console.error("Item mapping failed:", i);
                return null;
            }
        }).filter(f => f !== null && (isTrashReq ? f.isDeleted : !f.isDeleted));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify(files)
        };
    } catch (err) {
        console.error("CRITICAL ERROR:", err);
        return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: err.message };
    }
};
