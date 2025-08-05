import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  Coffee,
  CreateCoffeeRequest,
  UpdateCoffeeRequest,
} from "../models/Coffee";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.COFFEE_TABLE!;

export class CoffeeService {
  async createCoffee(coffeeData: CreateCoffeeRequest): Promise<Coffee> {
    const now = new Date().toISOString();
    const coffee: Coffee = {
      id: uuidv4(),
      name: coffeeData.name.trim(),
      description: coffeeData.description.trim(),
      price: coffeeData.price,
      category: coffeeData.category.trim(),
      available: coffeeData.available ?? true,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: coffee,
    });

    await docClient.send(command);
    return coffee;
  }

  async listCoffees(): Promise<Coffee[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const result = await docClient.send(command);
    return (result.Items as Coffee[]) || [];
  }

  async getCoffee(id: string): Promise<Coffee | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    const result = await docClient.send(command);
    return (result.Item as Coffee) || null;
  }

  async deleteCoffee(id: string): Promise<boolean> {
    // Checking first if the coffee exists
    const existingCoffee = await this.getCoffee(id);
    if (!existingCoffee) {
      return false;
    }

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    await docClient.send(command);
    return true;
  }

  async updateCoffee(
    id: string,
    updateData: UpdateCoffeeRequest
  ): Promise<Coffee | null> {
    // Checking first if the coffee exists
    const existingCoffee = await this.getCoffee(id);
    if (!existingCoffee) {
      return null;
    }

    const now = new Date().toISOString();
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Building update expression dynamically
    if (updateData.name !== undefined) {
      updateExpression.push("#name = :name");
      expressionAttributeNames["#name"] = "name";
      expressionAttributeValues[":name"] = updateData.name.trim();
    }

    if (updateData.description !== undefined) {
      updateExpression.push("#description = :description");
      expressionAttributeNames["#description"] = "description";
      expressionAttributeValues[":description"] = updateData.description.trim();
    }

    if (updateData.price !== undefined) {
      updateExpression.push("#price = :price");
      expressionAttributeNames["#price"] = "price";
      expressionAttributeValues[":price"] = updateData.price;
    }

    if (updateData.category !== undefined) {
      updateExpression.push("#category = :category");
      expressionAttributeNames["#category"] = "category";
      expressionAttributeValues[":category"] = updateData.category.trim();
    }

    if (updateData.available !== undefined) {
      updateExpression.push("#available = :available");
      expressionAttributeNames["#available"] = "available";
      expressionAttributeValues[":available"] = updateData.available;
    }

    updateExpression.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = now;

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);
    return result.Attributes as Coffee;
  }
}
