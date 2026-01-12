import React, { useState } from "react";
import { Table, Button, Space, Modal, Image, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApi";
import CategoryForm from "./CategoryForm";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/PageBreadcrumb/PageBreadcrumb";

const CategoryList = () => {
  const { data, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleDelete = async (id) => {
    await deleteCategory(id).unwrap();
    toast.success("Category deleted");
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => <Image width={50} src={img} />,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v) =>
        v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditData(record);
              setOpen(true);
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
      <PageBreadcrumb title="Category Management" />

      <div className="flex justify-start">
        <button
          className=" py-1.5 px-4 mb-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600
  hover:from-yellow-600 hover:to-yellow-700
                  text-white font-semibold 
                  transition disabled:opacity-60"
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        >
          <PlusOutlined /> Add Category
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.response || []}
        rowKey="_id"
        loading={isLoading}
        bordered
      />

      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        destroyOnClose
        width={500}
      >
        <CategoryForm editData={editData} onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
};

export default CategoryList;
