import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Switch,
  Card,
  Select,
  Space,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { CATEGORY_IMAGES } from "../../Utills/Utills";

const { Option } = Select;

const ProductForm = ({ editData, onClose }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(editData?.image || null);

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const snap = await getDocs(collection(db, "categories"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        description: editData.description,
        categoryId: editData.categoryId,
        price: editData.price,
        inStock: editData.inStock,
        variants: editData.variants || [],
      });
      setSelectedImage(editData.image);
    } else {
      form.resetFields();
      setSelectedImage(null);
    }
  }, [editData]);

  // ---------------- SAVE PRODUCT ----------------
  const onFinish = async (values) => {
    if (!selectedImage) {
      toast.error("Please select a product image");
      return;
    }

    try {
      setLoading(true);

      const categoryObj = categories.find((c) => c.id === values.categoryId);

      const payload = {
        ...values,
        categoryName: categoryObj?.name || "",
        image: selectedImage,
        createdAt: editData ? editData.createdAt : serverTimestamp(),
      };

      if (editData) {
        await updateDoc(doc(db, "products", editData.id), payload);
        toast.success("Product updated successfully");
      } else {
        await addDoc(collection(db, "products"), payload);
        toast.success("Product added successfully");
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
    <div className=" flex flex-col items-center ">
      <div className="max-w-6xl p-8 border border-gray-200 rounded-md shadow-lg">
        <h4 className="py-1 font-medium">{editData ? "Edit Product" : "Add Product"}</h4>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            placeholder="Enter product description"
            rules={[{ required: true, message: "Description required" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Category required" }]}
          >
            <Select placeholder="Select Category">
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* IMAGE SELECTION */}
          <Form.Item label="Select Product Image" required>
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
                    alt="product"
                    className="h-20 w-full object-cover rounded"
                  />
                </Card>
              ))}
            </div>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            placeholder="Enter product price"
            rules={[{ required: true, message: "Price required" }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          {/* VARIANTS */}
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <div>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" className="mb-2 flex">
                    <Form.Item
                      {...field}
                      name={[field.name, "name"]}
                      fieldKey={[field.fieldKey, "name"]}
                      rules={[
                        { required: true, message: "Variant name required" },
                      ]}
                    >
                      <Input placeholder="Variant Name" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "price"]}
                      fieldKey={[field.fieldKey, "price"]}
                      rules={[{ required: true, message: "Price required" }]}
                    >
                      <InputNumber placeholder="Price" min={0} />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "description"]}
                      fieldKey={[field.fieldKey, "description"]}
                    >
                      <Input placeholder="Variant Description" />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Variant
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            className="mt-4"
          >
            {editData ? "Update Product" : "Add Product"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ProductForm;
