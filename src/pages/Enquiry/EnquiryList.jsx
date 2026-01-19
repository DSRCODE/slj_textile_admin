import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/PageBreadcrumb/PageBreadcrumb";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // ---------------- FETCH ENQUIRIES ----------------
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "enquiries"));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEnquiries(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // ---------------- DELETE ENQUIRY ----------------
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "enquiries", id));
      toast.success("Enquiry deleted successfully");
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete enquiry");
    }
  };

  // ---------------- TABLE COLUMNS ----------------
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => email || "-",
    },
    {
      title: "Contact",
      dataIndex: "contact",
    },
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "State",
      dataIndex: "state",
    },
    {
      title: "Product",
      dataIndex: ["product", "name"],
      render: (name, record) => record.product?.name || "-",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  // ---------------- EXPANDABLE ROW FOR MORE DETAILS ----------------
  const expandable = {
    expandedRowRender: (record) => {
      return (
        <div className="space-y-1">
          <p>
            <strong>Address:</strong> {record.address}
          </p>
          {record.product && (
            <p>
              <strong>Product Category:</strong> {record.product.categoryName}
            </p>
          )}
          <p>
            <strong>Submitted At:</strong>{" "}
            {record.createdAt?.toDate
              ? record.createdAt.toDate().toLocaleString()
              : "-"}
          </p>
        </div>
      );
    },
  };

  return (
    <div className="p-4">
      <PageBreadcrumb title="Enquiry List" />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
          No enquiries found.
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={enquiries}
          rowKey="id"
          bordered
          expandable={expandable}
          scroll={{ x: 900 }}
        />
      )}
    </div>
  );
};

export default EnquiryList;
