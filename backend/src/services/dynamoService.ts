import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Coffee, CreateCoffeeRequest } from "../models/Coffee";
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
}
