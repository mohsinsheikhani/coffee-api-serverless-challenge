import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoffeeService } from "../services/dynamoService";
import {
  successResponse,
  notFoundResponse,
  badRequestResponse,
  internalServerErrorResponse,
} from "../utils/response";
import { validateUpdateCoffeeRequest } from "../utils/validation";

const coffeeService = new CoffeeService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Update coffee request:", JSON.stringify(event, null, 2));

    const coffeeId = event.pathParameters?.id;
    if (!coffeeId) {
      return badRequestResponse("Coffee ID is required");
    }

    if (!event.body) {
      return badRequestResponse("Request body is required");
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (error) {
      return badRequestResponse("Invalid JSON in request body");
    }

    // Validate request data
    const validation = validateUpdateCoffeeRequest(requestData);
    if (!validation.isValid) {
      return badRequestResponse(
        `Validation failed: ${validation.errors.join(", ")}`
      );
    }

    // Update coffee
    const updatedCoffee = await coffeeService.updateCoffee(
      coffeeId,
      requestData
    );

    if (!updatedCoffee) {
      return notFoundResponse(`Coffee with ID ${coffeeId} not found`);
    }

    console.log("Coffee updated successfully:", updatedCoffee);
    return successResponse(updatedCoffee);
  } catch (error) {
    console.error("Error updating coffee:", error);
    return internalServerErrorResponse("Failed to update coffee", error);
  }
};
