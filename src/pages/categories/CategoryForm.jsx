import React, { useEffect } from "react";
import { Form, Input, Button, Upload, Switch, Card } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryApi";
import { toast } from "react-toastify";

const CategoryForm = ({ editData, onClose }) => {
  const [form] = Form.useForm();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        status: editData.status,
      });
    }
  }, [editData]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      if (typeof values.status === "boolean") {
        formData.append("status", values.status);
      }

      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0].originFileObj);
      }

      if (editData) {
        await updateCategory({
          id: editData._id,
          formData,
        }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await addCategory(formData).unwrap();
        toast.success("Category added successfully");
        form.resetFields();
      }

      onClose?.();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div>
      <h5 className="text-lg font-semibold mb-4">
        {editData ? "Edit Category" : "Add Category"}
      </h5>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          label="Category Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={
            !editData ? [{ required: true, message: "Image is required" }] : []
          }
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        {editData && (
          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        )}

        <button
          type="submit"
          disabled={isAdding || isUpdating}
          className=" py-1.5 px-4 mb-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600
  hover:from-yellow-600 hover:to-yellow-700
                  text-white font-semibold 
                  transition disabled:opacity-60"
        >
          <SaveOutlined /> {editData ? "Update Category" : "Add Category"}
        </button>
      </Form>
    </div>
  );
};

export default CategoryForm;
