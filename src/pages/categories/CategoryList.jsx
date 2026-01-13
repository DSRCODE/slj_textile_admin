import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Image, Tag, Switch, Spin } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import CategoryForm from "./CategoryForm";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/PageBreadcrumb/PageBreadcrumb";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  /* ---------------- FETCH CATEGORIES ---------------- */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "categories"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- DELETE CATEGORY ---------------- */
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "categories", id));
      toast.success("Category deleted successfully");
      fetchCategories(); // refresh after delete
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOGGLE STATUS ---------------- */
  const handleStatusToggle = async (record) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, "categories", record.id), {
        status: !record.status,
      });
      toast.success("Status updated successfully");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TABLE COLUMNS ---------------- */
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
      render: (status) =>
        status ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.status === value,
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
            onClick={() => handleDelete(record.id)}
          />

          <Button
            type={record.status ? "default" : "primary"}
            icon={
              record.status ? <CloseCircleOutlined /> : <CheckCircleOutlined />
            }
            onClick={() => handleStatusToggle(record)}
          >
            {/* {record.status ? "Deactivate" : "Activate"} */}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <PageBreadcrumb title="Category Management" />

      <div className="flex justify-start mb-3">
        <button
          className="py-1.5 px-4 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600
          hover:from-yellow-600 hover:to-yellow-700
          text-white font-semibold transition"
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        >
          <PlusOutlined /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          bordered
          scroll={{ x: 800 }} 
        />
      )}

      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        destroyOnClose
        width={500}
      >
        <CategoryForm
          editData={editData}
          onClose={() => {
            setOpen(false);
            fetchCategories();
          }}
        />
      </Modal>
    </div>
  );
};

export default CategoryList;
