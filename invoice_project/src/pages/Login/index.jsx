import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import invoiceLogo from "../../assets/images/invoice.jpeg";
import FormField from "../../components/FormField";
import apiClient from "../../api/apiClient";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.post("auth/login/", {
        email: data.email,
        password: data.password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      onLogin();
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            backgroundImage: `url(${invoiceLogo})`,
            width: "500px",
            height: "200px",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            marginRight: "2rem",
          }}
        />
        <div style={{ width: "100%" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              color: "#181818",
              marginBottom: "1rem",
            }}
          >
            INVOICE
          </h2>
          <p style={{ fontSize: "14px", fontWeight: "800", color: "#6b7280", marginBottom: "1rem" }}>
            Sign in to your account
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <FormField
              label="Email Address"
              placeholder="Enter your email address..."
              name="email"
              register={register}
              type="email"
              error={errors.email}
            />
            <FormField
              label="Password"
              placeholder="Enter your password..."
              name="password"
              type="password"
              register={register}
              error={errors.password}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#181818",
                color: "#f0f0f0",
                fontSize: "0.875rem",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid #181818",
                cursor: "pointer",
                transition: "all 0.3s",
                marginTop: "1rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
                e.currentTarget.style.color = "#181818";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#181818";
                e.currentTarget.style.color = "#f0f0f0";
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
