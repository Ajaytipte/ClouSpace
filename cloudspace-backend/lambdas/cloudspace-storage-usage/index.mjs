import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION || "ap-south-1" });

export const handler = async (event) => {
    try {
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub ||
            event.requestContext?.authorizer?.claims?.sub;

        if (!userId) return { statusCode: 401, body: "Unauthorized" };

        const result = await dynamo.send(
            new QueryCommand({
                TableName: process.env.TABLE_NAME || "CloudSpaceFiles",
                KeyConditionExpression: "userId = :u",
                ExpressionAttributeValues: { ":u": { S: userId } },
            })
        );

        let used = 0;
        (result.Items || []).forEach(item => {
            if (!item.isDeleted?.BOOL) {
                used += parseInt(item.fileSize?.N || "0");
            }
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                used: used,
                total: 16106127360, // 15GB
                fileCount: (result.Items || []).length
            }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
