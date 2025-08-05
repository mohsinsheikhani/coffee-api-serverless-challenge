import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoffeeService } from "../services/dynamoService";
import {
  successResponse,
  internalServerErrorResponse,
} from "../utils/response";

const coffeeService = new CoffeeService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("List coffees request:", JSON.stringify(event, null, 2));

    // Get all coffees
    const coffees = await coffeeService.listCoffees();

    console.log(`Retrieved ${coffees.length} coffees`);
    return successResponse({
      count: coffees.length,
      coffees,
    });
  } catch (error) {
    console.error("Error listing coffees:", error);
    return internalServerErrorResponse("Failed to list coffees", error);
  }
};
