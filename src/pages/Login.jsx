import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const { Title, Paragraph } = Typography;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(4).required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      // MOCK LOGIN
      await new Promise((r) => setTimeout(r, 800));

      login({
        token: "dummy.jwt.token",
        user: { name: "SLJ Textile Admin", role: "ADMIN" },
      });

      toast.success("Login successful");
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#f8fafc]">
      {/* LEFT BRAND SECTION */}
      <div
        className="hidden md:flex flex-col justify-center px-20 text-white relative"
        style={{
          backgroundImage:
            "url('https://italianartisan.com/wp-content/uploads/2024/11/10-Best-Luxury-Clothing-Manufacturers-For-Your-Business-scaled.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center gap-2">
            <img src="/logo.png" alt="SLJ Textile" className="w-24" />
            <h4 className="text-4xl font-semibold text-center mb-2">
              SLJ Textiles
            </h4>
            <p className="text-center">
              {" "}
              Admin panel for managing textile production, inventory, orders,
              and exports with precision.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN CARD */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
          <Title level={3} className="!mb-1 text-[#111827]">
            Admin Login
          </Title>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to manage SLJ Textiles
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form className="space-y-5">
                <div>
                  <Input
                    name="email"
                    size="large"
                    placeholder="Email"
                    prefix={<MailOutlined />}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Input.Password
                    name="password"
                    size="large"
                    placeholder="Password"
                    prefix={<LockOutlined />}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.password && errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg
  bg-gradient-to-r from-yellow-500 to-yellow-600
  hover:from-yellow-600 hover:to-yellow-700
  text-white font-semibold
  transition disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                </button>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-[#b45309] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
