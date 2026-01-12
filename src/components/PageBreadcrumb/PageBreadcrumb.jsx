import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const PageBreadcrumb = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSnippets = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems = [
    {
      title: (
        <span
          onClick={() => navigate("/")}
          className="flex items-center gap-1 cursor-pointer
          text-gray-700 hover:text-gray-900 font-medium"
        >
          <HomeOutlined />
          <span>Home</span>
        </span>
      ),
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSnippets.length - 1;

      const text = pathSnippets[index]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        title: isLast ? (
          <span className="text-gray-500 font-medium">{text}</span>
        ) : (
          <span
            onClick={() => navigate(url)}
            className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium"
          >
            {text}
          </span>
        ),
      };
    }),
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h1>

        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="text-sm" />
      </div>

      {/* Divider */}
      <div className="mt-4 h-px bg-gradient-to-r from-yellow-400 via-yellow-200 to-transparent" />
    </div>
  );
};

export default PageBreadcrumb;
