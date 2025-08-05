import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoffeeService } from "../services/dynamoService";
import {
  createdResponse,
  badRequestResponse,
  internalServerErrorResponse,
} from "../utils/response";

const coffeeService = new CoffeeService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Create coffee request:", JSON.stringify(event, null, 2));

    if (!event.body) {
      return badRequestResponse("Request body is required");
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (error) {
      return badRequestResponse("Invalid JSON in request body");
    }

    // Create coffee item
    const coffee = await coffeeService.createCoffee(requestData);

    console.log("Coffee created successfully: ", coffee);
    return createdResponse(coffee);
  } catch (error) {
    console.error("Error creating coffee:", error);
    return internalServerErrorResponse("Failed to create coffee", error);
  }
};
