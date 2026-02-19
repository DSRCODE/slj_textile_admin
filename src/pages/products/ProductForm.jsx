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
  Upload,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { CATEGORY_IMAGES } from "../../Utills/Utills";

const { Option } = Select;

const ProductForm = ({ editData, onClose }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // File object
  const [imagePreview, setImagePreview] = useState(null); // Preview URL
  const [uploading, setUploading] = useState(false);

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
      setSelectedImage(null);
      setImagePreview(editData.image);
    } else {
      form.resetFields();
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [editData]);

  const allowedTypes = "image/jpeg,image/jpg,image/png,image/svg+xml";

  const handleImageChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
        setSelectedImage(file);
      }
    } else {
      setSelectedImage(null);
      setImagePreview(editData?.image || null);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const fileName = `products/${Date.now()}-${file.name}`; // Unique name [web:20]
    const imageRef = ref(storage, fileName);

    try {
      setUploading(true);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } finally {
      setUploading(false);
    }
  };

  // ---------------- SAVE PRODUCT ----------------
  const onFinish = async (values) => {
    try {
      setLoading(true);

      let imageUrl = editData?.image || null;

      // ADD MODE → image required
      if (!editData && !selectedImage) {
        toast.error("Please select a product image");
        return;
      }

      // If new image selected (File object), upload it
      if (selectedImage instanceof File) {
        imageUrl = await uploadImage(selectedImage);
      }

      const categoryObj = categories.find((c) => c.id === values.categoryId);

      const payload = {
        ...values,
        categoryName: categoryObj?.name || "",
        image: imageUrl,
        createdAt: editData ? editData.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (editData) {
        await updateDoc(doc(db, "products", editData.id), payload);
        toast.success("Product updated successfully");
      } else {
        await addDoc(collection(db, "products"), payload);
        toast.success("Product added successfully");

        form.resetFields();
        setSelectedImage(null);
        setImagePreview(null);
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
      <div
        className={`max-w-6xl ${
          editData
            ? " p-2 "
            : "border p-8 w-2/4 border-gray-200 rounded-md shadow-lg"
        } `}
      >
        <h4 className="py-1 font-medium">
          {editData ? "Edit Product" : "Add Product"}
        </h4>

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
          <Form.Item label="Product Image" required>
            <Upload
              accept={allowedTypes}
              listType="picture-card"
              fileList={
                selectedImage
                  ? [
                      {
                        uid: "-1",
                        name: selectedImage.name,
                        status: "done",
                      },
                    ]
                  : imagePreview
                  ? [
                      {
                        uid: "-1",
                        name: "product-image",
                        status: "done",
                        url: imagePreview,
                      },
                    ]
                  : []
              }
              onChange={handleImageChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              <UploadOutlined />
              <span className="ml-1">Image</span>
            </Upload>
            {imagePreview && (
              <Card className="mt-3" bodyStyle={{ padding: 12 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-full object-cover rounded"
                />
              </Card>
            )}
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Price required" },
              {
                pattern: /^[1-9][0-9]*$/,
                message: "Only positive numbers allowed",
              },
            ]}
          >
            <Input
              placeholder="Enter product price"
              className="w-full"
              inputMode="numeric"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
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
            loading={loading || uploading}
            className="mt-4"
          >
            {uploading
              ? "Uploading..."
              : editData
              ? "Update Product"
              : "Add Product"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ProductForm;
