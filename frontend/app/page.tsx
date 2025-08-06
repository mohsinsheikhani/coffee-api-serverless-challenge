"use client";

import React, { useState } from "react";
import { Layout, Button, Typography, Space, Spin, Alert } from "antd";
import { PlusOutlined, CoffeeOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCoffees,
  useCreateCoffee,
  useUpdateCoffee,
} from "../hooks/useCoffee";
import CoffeeForm from "../components/CoffeeForm";
import CoffeeList from "../components/CoffeeList";
import CoffeeDetails from "../components/CoffeeDetails";
import {
  Coffee,
  CreateCoffeeRequest,
  UpdateCoffeeRequest,
} from "../types/coffee";

const { Header, Content } = Layout;
const { Title } = Typography;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const CoffeeApp: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null);
  const [editingCoffee, setEditingCoffee] = useState<Coffee | undefined>(
    undefined
  );

  const { data: coffees, isLoading, error } = useCoffees();
  const createCoffeeMutation = useCreateCoffee();
  const updateCoffeeMutation = useUpdateCoffee();

  const handleCreateCoffee = () => {
    setEditingCoffee(undefined);
    setIsFormVisible(true);
  };

  const handleEditCoffee = (coffee: Coffee) => {
    setEditingCoffee(coffee);
    setIsFormVisible(true);
  };

  const handleViewCoffee = (coffee: Coffee) => {
    setSelectedCoffee(coffee);
    setIsDetailsVisible(true);
  };

  const handleFormSubmit = (
    values: CreateCoffeeRequest | UpdateCoffeeRequest
  ) => {
    if (editingCoffee) {
      updateCoffeeMutation.mutate(
        { id: editingCoffee.id, data: values },
        {
          onSuccess: () => {
            setIsFormVisible(false);
            setEditingCoffee(undefined);
          },
        }
      );
    } else {
      createCoffeeMutation.mutate(values as CreateCoffeeRequest, {
        onSuccess: () => {
          setIsFormVisible(false);
        },
      });
    }
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingCoffee(undefined);
  };

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "50px" }}>
          <Alert
            message="Error Loading Coffees"
            description="Failed to load coffee data. Please check your API connection."
            type="error"
            showIcon
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Header
        style={{
          backgroundColor: "#8B4513",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Space>
          <CoffeeOutlined style={{ fontSize: "24px", color: "white" }} />
          <Title level={2} style={{ color: "white", margin: 0 }}>
            Coffee Shop Manager
          </Title>
        </Space>
      </Header>

      <Content style={{ padding: "24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Manage Your Coffee Menu
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateCoffee}
              size="large"
              style={{ backgroundColor: "#8B4513", borderColor: "#8B4513" }}
            >
              Add New Coffee
            </Button>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
              <p style={{ marginTop: "16px" }}>Loading coffee menu...</p>
            </div>
          ) : (
            <CoffeeList
              coffees={coffees || []}
              loading={isLoading}
              onEdit={handleEditCoffee}
              onView={handleViewCoffee}
            />
          )}

          <CoffeeForm
            visible={isFormVisible}
            onCancel={handleFormCancel}
            onSubmit={handleFormSubmit}
            coffee={editingCoffee}
            loading={
              createCoffeeMutation.isPending || updateCoffeeMutation.isPending
            }
            title={editingCoffee ? "Edit Coffee" : "Add New Coffee"}
          />

          <CoffeeDetails
            visible={isDetailsVisible}
            onCancel={() => setIsDetailsVisible(false)}
            coffee={selectedCoffee}
          />
        </div>
      </Content>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CoffeeApp />
    </QueryClientProvider>
  );
};

export default App;
