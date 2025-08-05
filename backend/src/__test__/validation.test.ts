import {
  validateCreateCoffeeRequest,
  validateUpdateCoffeeRequest,
} from "../utils/validation";
import { CoffeeService } from "../services/dynamoService";

jest.mock("../services/dynamoService");
const mockCoffeeService = CoffeeService as jest.MockedClass<
  typeof CoffeeService
>;

describe("Zod Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Coffee Validation", () => {
    it("should validate correct coffee data", () => {
      const validData = {
        name: "Espresso",
        description: "Strong coffee shot",
        price: 2.5,
        category: "Hot Coffee",
        available: true,
      };

      const result = validateCreateCoffeeRequest(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid coffee data", () => {
      const invalidData = {
        name: "",
        price: -1,
      };

      const result = validateCreateCoffeeRequest(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should validate coffee data and successfully create coffee in DynamoDB", async () => {
      const inputCoffeeData = {
        name: "Chocolate Fudge Frappe",
        description: "Frappes",
        price: 2.5,
        category: "Cold Coffee",
        available: true,
      };

      // Mocking the expected return value from createCoffee
      const now = new Date().toISOString();
      const mockCreatedCoffee = {
        id: "mock-uuid-123",
        name: "Chocolate Fudge Frappe",
        description: "Frappes",
        price: 2.5,
        category: "Cold Coffee",
        available: true,
        createdAt: now,
        updatedAt: now,
      };

      const mockCreateCoffee = jest.fn().mockResolvedValue(mockCreatedCoffee);
      mockCoffeeService.prototype.createCoffee = mockCreateCoffee;

      const validationResult = validateCreateCoffeeRequest(inputCoffeeData);
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);

      const coffeeService = new CoffeeService();
      const result = await coffeeService.createCoffee(inputCoffeeData);

      expect(mockCreateCoffee).toHaveBeenCalledTimes(1);
      expect(mockCreateCoffee).toHaveBeenCalledWith(inputCoffeeData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe("string");
    });
  });

  describe("Update Coffee Validation", () => {
    it("should validate partial update data", () => {
      const validUpdate = {
        name: "Updated Espresso",
        price: 3.0,
      };

      const result = validateUpdateCoffeeRequest(validUpdate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject empty update data", () => {
      const emptyUpdate = {};

      const result = validateUpdateCoffeeRequest(emptyUpdate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("At least one field required for update");
    });
  });
});
