import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import FormField from "../../components/FormField";

const AddClient = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [selectedTaxType, setSelectedTaxType] = useState(""); 

  const handleTaxTypeChange = (event) => {
    setSelectedTaxType(event.target.value); 
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        client_name: data.clientName,
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
        phone: data.phone,
        tax_type: data.taxType,
        website: data.website,
        invoice_series: data.invoiceSeries,
        status: data.status === "true",
      };

      if (data.taxType === "gst") payload.gst = data.gst;
      if (data.taxType === "vat") payload.vat = data.vat;

      await apiClient.post("clients/clients/", payload);

      alert("Client added successfully!");
      navigate("/clients/view");
    } catch (error) {
      alert("Failed to add client. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Add Client
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <FormField
            label="Client Name"
            placeholder="Enter client name..."
            name="clientName"
            register={register}
            error={errors.clientName}
          />
          <FormField
            label="Country"
            placeholder="Enter country..."
            name="country"
            register={register}
            error={errors.country}
          />
          <FormField
            label="State"
            placeholder="Enter state..."
            name="state"
            register={register}
            error={errors.state}
          />
          <FormField
            label="City"
            placeholder="Enter city..."
            name="city"
            register={register}
            error={errors.city}
          />
          <FormField
            label="Address"
            placeholder="Enter address..."
            name="address"
            register={register}
            error={errors.address}
          />
          <FormField
            label="Phone"
            placeholder="Enter phone number..."
            name="phone"
            register={register}
            type="text"
            error={errors.phone}
          />
          <FormField
            label="Tax Type"
            name="taxType"
            register={register}
            error={errors.taxType}
            type="select"
            onChange={handleTaxTypeChange} // Track selection change
            options={[
              { value: "", label: "Select Tax Type" },
              { value: "gst", label: "GST" },
              { value: "vat", label: "VAT" },
              { value: "none", label: "None" },
            ]}
          />
          {selectedTaxType === "gst" && (
            <FormField
              label="GST Number"
              placeholder="Enter GST number..."
              name="gst"
              register={register}
              error={errors.gst}
              type="text"
            />
          )}
          {selectedTaxType === "vat" && (
            <FormField
              label="VAT Number"
              placeholder="Enter VAT number..."
              name="vat"
              register={register}
              error={errors.vat}
              type="text"
            />
          )}
          <FormField
            label="Website"
            placeholder="Enter website URL..."
            name="website"
            register={register}
            type="url"
            error={errors.website}
          />
          <FormField
            label="Invoice Series"
            name="invoiceSeries"
            register={register}
            error={errors.invoiceSeries}
            type="select"
            options={[
              { value: "", label: "Select Invoice Series" },
              { value: "domestic", label: "Domestic" },
              { value: "international", label: "International" },
            ]}
          />
          <FormField
            label="Status"
            name="status"
            register={register}
            error={errors.status}
            type="select"
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
          />
          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-gray-900 text-white font-semibold px-4 py-2 rounded-md border border-gray-900 transition hover:bg-white hover:text-gray-900"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
