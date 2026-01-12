import React, { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Switch,
  Upload,
  Card,
  Col,
} from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../../redux/api/productApi";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/PageBreadcrumb/PageBreadcrumb";

const ProductForm = ({ editData, onClose }) => {
  const [form] = Form.useForm();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    }
  }, [editData]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "image") {
          if (value && value.length > 0) {
            formData.append("image", value[0].originFileObj);
          }
        } else {
          formData.append(key, value);
        }
      });

      if (editData) {
        await updateProduct({
          id: editData._id,
          formData,
        }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await addProduct(formData).unwrap();
        toast.success("Product added successfully");
        form.resetFields();
      }

      onClose?.();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="p-4">
      <PageBreadcrumb title={editData ? "Edit Product" : "Add New Product"} />

      <Card title={editData ? "Edit Product" : "Add New Product"}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>


          <Col>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Price is required" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item label="Discount Price" name="discountPrice">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </Col>

          <Form.Item label="In Stock" name="inStock" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Product Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
            rules={
              !editData ? [{ required: true, message: "Image required" }] : []
            }
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isAdding || isUpdating}
          >
            {editData ? "Update Product" : "Add Product"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ProductForm;
