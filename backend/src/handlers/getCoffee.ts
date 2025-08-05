import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CoffeeService } from '../services/dynamoService';
import {
  successResponse,
  notFoundResponse,
  badRequestResponse,
  internalServerErrorResponse,
} from '../utils/response';

const coffeeService = new CoffeeService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Get coffee request:', JSON.stringify(event, null, 2));

    const coffeeId = event.pathParameters?.id;
    if (!coffeeId) {
      return badRequestResponse('Coffee ID is required');
    }

    // Get coffee by ID
    const coffee = await coffeeService.getCoffee(coffeeId);

    if (!coffee) {
      return notFoundResponse(`Coffee with ID ${coffeeId} not found`);
    }

    console.log('Coffee retrieved successfully:', coffee);
    return successResponse(coffee);
  } catch (error) {
    console.error('Error retrieving coffee:', error);
    return internalServerErrorResponse('Failed to retrieve coffee', error);
  }
};
