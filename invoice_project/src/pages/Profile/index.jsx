import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import FormField from "../../components/FormField";
import profilePic from "../../assets/images/profile-icon.jpg";

const Profile = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [profileImage, setProfileImage] = useState(profilePic);
  const [showResetForm, setShowResetForm] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const onSubmitProfile = async (data) => {
    try {
      await apiClient.post("update_profile/", {
        name: data.name,
        username: data.username,
        email: data.email,
      });
      alert("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    }
  };

  const onSubmitResetPassword = async (data) => {
    try {
      await apiClient.post("reset_password/", {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      alert("Password reset successfully!");
      setShowResetForm(false);
    } catch (error) {
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Profile Settings
        </h2>
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
            <label className="absolute bottom-2 right-0 bg-black text-white font-bold hover:bg-gray-900 px-2.5 py-1 rounded-full cursor-pointer">
              +
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              placeholder="Enter your name..."
              name="name"
              register={register}
              error={errors.name}
            />
            <FormField
              label="Username"
              placeholder="Enter username..."
              name="username"
              register={register}
              error={errors.username}
            />
            <FormField
              label="Email"
              placeholder="Enter email..."
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md text-sm font-bold hover:bg-gray-900 transition-colors duration-300"
          >
            Save Profile
          </button>
        </form>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Forgot Password?
          </h3>
          <p className="text-gray-600 mb-4">
            If you’ve forgotten your password, you can reset it here.
          </p>
          <button
            onClick={() => setShowResetForm(!showResetForm)}
            className="bg-black text-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-900 transition-colors duration-300"
          >
            {showResetForm ? "Cancel" : "Reset Password"}
          </button>
        </div>
        {showResetForm && (
          <form
            onSubmit={handleSubmit(onSubmitResetPassword)}
            className="mt-6 space-y-6 border-t pt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Current Password"
                placeholder="Enter current password..."
                name="currentPassword"
                type="password"
                register={register}
                error={errors.currentPassword}
              />
              <FormField
                label="New Password"
                placeholder="Enter new password..."
                name="newPassword"
                type="password"
                register={register}
                error={errors.newPassword}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-900 transition-colors duration-300"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
