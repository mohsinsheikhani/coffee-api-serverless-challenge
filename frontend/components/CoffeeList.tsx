import React, { useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, Card } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Coffee } from '../types/coffee';
import { useDeleteCoffee } from '../hooks/useCoffee';

interface CoffeeListProps {
  coffees: Coffee[];
  loading: boolean;
  onEdit: (coffee: Coffee) => void;
  onView: (coffee: Coffee) => void;
}

const CoffeeList: React.FC<CoffeeListProps> = ({
  coffees,
  loading,
  onEdit,
  onView,
}) => {
  const deleteCoffeeMutation = useDeleteCoffee();

  const handleDelete = (id: string) => {
    deleteCoffeeMutation.mutate(id);
  };

  // Ensure coffees is always an array
  const safeDataSource = Array.isArray(coffees) ? coffees : [];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Available',
      dataIndex: 'available',
      key: 'available',
      render: (available: boolean) => (
        <Tag color={available ? 'green' : 'red'}>
          {available ? 'Available' : 'Out of Stock'}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <div style={{ maxWidth: 200 }}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Coffee) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            title="Edit Coffee"
          />
          <Popconfirm
            title="Are you sure you want to delete this coffee?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deleteCoffeeMutation.isPending}
              title="Delete Coffee"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Coffee Menu" style={{ marginTop: 16 }}>
      <Table
        columns={columns}
        dataSource={safeDataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} coffees`,
        }}
      />
    </Card>
  );
};

export default CoffeeList;
