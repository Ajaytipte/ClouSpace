export const getUserId = (event) => {
    return event.requestContext?.authorizer?.jwt?.claims?.sub ||
        event.requestContext?.authorizer?.claims?.sub;
};
