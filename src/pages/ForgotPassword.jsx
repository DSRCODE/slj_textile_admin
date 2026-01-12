import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa6";

const { Title, Paragraph } = Typography;

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  newPassword: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Required"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await fetch(
        "https://82.25.105.208:3001/api/admin/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            newPassword: values.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        message.success("Password reset successful");
        navigate("/login");
      } else {
        message.error(data.message || "Password reset failed");
      }
    } catch {
      message.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-green-50 to-white">
      {/* Left Branding Section */}
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
          <h4 className="text-4xl font-semibold text-center mb-2">
            SLJ Textiles
          </h4>
          <p className="text-center">
            {" "}
            Admin panel for managing textile production, inventory, orders, and
            exports with precision.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <Title level={3} className="!mb-1">
              Reset Password
            </Title>
            <p className="text-gray-500 text-sm">
              Enter your registered email and new password
            </p>
          </div>

          {/* Form */}
          <Formik
            initialValues={{
              email: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={ForgotSchema}
            onSubmit={handleSubmit}
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
                {/* Email */}
                <div>
                  <Input
                    name="email"
                    size="large"
                    placeholder="Registered Email"
                    prefix={<MailOutlined className="text-gray-400" />}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <Input.Password
                    name="newPassword"
                    size="large"
                    placeholder="New Password"
                    prefix={<LockOutlined className="text-gray-400" />}
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.newPassword && errors.newPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Input.Password
                    name="confirmPassword"
                    size="large"
                    placeholder="Confirm Password"
                    prefix={<LockOutlined className="text-gray-400" />}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg
  bg-gradient-to-r from-yellow-500 to-yellow-600
  hover:from-yellow-600 hover:to-yellow-700
  text-white font-semibold
  transition disabled:opacity-60"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-green-700 hover:underline"
                  >
                    Back to Login
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
