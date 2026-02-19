import React, { useState, useEffect } from "react";
import { Table, Button, Space, Image, Modal, Spin } from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/PageBreadcrumb/PageBreadcrumb";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import ProductForm from "./ProductForm";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [viewData, setViewData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "products"));
      console.log(snap);
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- DELETE PRODUCT ----------------
  const handleDelete = async (id) => {
    try {
      setLoadingDelete(true);
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    } finally {
      setLoadingDelete(false);
    }
  };

  // ---------------- TABLE COLUMNS ----------------
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => <Image width={50} src={img} />,
    },
    { title: "Product Name", dataIndex: "name" },
    { title: "Category", dataIndex: "categoryName" },
    { title: "Price", dataIndex: "price" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setViewData(record);
              setIsViewModalOpen(true);
            }}
          />

          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditData(record);
              setIsModalOpen(true);
            }}
          />

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            loading={loadingDelete}
          />
        </Space>
      ),
    },
  ];

  // ---------------- EXPANDABLE ROW FOR VARIANTS ----------------
  const expandable = {
    expandedRowRender: (record) => {
      if (!record.variants || record.variants.length === 0) {
        return <p style={{ margin: 0 }}>No variants available</p>;
      }

      const variantColumns = [
        { title: "Variant Name", dataIndex: "name" },
        { title: "Price", dataIndex: "price" },
        { title: "Description", dataIndex: "description" },
      ];

      return (
        <Table
          columns={variantColumns}
          dataSource={record.variants}
          pagination={false}
          rowKey={(v) => v.name + v.price}
        />
      );
    },
  };

  return (
    <div className="p-4">
      <PageBreadcrumb title="Product List" />

      {/* <div className="mb-2">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div> */}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          bordered
          expandable={expandable}
          scroll={{ x: 800 }}
        />
      )}

      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        width={700}
      >
        <ProductForm
          editData={editData}
          onClose={() => {
            setIsModalOpen(false);
            fetchProducts();
          }}
        />
      </Modal>

      <Modal
        open={isViewModalOpen}
        footer={null}
        onCancel={() => setIsViewModalOpen(false)}
        width={700}
      >
        {viewData && (
          <div className="space-y-4">
            {/* Image */}
            <div className="flex justify-center">
              <Image width={200} src={viewData.image} alt={viewData.name} />
            </div>

            {/* Basic Details */}
            <div>
              <h2 className="text-xl font-semibold">{viewData.name}</h2>
              <p className="text-gray-500">Category: {viewData.categoryName}</p>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-gray-600">{viewData.description}</p>
            </div>

            {/* Price */}
            <div>
              <h4 className="font-medium">Price</h4>
              <p>₹ {viewData.price}</p>
            </div>

            {/* Variants */}
            <div>
              <h4 className="font-medium mb-2">Variants</h4>

              {viewData.variants && viewData.variants.length > 0 ? (
                <Table
                  columns={[
                    { title: "Name", dataIndex: "name" },
                    { title: "Price", dataIndex: "price" },
                    { title: "Description", dataIndex: "description" },
                  ]}
                  dataSource={viewData.variants}
                  pagination={false}
                  rowKey={(v) => v.name + v.price}
                  size="small"
                />
              ) : (
                <p className="text-gray-500">No variants available</p>
              )}
            </div>

            {/* Stock */}
            {/* <div>
              <h4 className="font-medium">In Stock</h4>
              <p>{viewData.inStock ? "Yes" : "No"}</p>
            </div> */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;
