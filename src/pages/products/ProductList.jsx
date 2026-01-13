import React, { useState, useEffect } from "react";
import { Table, Button, Space, Image, Modal, Spin } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
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
          ></Button>
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
    </div>
  );
};

export default ProductList;
