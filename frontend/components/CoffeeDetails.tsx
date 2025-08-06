import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { Coffee } from '../types/coffee';

interface CoffeeDetailsProps {
  visible: boolean;
  onCancel: () => void;
  coffee: Coffee | null;
}

const CoffeeDetails: React.FC<CoffeeDetailsProps> = ({
  visible,
  onCancel,
  coffee,
}) => {
  if (!coffee) return null;

  return (
    <Modal
      title="Coffee Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Name">
          <strong>{coffee.name}</strong>
        </Descriptions.Item>
        
        <Descriptions.Item label="Category">
          <Tag color="blue">{coffee.category}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="Price">
          <strong>${coffee.price.toFixed(2)}</strong>
        </Descriptions.Item>
        
        <Descriptions.Item label="Availability">
          <Tag color={coffee.available ? 'green' : 'red'}>
            {coffee.available ? 'Available' : 'Out of Stock'}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="Description">
          {coffee.description}
        </Descriptions.Item>
        
        <Descriptions.Item label="Created At">
          {new Date(coffee.createdAt).toLocaleString()}
        </Descriptions.Item>
        
        <Descriptions.Item label="Last Updated">
          {new Date(coffee.updatedAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default CoffeeDetails;
