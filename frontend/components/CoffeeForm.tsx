import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Switch, Button, Modal } from 'antd';
import { Coffee, CreateCoffeeRequest, UpdateCoffeeRequest } from '../types/coffee';

const { TextArea } = Input;
const { Option } = Select;

interface CoffeeFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateCoffeeRequest | UpdateCoffeeRequest) => void;
  coffee?: Coffee;
  loading?: boolean;
  title: string;
}

const CoffeeForm: React.FC<CoffeeFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  coffee,
  loading,
  title,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (coffee) {
        form.setFieldsValue({
          name: coffee.name,
          description: coffee.description,
          price: coffee.price,
          category: coffee.category,
          available: coffee.available,
        });
      } else {
        form.resetFields();
      }
    }
  }, [coffee, form, visible]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      if (!coffee) {
        form.resetFields();
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      destroyOnHidden={true}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {coffee ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ available: true }}
      >
        <Form.Item
          name="name"
          label="Coffee Name"
          rules={[{ required: true, message: 'Please enter coffee name' }]}
        >
          <Input placeholder="Enter coffee name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={3} placeholder="Enter coffee description" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price ($)"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: '100%' }}
            placeholder="Enter price"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select placeholder="Select category">
            <Option value="Espresso">Espresso</Option>
            <Option value="Latte">Latte</Option>
            <Option value="Cappuccino">Cappuccino</Option>
            <Option value="Americano">Americano</Option>
            <Option value="Mocha">Mocha</Option>
            <Option value="Macchiato">Macchiato</Option>
            <Option value="Cold Brew">Cold Brew</Option>
            <Option value="Frappuccino">Frappuccino</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="available"
          label="Available"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CoffeeForm;
