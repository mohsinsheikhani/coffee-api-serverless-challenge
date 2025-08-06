# Coffee Shop API - Serverless CRUD REST API

Serverless Guru Coding Challenge 5.
A Coffee Shop CRUD REST API built with Serverless Framework v4, TypeScript, AWS Lambda, API Gateway, DynamoDB and GitHub Actions.

## Table of Contents

- [Backend Architecture](#architecture)
- [Features](#features)
- [Design Decisions](#design-decisions)
- [Plugins](#plugins)
- [API Endpoints](#api)
- [Request/Response Examples](#example)
- [CI/CD Pipeline](#pipeline)
- [Environment Management](#environment-management)
- [Installation](#installation)
- [Usage with frontend](#usage)

### Backend Architecture

The serverless backend leverages AWS services to create a fully managed, scalable API:

- **API Gateway**: Serves as the entry point for all HTTP requests with built-in CORS support
- **AWS Lambda Functions**: Five dedicated functions handling specific operations (create, read, update, delete, list)
- **DynamoDB**: Single-table design with simple key schema optimized for coffee data operations
- **GitHub Actions**: CI/CD pipeline for automated deployments
- **IAM Roles**: Function-specific permissions following the principle of least privilege

## Features

- CRUD operations (Create, Read, Update, Delete)
- TypeScript implementation with strict typing
- Input validation and error handling
- Unit tests with Jest
- Multi-stage deployments (dev/prod)
- GitHub Actions CI/CD pipeline
- Comprehensive logging
- Infrastructure as Code (IaC)

### Design Decisions

**Service Layer Pattern**: Implemented a dedicated `CoffeeService` class that encapsulates all DynamoDB operations, making the code more testable and maintainable.

**Function-per-Operation**: Each CRUD operation is handled by a separate Lambda function, enabling independent scaling and deployment.

**Type Safety**: Comprehensive TypeScript interfaces ensure type safety across the entire application, with separate types for create and update operations.

**Error Handling**: Centralized error handling with consistent HTTP response formatting and detailed logging for debugging.

**Input Validation**: JSON schema validation at the API Gateway level combined with runtime validation using Zod for robust input handling.

## Plugins

This project utilizes:

- **serverless-iam-roles-per-function**: Enables granular IAM permissions for each Lambda function, ensuring each function only has access to the specific DynamoDB operations it needs

## API Endpoints

| Method | Endpoint       | Description                 | Required Fields                            |
| ------ | -------------- | --------------------------- | ------------------------------------------ |
| POST   | `/coffee`      | Create a new coffee         | name, description, price, category         |
| GET    | `/coffee`      | List all coffees            | None                                       |
| GET    | `/coffee/{id}` | Get a specific coffee by ID | id (path parameter)                        |
| PUT    | `/coffee/{id}` | Update a coffee             | id (path parameter) + any updatable fields |
| DELETE | `/coffee/{id}` | Delete a coffee             | id (path parameter)                        |

### Request/Response Examples

**Create Coffee (POST /coffee)**

```json
{
  "name": "Hot Chocolate",
  "description": "Chocolate lovers",
  "price": 2.5,
  "category": "Hot Coffee",
  "available": true
}
```

**Response**

```json
{
  "id": "uuid-generated-id",
  "name": "Hot Chocolate",
  "description": "Chocolate lovers",
  "price": 2.5,
  "category": "Hot Coffee",
  "available": true,
  "createdAt": "2024-08-06T17:00:00.000Z",
  "updatedAt": "2024-08-06T17:00:00.000Z"
}
```

## CI/CD Pipeline

The project implements a comprehensive CI/CD strategy using GitHub Actions with separate workflows for different environments and operations:

- **deploy-dev.yml**: Automatically deploys to development environment on push to dev branch
- **deploy-prod.yml**: Handles production deployments on push to main branch
- **destroy-dev.yml**: Cleanup workflow for development resources
- **destroy-prod.yml**: Cleanup workflow for development resources

### Environment Management

The application supports multiple deployment stages (dev/prod) with:

- Stage-specific resource naming
- Environment-specific configuration
- Isolated DynamoDB tables per stage
- CloudFormation outputs for resource references

## Prerequisites

- Node.js 20.x or later
- pnpm
- AWS CLI configured
- Serverless Framework v4

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mohsinsheikhani/coffee-api-serverless-challenge.git
cd coffee-api-serverless-challenge/backend
```

2. Install dependencies:

```bash
pnpm install
```

3. Run test cases:

```bash
pnpm test
```

4. Deploy in development stage:

```bash
pnpm deploy:dev
```

Once deployed, copy the Base endpoint from the terminal output

## Usage with frontend

```bash
cd ..
cd frontend
npm install
touch .env
```

Paste the BASE_URL from the installation step, .env will look like

```bash
NEXT_PUBLIC_BASE_URL=BASE_URL
```

Run the app

```bash
npm run dev
```
