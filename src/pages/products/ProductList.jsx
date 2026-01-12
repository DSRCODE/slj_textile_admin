import React, { useState } from "react";
import { Table, Button, Space, Modal, Image } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApi";
import ProductForm from "./ProductForm";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/PageBreadcrumb/PageBreadcrumb";

const ProductList = () => {
  const { data, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleDelete = async (id) => {
    await deleteProduct(id).unwrap();
    toast.success("Product deleted");
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => <Image width={50} src={img} />,
    },
    { title: "Title", dataIndex: "title" },
    { title: "Price", dataIndex: "price" },
    { title: "Stock", dataIndex: "inStock", render: (v) => (v ? "Yes" : "No") },
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
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <PageBreadcrumb title="Product List" />
      {/* <Button
        type="primary"
        icon={<PlusOutlined />}
        className="mb-3"
        onClick={() => {
          setEditData(null);
          setIsModalOpen(true);
        }}
      >
        Add Product
      </Button> */}

      <Table
        columns={columns}
        dataSource={data?.response || []}
        rowKey="_id"
        loading={isLoading}
        bordered
      />

      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        width={600}
      >
        <ProductForm
          editData={editData}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProductList;
