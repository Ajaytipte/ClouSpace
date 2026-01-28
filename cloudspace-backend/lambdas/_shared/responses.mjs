import { corsHeaders } from "./cors.mjs";

export const successResponse = (body) => ({
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(body),
});

export const errorResponse = (statusCode, message) => ({
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({ error: message }),
});
