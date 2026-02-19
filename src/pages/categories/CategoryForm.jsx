import React, { useEffect, useState } from "react";
import { Form, Input, Switch, Card, Upload, Button } from "antd";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

const CategoryForm = ({ editData, onClose }) => {
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        status: editData.status,
      });
      setImagePreview(editData.image);
      setSelectedImage(editData.image);
    }
  }, [editData]);

  const allowedTypes = "image/jpeg,image/jpg,image/png,image/svg+xml";

  const handleImageChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const fileName = `categories/${Date.now()}-${file.name}`;
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

const onFinish = async (values) => {
  if (!selectedImage && !editData?.image) {
    toast.error("Please select a category image");
    return;
  }

  try {
    setLoading(true);

    let imageUrl = editData?.image || null;

    // If new image selected (File object), upload it
    if (selectedImage instanceof File) {
      imageUrl = await uploadImage(selectedImage);
    }

    const payload = {
      name: values.name,
      image: imageUrl, // ✅ Save URL not File
      status: values.status ?? true,
      ...(editData ? {} : { createdAt: serverTimestamp() }),
      updatedAt: serverTimestamp(),
    };

    if (editData) {
      await updateDoc(doc(db, "categories", editData.id), payload);
      toast.success("Category updated successfully");
    } else {
      await addDoc(collection(db, "categories"), payload);
      toast.success("Category added successfully");
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
        <Form.Item label="Category Image" required>
          <Upload
            accept={allowedTypes}
            listType="picture-card"
            fileList={
              selectedImage
                ? [{ uid: "-1", name: selectedImage.name, status: "done" }]
                : []
            }
            onChange={handleImageChange}
            beforeUpload={() => false}
            maxCount={1}
            showUploadList={true}
          >
            <UploadOutlined /> <span className="ml-1"> Image</span>
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

        <button
          type="submit"
          disabled={loading || uploading}
          className="mt-4 py-1.5 px-4 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold transition disabled:opacity-60"
        >
          <SaveOutlined />{" "}
          {uploading
            ? "Uploading..."
            : editData
            ? "Update Category"
            : "Add Category"}
        </button>
      </Form>
    </div>
  );
};

export default CategoryForm;
