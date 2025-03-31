import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";

const AdditionalSettings = () => {
  const { register } = useForm();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSeries, setEditingSeries] = useState(null);
  const [seriesData, setSeriesData] = useState({});

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await apiClient.get("branch/branch_addresses/");
      setAddresses(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch addresses. Please try again later.");
      setLoading(false);
    }
  };

  const handleEditSeries = (address) => {
    setEditingSeries(address.id);
    setSeriesData((prev) => ({
      ...prev,
      [address.id]: address.series_prefix || "",
    }));
  };

  const handleUpdateSeries = async (id) => {
    try {
      const response = await apiClient.patch(`branch/branch_addresses/${id}/`, {
        series_prefix: seriesData[id],
      });
      fetchAddresses();
      setEditingSeries(null);
      alert("Series prefix updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update series prefix. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingSeries(null);
    setSeriesData({});
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl py-6 overflow-x-auto">
        <h2 className="text-xl text-gray-800 font-extrabold text-center mb-6">
          Change Invoice Series Prefix
        </h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading addresses...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : addresses.length === 0 ? (
          <p className="text-center text-gray-500">No addresses found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-4 font-bold border-b border-gray-500 text-xs text-gray-800">ID</th>
                <th className="p-4 font-bold border-b border-gray-500 text-xs text-gray-800">Branch Address</th>
                <th className="p-4 font-bold border-b border-gray-500 text-xs text-gray-800">Current Series Prefix</th>
                <th className="p-4 font-bold border-b border-gray-500 text-xs text-gray-800">Change Series Prefix</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.id} className="border-b border-gray-500 hover:bg-gray-100">
                  <td className="p-4 align-middle">{address.id}</td>
                  <td className="p-4 align-middle">{address.branch_address}</td>
                  <td className="p-4 align-middle">{address.series_prefix || "N/A"}</td>
                  <td className="p-4 align-middle">
                    {editingSeries === address.id ? (
                      <>
                        <FormField
                          label="New Series Prefix"
                          name={`series_prefix-${address.id}`}
                          type="text"
                          value={seriesData[address.id]}
                          onChange={(e) =>
                            setSeriesData((prev) => ({
                              ...prev,
                              [address.id]: e.target.value,
                            }))
                          }
                          className="w-full p-2"
                          register={register}
                        />
                        <div className="flex justify-center items-center gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateSeries(address.id)}
                            className="flex items-center gap-1 bg-green-500 text-xs font-medium text-white px-3 py-2 rounded hover:bg-green-600 transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 bg-gray-500 text-xs font-medium text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditSeries(address)}
                        className="flex items-center gap-1 bg-blue-500 text-xs font-medium text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Change Series Prefix
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdditionalSettings;