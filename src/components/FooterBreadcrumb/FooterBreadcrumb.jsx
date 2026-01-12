import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function FooterBreadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const paths = location.pathname.split("/").filter(Boolean);
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-white px-4 py-3 text-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-gray-600">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-gray-900 font-medium"
          >
            Home
          </span>

          {paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const url = `/${paths.slice(0, index + 1).join("/")}`;

            const label = path
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <React.Fragment key={index}>
                <span className="mx-1 text-gray-400">/</span>
                {isLast ? (
                  <span className="text-gray-500">{label}</span>
                ) : (
                  <span
                    onClick={() => navigate(url)}
                    className="cursor-pointer hover:text-gray-900 font-medium"
                  >
                    {label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500">
          © {year}{" "}
          <span className="font-medium text-gray-700">SLJ Textiles</span>. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
