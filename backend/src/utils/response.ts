import { APIGatewayProxyResult } from "aws-lambda";

export const createResponse = (
  statusCode: number,
  body: any,
  headers: Record<string, string> = {}
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      ...headers,
    },
    body: JSON.stringify(body),
  };
};

export const successResponse = (data: any): APIGatewayProxyResult => {
  return createResponse(200, { success: true, data });
};

export const createdResponse = (data: any): APIGatewayProxyResult => {
  return createResponse(201, { success: true, data });
};

export const errorResponse = (
  statusCode: number,
  message: string,
  error?: any
): APIGatewayProxyResult => {
  return createResponse(statusCode, {
    success: false,
    message,
    ...(error && { error }),
  });
};

export const notFoundResponse = (
  message: string = "Resource not found"
): APIGatewayProxyResult => {
  return errorResponse(404, message);
};

export const badRequestResponse = (
  message: string = "Bad request"
): APIGatewayProxyResult => {
  return errorResponse(400, message);
};

export const internalServerErrorResponse = (
  message: string = "Internal server error",
  error?: any
): APIGatewayProxyResult => {
  return errorResponse(500, message, error);
};
