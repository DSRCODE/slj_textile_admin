import React, { useEffect, useState } from "react";
import { Form, Input, Switch, Card } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { CATEGORY_IMAGES } from "../../Utills/Utills";

const CategoryForm = ({ editData, onClose }) => {
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        status: editData.status,
      });
      setSelectedImage(editData.image);
    }
  }, [editData]);

  const onFinish = async (values) => {
    if (!selectedImage) {
      toast.error("Please select a category image");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: values.name,
        image: selectedImage,
        status: true,
        ...(editData ? {} : { createdAt: serverTimestamp() }),
      };

      if (editData) {
        await updateDoc(doc(db, "categories", editData.id), payload);
        toast.success("Category updated successfully");
      } else {
        await addDoc(collection(db, "categories"), payload);
        toast.success("Category added successfully");
        form.resetFields();
        setSelectedImage(null);
      }

      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
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

        {/* IMAGE SELECTION */}
        <Form.Item label="Select Category Image" required>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORY_IMAGES.map((img) => (
              <Card
                key={img.id}
                hoverable
                onClick={() => setSelectedImage(img.url)}
                className={`border-2 ${
                  selectedImage === img.url
                    ? "border-yellow-500"
                    : "border-transparent"
                }`}
                bodyStyle={{ padding: 6 }}
              >
                <img
                  src={img.url}
                  alt="category"
                  className="h-20 w-full object-cover rounded"
                />
              </Card>
            ))}
          </div>
        </Form.Item>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 py-1.5 px-4 rounded-lg
          bg-gradient-to-r from-yellow-500 to-yellow-600
          hover:from-yellow-600 hover:to-yellow-700
          text-white font-semibold transition disabled:opacity-60"
        >
          <SaveOutlined /> {editData ? "Update Category" : "Add Category"}
        </button>
      </Form>
    </div>
  );
};

export default CategoryForm;
