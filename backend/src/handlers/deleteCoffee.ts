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
    console.log('Delete coffee request:', JSON.stringify(event, null, 2));

    const coffeeId = event.pathParameters?.id;
    if (!coffeeId) {
      return badRequestResponse('Coffee ID is required');
    }

    // Delete coffee
    const deleted = await coffeeService.deleteCoffee(coffeeId);

    if (!deleted) {
      return notFoundResponse(`Coffee with ID ${coffeeId} not found`);
    }

    console.log(`Coffee with ID ${coffeeId} deleted successfully`);
    return successResponse({
      message: `Coffee with ID ${coffeeId} has been deleted`,
      id: coffeeId,
    });
  } catch (error) {
    console.error('Error deleting coffee:', error);
    return internalServerErrorResponse('Failed to delete coffee', error);
  }
};
