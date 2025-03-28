import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import invoiceLogo from "../../assets/images/invoice.jpeg";
import FormField from "../../components/FormField";
import apiClient from "../../api/apiClient";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { uidb64, token } = useParams();
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();
  const {
    register: forgotRegister,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm();
  const {
    register: resetRegister,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    watch,
  } = useForm();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitLogin = async (data) => {
    try {
      setLoading(true);
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
      console.error("Login error:", error.response?.data || error);
      setMessage(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitForgotPassword = async (data) => {
    try {
      setLoading(true);
      await apiClient.post("auth/request-password-reset/", {
        email: data.forgotEmail,
      });
      setMessage("Password reset link sent to your email!");
      setShowForgotPassword(false);
    } catch (error) {
      console.error("Forgot password error:", error.response?.data || error);
      setMessage(
        error.response?.data?.error || "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmitResetPassword = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await apiClient.post(
        `auth/reset-password/${uidb64}/${token}/`,
        {
          new_password: data.newPassword,
          confirm_password: data.confirmPassword,
        }
      );
      setMessage(response.data.detail);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Reset password error:", error.response?.data || error);
      setMessage(
        error.response?.data?.error || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const newPassword = watch("newPassword");
  const isResetPassword = uidb64 && token;

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
            {isResetPassword ? "Reset Password" : "INVOICE"}
          </h2>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "800",
              color: "#6b7280",
              marginBottom: "1rem",
            }}
          >
            {isResetPassword ? "Enter your new password below" : "Sign in to your account"}
          </p>
          {message && (
            <p
              style={{
                fontSize: "14px",
                color: message.includes("Failed") ? "#ef4444" : "#10b981",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}
          {loading && (
            <p style={{ textAlign: "center", color: "#6b7280" }}>Loading...</p>
          )}

          {/* Reset Password Form */}
          {isResetPassword && (
            <form
              onSubmit={handleResetSubmit(onSubmitResetPassword)}
              style={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <FormField
                label="New Password"
                placeholder="Enter your new password..."
                name="newPassword"
                type="password"
                register={resetRegister}
                error={resetErrors.newPassword}
                required
              />
              <FormField
                label="Confirm Password"
                placeholder="Confirm your new password..."
                name="confirmPassword"
                type="password"
                register={resetRegister}
                error={resetErrors.confirmPassword}
                required
                validate={(value) =>
                  value === newPassword || "Passwords do not match"
                }
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#181818",
                  color: "#f0f0f0",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  border: "1px solid #181818",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  marginTop: "1rem",
                  opacity: loading ? "0.5" : "1",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                    e.currentTarget.style.color = "#181818";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#181818";
                    e.currentTarget.style.color = "#f0f0f0";
                  }
                }}
              >
                {loading ? "Submitting..." : "Done"}
              </button>
            </form>
          )}

          {/* Login Form */}
          {!isResetPassword && !showForgotPassword && (
            <form
              onSubmit={handleLoginSubmit(onSubmitLogin)}
              style={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <FormField
                label="Email Address"
                placeholder="Enter your email address..."
                name="email"
                register={loginRegister}
                type="email"
                error={loginErrors.email}
              />
              <FormField
                label="Password"
                placeholder="Enter your password..."
                name="password"
                type="password"
                register={loginRegister}
                error={loginErrors.password}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#181818",
                  color: "#f0f0f0",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  border: "1px solid #181818",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  marginTop: "1rem",
                  opacity: loading ? "0.5" : "1",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                    e.currentTarget.style.color = "#181818";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#181818";
                    e.currentTarget.style.color = "#f0f0f0";
                  }
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginTop: "1rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </p>
            </form>
          )}

          {/* Forgot Password Form */}
          {!isResetPassword && showForgotPassword && (
            <form
              onSubmit={handleForgotSubmit(onSubmitForgotPassword)}
              style={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <FormField
                label="Email Address"
                placeholder="Enter your email address..."
                name="forgotEmail"
                type="email"
                register={forgotRegister}
                error={forgotErrors.forgotEmail}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#181818",
                  color: "#f0f0f0",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  border: "1px solid #181818",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  marginTop: "1rem",
                  opacity: loading ? "0.5" : "1",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                    e.currentTarget.style.color = "#181818";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#181818";
                    e.currentTarget.style.color = "#f0f0f0";
                  }
                }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginTop: "1rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;